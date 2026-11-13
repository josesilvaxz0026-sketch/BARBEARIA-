import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import { InventoryItem, StockMovement } from '../../types';
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  DollarSign,
  Share2,
  Phone,
  CheckCircle2,
  Trash2,
  Edit2,
  History,
  Layers,
  Sparkles,
} from 'lucide-react';

export const TabEstoque: React.FC = () => {
  const {
    inventory,
    stockMovements,
    lowStockItems,
    addStockMovement,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    shopInfo,
  } = useBarber();

  const [activeTab, setActiveTab] = useState<'produtos' | 'movimentacoes'>('produtos');
  const [filterType, setFilterType] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick Movement Modal
  const [movementModalItem, setMovementModalItem] = useState<InventoryItem | null>(null);
  const [movementType, setMovementType] = useState<'entrada' | 'saida_venda' | 'saida_perda'>('entrada');
  const [movementQuantity, setMovementQuantity] = useState<number>(1);
  const [movementNotes, setMovementNotes] = useState<string>('');

  // Create / Edit Item Modal
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemName, setItemName] = useState<string>('');
  const [itemSku, setItemSku] = useState<string>('');
  const [itemCategory, setItemCategory] = useState<InventoryItem['category']>('consumo_interno');
  const [itemType, setItemType] = useState<InventoryItem['type']>('consumo_interno');
  const [itemCurrentStock, setItemCurrentStock] = useState<number>(10);
  const [itemMinStock, setItemMinStock] = useState<number>(5);
  const [itemCostPrice, setItemCostPrice] = useState<number>(10.0);
  const [itemSellingPrice, setItemSellingPrice] = useState<number>(20.0);
  const [itemUnit, setItemUnit] = useState<InventoryItem['unit']>('un');

  // WhatsApp Supplier Order Generator
  const [copiedNotice, setCopiedNotice] = useState<string>('');

  // Filtered inventory
  const filteredInventory = inventory.filter((item) => {
    if (filterType === 'baixo' && item.currentStock > item.minStockAlert) return false;
    if (filterType === 'consumo_interno' && item.type !== 'consumo_interno') return false;
    if (filterType === 'venda_cliente' && item.type !== 'venda_cliente') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchSku = item.sku.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  // Calculate metrics
  const totalStockValue = inventory.reduce(
    (acc, item) => acc + item.currentStock * item.costPrice,
    0
  );
  const totalRetailPotential = inventory.reduce(
    (acc, item) => acc + (item.sellingPrice ? item.currentStock * item.sellingPrice : 0),
    0
  );

  const handleOpenMovementModal = (item: InventoryItem, type: 'entrada' | 'saida_venda') => {
    setMovementModalItem(item);
    setMovementType(type);
    setMovementQuantity(1);
    setMovementNotes(type === 'entrada' ? 'Reposição de estoque' : 'Venda direta no balcão');
  };

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementModalItem || movementQuantity <= 0) return;

    addStockMovement(
      movementModalItem.id,
      movementType,
      movementQuantity,
      movementNotes
    );

    setMovementModalItem(null);
  };

  const handleOpenCreateItem = () => {
    setEditingItem(null);
    setItemName('');
    setItemSku(`LB-${Math.floor(100 + Math.random() * 900)}`);
    setItemCategory('consumo_interno');
    setItemType('consumo_interno');
    setItemCurrentStock(10);
    setItemMinStock(5);
    setItemCostPrice(5.0);
    setItemSellingPrice(0);
    setItemUnit('un');
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemSku(item.sku);
    setItemCategory(item.category);
    setItemType(item.type);
    setItemCurrentStock(item.currentStock);
    setItemMinStock(item.minStockAlert);
    setItemCostPrice(item.costPrice);
    setItemSellingPrice(item.sellingPrice || 0);
    setItemUnit(item.unit);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    if (editingItem) {
      updateInventoryItem(editingItem.id, {
        name: itemName.trim(),
        sku: itemSku.trim(),
        category: itemCategory,
        type: itemType,
        currentStock: Number(itemCurrentStock),
        minStockAlert: Number(itemMinStock),
        costPrice: Number(itemCostPrice),
        sellingPrice: itemType === 'venda_cliente' ? Number(itemSellingPrice) : undefined,
        unit: itemUnit,
      });
    } else {
      createInventoryItem({
        name: itemName.trim(),
        sku: itemSku.trim(),
        category: itemCategory,
        type: itemType,
        currentStock: Number(itemCurrentStock),
        minStockAlert: Number(itemMinStock),
        costPrice: Number(itemCostPrice),
        sellingPrice: itemType === 'venda_cliente' ? Number(itemSellingPrice) : undefined,
        unit: itemUnit,
        lastRestocked: new Date().toISOString().split('T')[0],
      });
    }

    setIsItemModalOpen(false);
  };

  // Generate WhatsApp order message for supplier
  const generateSupplierOrder = () => {
    if (lowStockItems.length === 0) {
      alert('Nenhum item está com estoque baixo no momento!');
      return;
    }

    let text = `📦 *PEDIDO DE REPOSIÇÃO - ${shopInfo.name.toUpperCase()}* 📦%0A%0A`;
    text += `Olá! Segue a lista de produtos com estoque baixo para reposição:%0A%0A`;

    lowStockItems.forEach((item, index) => {
      const needed = Math.max(1, (item.minStockAlert * 2) - item.currentStock);
      text += `${index + 1}. *${item.name}* (SKU: ${item.sku})%0A`;
      text += `   • Estoque Atual: ${item.currentStock} ${item.unit}%0A`;
      text += `   • Sugestão de Pedido: *+${needed} ${item.unit}*%0A%0A`;
    });

    text += `📍 Endereço de Entrega: ${shopInfo.address}, ${shopInfo.neighborhood}, ${shopInfo.city}%0A`;
    text += `Poderia me informar os valores e o prazo de entrega? Obrigado!`;

    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Total de Itens</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white font-accent mt-1">
            {inventory.length} cadastrados
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Estoque Baixo / Reposição</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockItems.length > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
          </div>
          <p className={`text-2xl font-black font-accent mt-1 ${lowStockItems.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {lowStockItems.length} {lowStockItems.length === 1 ? 'item crítico' : 'itens críticos'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Valor em Estoque (Custo)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white font-accent mt-1">
            R$ {totalStockValue.toFixed(2).replace('.', ',')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Potencial Revenda</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-black text-sky-400 font-accent mt-1">
            R$ {totalRetailPotential.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      {/* Low Stock Warning Banner if applicable */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-300">
                Atenção: {lowStockItems.length} produto(s) atingiram a quantidade mínima de segurança!
              </p>
              <p className="text-[11px] text-rose-300/80">
                Itens com risco de faltar no atendimento ou nas vendas.
              </p>
            </div>
          </div>

          <button
            onClick={generateSupplierOrder}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Gerar Pedido no WhatsApp</span>
          </button>
        </div>
      )}

      {/* Tabs (Produtos vs Movimentações) & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('produtos')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'produtos' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Tabela de Produtos ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('movimentacoes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'movimentacoes' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Histórico de Entradas & Saídas</span>
          </button>
        </div>

        {activeTab === 'produtos' && (
          <button
            onClick={handleOpenCreateItem}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto / Insumo</span>
          </button>
        )}
      </div>

      {/* TAB 1: PRODUTOS */}
      {activeTab === 'produtos' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilterType('todos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  filterType === 'todos' ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-400'
                }`}
              >
                Todos ({inventory.length})
              </button>
              <button
                onClick={() => setFilterType('consumo_interno')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  filterType === 'consumo_interno' ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-400'
                }`}
              >
                Consumo Interno (Lâminas, Golas)
              </button>
              <button
                onClick={() => setFilterType('venda_cliente')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  filterType === 'venda_cliente' ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-400'
                }`}
              >
                Revenda (Pomadas, Óleos, Bebidas)
              </button>
              <button
                onClick={() => setFilterType('baixo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  filterType === 'baixo' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-rose-400'
                }`}
              >
                Estoque Baixo ({lowStockItems.length})
              </button>
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome ou SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Estoque Atual</th>
                    <th className="py-3 px-4">Mínimo Alerta</th>
                    <th className="py-3 px-4">Preço Custo</th>
                    <th className="py-3 px-4">Preço Venda</th>
                    <th className="py-3 px-4 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center text-neutral-400 text-xs">
                        {inventory.length === 0
                          ? 'Estoque zerado. Nenhum produto ou insumo cadastrado ainda — clique em "+ Novo Produto / Insumo" para começar.'
                          : 'Nenhum item encontrado para os filtros aplicados.'}
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const isLow = item.currentStock <= item.minStockAlert;
                      const stockPercentage = item.minStockAlert > 0
                        ? Math.min(100, (item.currentStock / (item.minStockAlert * 2)) * 100)
                        : 100;

                    return (
                      <tr key={item.id} className="hover:bg-neutral-900 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[10px] text-amber-400 block">{item.sku}</span>
                          <span className="font-bold text-white text-sm">{item.name}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] text-neutral-400">
                            {item.type === 'consumo_interno' ? 'Consumo Barbeiro' : 'Venda Cliente'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-accent font-black text-base ${isLow ? 'text-rose-400' : 'text-white'}`}>
                              {item.currentStock} {item.unit}
                            </span>
                            {isLow && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                Baixo
                              </span>
                            )}
                          </div>
                          {/* Progress bar */}
                          <div className="w-24 h-1.5 rounded-full bg-neutral-800 mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                              style={{ width: `${stockPercentage}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-400">
                          {item.minStockAlert} {item.unit}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-300">
                          R$ {item.costPrice.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3.5 px-4">
                          {item.sellingPrice ? (
                            <span className="font-accent font-bold text-amber-400">
                              R$ {item.sellingPrice.toFixed(2).replace('.', ',')}
                            </span>
                          ) : (
                            <span className="text-neutral-500">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenMovementModal(item, 'entrada')}
                              title="Adicionar Entrada (+)"
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                            >
                              + Entrada
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenMovementModal(item, 'saida_venda')}
                              title="Registrar Saída (-)"
                              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
                            >
                              - Saída
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditItem(item)}
                              title="Editar Produto"
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Deseja remover ${item.name} do estoque?`)) {
                                  deleteInventoryItem(item.id);
                                }
                              }}
                              title="Excluir"
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTÓRICO DE MOVIMENTAÇÕES */}
      {activeTab === 'movimentacoes' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            {stockMovements.length === 0 ? (
              <div className="p-10 text-center text-neutral-400 text-xs">
                Nenhuma movimentação registrada até o momento. As baixas automáticas de serviços e ajustes manuais aparecerão aqui.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-950/80 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">Data / Hora</th>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Tipo Movimento</th>
                      <th className="py-3 px-4">Qtd</th>
                      <th className="py-3 px-4">Estoque (Antes → Depois)</th>
                      <th className="py-3 px-4">Motivo / Agendamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {stockMovements.map((mov) => {
                      const isEntry = mov.type === 'entrada';
                      const formattedTime = new Date(mov.timestamp).toLocaleString('pt-BR');

                      return (
                        <tr key={mov.id} className="hover:bg-neutral-900 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                            {formattedTime}
                          </td>
                          <td className="py-3 px-4 font-bold text-white">{mov.itemName}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                isEntry
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : mov.type === 'saida_atendimento'
                                  ? 'bg-amber-500/15 text-amber-300'
                                  : 'bg-sky-500/15 text-sky-400'
                              }`}
                            >
                              {mov.type === 'entrada'
                                ? 'Entrada / Compra'
                                : mov.type === 'saida_atendimento'
                                ? 'Baixa por Atendimento'
                                : mov.type === 'saida_venda'
                                ? 'Venda Balcão'
                                : 'Ajuste'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-black font-accent text-sm ${isEntry ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {isEntry ? `+${mov.quantity}` : `-${mov.quantity}`}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-neutral-400 text-[11px]">
                            {mov.previousStock} → <strong className="text-white">{mov.newStock}</strong>
                          </td>
                          <td className="py-3 px-4 text-neutral-300 text-[11px]">
                            {mov.notes || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUICK MOVEMENT MODAL (+ / -) */}
      {movementModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-heading text-base font-bold text-white uppercase mb-2">
              Movimentar Estoque
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Item: <strong className="text-amber-400">{movementModalItem.name}</strong> (Atual: {movementModalItem.currentStock} {movementModalItem.unit})
            </p>

            <form onSubmit={handleSaveMovement} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Tipo de Movimento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovementType('entrada')}
                    className={`py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      movementType === 'entrada'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    + Entrada (Compra)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType('saida_venda')}
                    className={`py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      movementType !== 'entrada'
                        ? 'bg-amber-500 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    - Saída (Venda / Uso)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Quantidade ({movementModalItem.unit})</label>
                <input
                  type="number"
                  min="1"
                  value={movementQuantity}
                  onChange={(e) => setMovementQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-base font-bold text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Motivo / Observação</label>
                <input
                  type="text"
                  value={movementNotes}
                  onChange={(e) => setMovementNotes(e.target.value)}
                  placeholder="Ex: compra nota 412, venda balcão..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMovementModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-xs text-neutral-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT ITEM MODAL */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0f1117] border border-neutral-800 rounded-3xl p-6 shadow-2xl my-auto">
            <h3 className="font-heading text-base font-bold text-white uppercase mb-4">
              {editingItem ? 'Editar Produto / Insumo' : 'Cadastrar Novo Item no Estoque'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-neutral-400 block mb-1">Nome do Item *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pomada Efeito Matte 150g"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Código / SKU</label>
                  <input
                    type="text"
                    value={itemSku}
                    onChange={(e) => setItemSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Finalidade</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none"
                  >
                    <option value="consumo_interno">Consumo Interno (Barbeiro)</option>
                    <option value="venda_cliente">Venda para Clientes</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Unidade</label>
                  <select
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none"
                  >
                    <option value="un">Unidade (un)</option>
                    <option value="cx">Caixa (cx)</option>
                    <option value="pct">Pacote (pct)</option>
                    <option value="ml">Mililitros (ml)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Estoque Atual</label>
                  <input
                    type="number"
                    min="0"
                    value={itemCurrentStock}
                    onChange={(e) => setItemCurrentStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Mínimo para Alerta</label>
                  <input
                    type="number"
                    min="1"
                    value={itemMinStock}
                    onChange={(e) => setItemMinStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Preço de Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemCostPrice}
                    onChange={(e) => setItemCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                {itemType === 'venda_cliente' && (
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Preço de Venda (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={itemSellingPrice}
                      onChange={(e) => setItemSellingPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-xs text-neutral-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
