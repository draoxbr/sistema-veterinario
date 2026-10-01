'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/services/api';

export interface Clinica {
  id: number;
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
}

export default function ClinicasPage() {
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClinica, setEditingClinica] = useState<Clinica | null>(null);
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getClinicas();
      setClinicas(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido ao carregar clínicas';
      console.error('Falha ao carregar clínicas:', message);
      setClinicas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingClinica(null);
    setNome('');
    setEndereco('');
    setTelefone('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (clinica: Clinica) => {
    setEditingClinica(clinica);
    setNome(clinica.nome || '');
    setEndereco(clinica.endereco || '');
    setTelefone(clinica.telefone || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClinica(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      alert('O nome da clínica é obrigatório.');
      return;
    }

    try {
      const payload = { nome, endereco, telefone };

      if (editingClinica) {
        await api.updateClinica(editingClinica.id, payload);
      } else {
        await api.createClinica(payload);
      }

      await fetchData();
      handleCloseModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar clínica.';
      alert(msg);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja remover esta clínica?')) {
      try {
        await api.deleteClinica(id);
        await fetchData();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao excluir clínica.';
        alert(msg);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="p-8 text-center text-purple-400 font-medium">A carregar clínicas...</div>;
    }

    if (clinicas.length === 0) {
      return <div className="p-8 text-center text-purple-300/60 font-medium">Nenhuma clínica encontrada.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-purple-200">
          <thead className="bg-purple-950/40 text-purple-300 font-bold uppercase text-xs border-b border-purple-900/40">
            <tr>
              <th scope="col" className="px-6 py-4">ID</th>
              <th scope="col" className="px-6 py-4">Nome da Clínica</th>
              <th scope="col" className="px-6 py-4">Endereço</th>
              <th scope="col" className="px-6 py-4">Contato</th>
              <th scope="col" className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/30">
            {clinicas.map((clinica) => (
              <tr key={clinica.id} className="hover:bg-purple-900/20 transition-colors">
                <td className="px-6 py-4 font-bold text-emerald-400">#{clinica.id}</td>
                <td className="px-6 py-4 font-semibold text-purple-100">{clinica.nome}</td>
                <td className="px-6 py-4 text-purple-300/80">{clinica.endereco || '—'}</td>
                <td className="px-6 py-4 text-xs">
                  <div className="font-mono text-emerald-400/90">{clinica.telefone || '—'}</div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(clinica)}
                    className="text-amber-400 hover:text-amber-300 font-medium text-xs px-2.5 py-1 rounded-lg hover:bg-amber-400/10 transition cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(clinica.id)}
                    className="text-red-400 hover:text-red-300 font-medium text-xs px-2.5 py-1 rounded-lg hover:bg-red-400/10 transition cursor-pointer"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-10 min-h-screen text-purple-100">
      <section className="bg-[#130f26] rounded-2xl border border-purple-900/50 shadow-xl shadow-purple-950/30 overflow-hidden">
        {/* Cabeçalho do Card */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b border-purple-900/40 bg-purple-950/30">
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-emerald-400 to-green-500 tracking-tight">
              Módulo de Clínicas
            </h2>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30 transition-all duration-200 cursor-pointer"
          >
            <span className="text-lg leading-none">+</span>
            <span>Nova Clínica</span>
          </button>
        </header>

        {/* Sub-cabeçalho da Tabela */}
        <div className="px-6 py-4 border-b border-purple-900/30 flex justify-between items-center bg-[#130f26]">
          <div>
            <h3 className="font-extrabold text-purple-200 text-base">Lista Geral de Clínicas</h3>
          </div>
          <span className="text-xs bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
            Total: {clinicas.length}
          </span>
        </div>

        {renderContent()}
      </section>

      {/* Modal Reestilizado */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#130f26] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-purple-800/60 text-purple-100">
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-purple-900/40 -mx-6 -mt-6 px-6 pt-6 bg-purple-950/40">
              <h3 className="text-lg font-extrabold text-purple-100 tracking-tight">
                {editingClinica ? 'Editar Clínica' : 'Cadastrar Nova Clínica'}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-purple-400 hover:text-purple-200 text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="clinicaNome" className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                  Nome *
                </label>
                <input
                  id="clinicaNome"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Clínica Veterinária Central"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090714] border border-purple-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-purple-100 placeholder-purple-400/40 text-sm transition-all"
                />
              </div>
              <div>
                <label htmlFor="clinicaEndereco" className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                  Endereço
                </label>
                <input
                  id="clinicaEndereco"
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Ex: Rua Principal, 123"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090714] border border-purple-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-purple-100 placeholder-purple-400/40 text-sm transition-all"
                />
              </div>
              <div>
                <label htmlFor="clinicaTel" className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                  Telefone
                </label>
                <input
                  id="clinicaTel"
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Ex: (87) 3861-0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090714] border border-purple-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-purple-100 placeholder-purple-400/40 text-sm transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-purple-900/40 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl font-bold text-purple-300 hover:bg-purple-900/40 text-sm transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm shadow-md shadow-emerald-500/20 transition cursor-pointer"
                >
                  {editingClinica ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}