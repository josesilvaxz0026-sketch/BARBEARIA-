import React, { useState } from 'react';
import { useBarber } from '../../context/BarberContext';
import {
  Save,
  Lock,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertCircle,
  Phone,
  MapPin,
  Building,
} from 'lucide-react';

export const TabConfiguracoes: React.FC = () => {
  const {
    shopInfo,
    updateShopInfo,
    updateAdminPin,
    clearManagementData,
    resetToDefaults,
    exportBackupJson,
    importBackupJson,
  } = useBarber();

  // Shop Info Form
  const [name, setName] = useState<string>(shopInfo.name);
  const [whatsapp, setWhatsapp] = useState<string>(shopInfo.whatsapp);
  const [whatsappFormatted, setWhatsappFormatted] = useState<string>(shopInfo.whatsappFormatted);
  const [address, setAddress] = useState<string>(shopInfo.address);
  const [neighborhood, setNeighborhood] = useState<string>(shopInfo.neighborhood);
  const [city, setCity] = useState<string>(shopInfo.city);

  // PIN Form
  const [newPin, setNewPin] = useState<string>('');
  const [pinNotice, setPinNotice] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // General Notice
  const [generalNotice, setGeneralNotice] = useState<string>('');

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopInfo({
      name: name.trim(),
      whatsapp: whatsapp.replace(/\D/g, ''),
      whatsappFormatted: whatsappFormatted.trim(),
      address: address.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
    });
    setGeneralNotice('Dados da barbearia atualizados com sucesso!');
    setTimeout(() => setGeneralNotice(''), 3500);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      setPinError('O PIN deve ter no mínimo 4 dígitos.');
      return;
    }
    updateAdminPin(newPin.trim());
    setPinNotice('Novo PIN de segurança salvo com sucesso!');
    setPinError('');
    setNewPin('');
    setTimeout(() => setPinNotice(''), 3500);
  };

  const handleExport = () => {
    const dataStr = exportBackupJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lorran_barros_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupJson(content);
      if (success) {
        alert('Backup restaurado com sucesso!');
        window.location.reload();
      } else {
        alert('Arquivo de backup inválido.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearNumbers = () => {
    if (
      window.confirm(
        'Tem certeza que deseja zerar todos os agendamentos, estoque e métricas de vendas? Seus serviços, equipe e horários configurados serão mantidos.'
      )
    ) {
      clearManagementData();
      setGeneralNotice('Todos os números de gestão e estoque foram zerados!');
      setTimeout(() => setGeneralNotice(''), 3500);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Tem certeza que deseja restaurar todas as configurações padrão e zerar todos os dados da Lorran Barros Barbearias?'
      )
    ) {
      resetToDefaults();
      alert('Dados resetados com sucesso.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {generalNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{generalNotice}</span>
        </div>
      )}

      {/* 1. SHOP INFORMATION */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
          <Building className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-heading text-base font-bold text-white uppercase">
              Informações Oficiais da Barbearia
            </h3>
            <p className="text-xs text-neutral-400">
              Dados exibidos no cabeçalho, rodapé e nas mensagens de agendamento do WhatsApp
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Nome do Estabelecimento</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">WhatsApp (apenas números com DDD)</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="21979669281"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">WhatsApp Formatado</label>
              <input
                type="text"
                value={whatsappFormatted}
                onChange={(e) => setWhatsappFormatted(e.target.value)}
                placeholder="(21) 97966-9281"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-neutral-400 block mb-1">Logradouro & Número</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua Coronel Júlio Braga, nº 78"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Bairro</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Areia Branca"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Cidade / Estado</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Belford Roxo - RJ"
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Dados da Barbearia</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. ADMIN SECURITY PIN */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
          <Lock className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-heading text-base font-bold text-white uppercase">
              Segurança & PIN do Administrador
            </h3>
            <p className="text-xs text-neutral-400">
              Protege o acesso à gestão para que clientes vejam apenas a área de agendamento online
            </p>
          </div>
        </div>

        {pinNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            {pinNotice}
          </div>
        )}
        {pinError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {pinError}
          </div>
        )}

        <form onSubmit={handleSavePin} className="flex flex-col sm:flex-row items-end gap-3 max-w-md">
          <div className="w-full">
            <label className="text-xs text-neutral-400 block mb-1">Novo PIN (mínimo 4 números)</label>
            <input
              type="password"
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Digite o novo PIN"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white outline-none focus:border-amber-500 font-mono tracking-widest"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer"
          >
            Alterar PIN
          </button>
        </form>
      </div>

      {/* 3. BACKUP & SYSTEM RECOVERY */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
          <Download className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-heading text-base font-bold text-white uppercase">
              Backup e Exportação de Dados
            </h3>
            <p className="text-xs text-neutral-400">
              Guarde uma cópia de segurança de todos os seus produtos, agendamentos e horários
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Baixar Arquivo de Backup (JSON)</span>
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Restaurar de Arquivo JSON</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <button
              onClick={handleClearNumbers}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>Zerar Números & Estoque</span>
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-rose-400" />
              <span>Restaurar Tudo ao Padrão</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
