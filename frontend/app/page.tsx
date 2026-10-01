'use client';

import { useState, useEffect } from 'react';
import ModalNovoPaciente from '@/src/components/ModalNovoPaciente';
import TabelaPacientes, { Paciente } from '@/src/components/TabelaPacientes';
import { api } from '@/src/services/api';

export default function Home() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [tutores, setTutores] = useState<unknown[]>([]);
  const [veterinarios, setVeterinarios] = useState<unknown[]>([]);
  const [clinicas, setClinicas] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);

  const loadData = async () => {
    setLoading(true);
    
    const fetchPacientes = api.getPacientes().catch((err: unknown) => {
      console.warn('Não foi possível carregar os pacientes:', err);
      return [] as Paciente[];
    });

    const fetchTutores = api.getTutores().catch((err: unknown) => {
      console.warn('Não foi possível carregar a lista de tutores:', err);
      return [];
    });

    const fetchVeterinarios = api.getVeterinarios().catch((err: unknown) => {
      console.warn('Não foi possível carregar a lista de veterinários:', err);
      return [];
    });

    const fetchClinicas = api.getClinicas().catch((err: unknown) => {
      console.warn('Not possible to load clinics:', err);
      return [];
    });

    try {
      const [pData, tData, vData, cData] = await Promise.all([
        fetchPacientes,
        fetchTutores,
        fetchVeterinarios,
        fetchClinicas,
      ]);

      setPacientes(pData);
      setTutores(tData);
      setVeterinarios(vData);
      setClinicas(cData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido ao carregar os dados.';
      console.error('Falha crítica durante o carregamento do Dashboard:', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePaciente = async (data: unknown) => {
    try {
      await api.createPaciente(data);
      await loadData();
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar paciente.';
      alert(msg);
    }
  };

  const handleUpdatePaciente = async (data: unknown) => {
    if (!editingPaciente) return;
    try {
      await api.updatePaciente(editingPaciente.id, data);
      await loadData();
      setEditingPaciente(null);
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar paciente.';
      alert(msg);
    }
  };

  const handleDeletePaciente = async (id: number) => {
    if (confirm('Tem certeza de que deseja remover este paciente?')) {
      try {
        await api.deletePaciente(id);
        await loadData();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao excluir paciente.';
        alert(msg);
      }
    }
  };

  const pacientesRecentes = [...pacientes]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div className="space-y-8 pb-10 min-h-screen bg-[#090714] text-purple-100 p-6">
      {/* Cabeçalho */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#130f26]/80 backdrop-blur-md p-6 rounded-2xl border border-purple-900/40 shadow-xl shadow-purple-950/20">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-emerald-400 to-green-500 tracking-tight">
            Painel de Informações
          </h2>
          <p className="text-sm text-purple-300/70 mt-1">
            Acompanhe as estatísticas e cadastros da clínica em tempo real.
          </p>
        </div>
        <button
          onClick={() => { setEditingPaciente(null); setIsModalOpen(true); }}
          className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30 transition-all duration-200 cursor-pointer"
        >
          + Novo Paciente
        </button>
      </header>

      {/* Cards de Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Pacientes */}
        <div className="group bg-[#130f26] p-6 rounded-2xl border border-purple-900/50 hover:border-emerald-500/50 shadow-xl shadow-purple-950/30 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Pacientes</p>
            <h3 className="text-4xl font-black text-white mt-2 tracking-tight">{pacientes.length}</h3>
            <span className="inline-block mt-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Atendidos
            </span>
          </div>
          <div className="w-14 h-14 bg-purple-900/40 text-emerald-400 border border-purple-700/50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 shadow-inner">
            🐾
          </div>
        </div>

        {/* Card 2: Tutores */}
        <div className="group bg-[#130f26] p-6 rounded-2xl border border-purple-900/50 hover:border-emerald-500/50 shadow-xl shadow-purple-950/30 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Tutores Cadastrados</p>
            <h3 className="text-4xl font-black text-white mt-2 tracking-tight">{tutores.length}</h3>
            <span className="inline-block mt-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Vinculados
            </span>
          </div>
          <div className="w-14 h-14 bg-purple-900/40 text-emerald-400 border border-purple-700/50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 shadow-inner">
            👤
          </div>
        </div>

        {/* Card 3: Veterinários */}
        <div className="group bg-[#130f26] p-6 rounded-2xl border border-purple-900/50 hover:border-emerald-500/50 shadow-xl shadow-purple-950/30 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Veterinários</p>
            <h3 className="text-4xl font-black text-white mt-2 tracking-tight">{veterinarios.length}</h3>
            <span className="inline-block mt-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Especialistas
            </span>
          </div>
          <div className="w-14 h-14 bg-purple-900/40 text-emerald-400 border border-purple-700/50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 shadow-inner">
            🩺
          </div>
        </div>

        {/* Card 4: Unidades / Clínicas */}
        <div className="group bg-[#130f26] p-6 rounded-2xl border border-purple-900/50 hover:border-emerald-500/50 shadow-xl shadow-purple-950/30 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Unidades / Clínicas</p>
            <h3 className="text-4xl font-black text-white mt-2 tracking-tight">{clinicas.length}</h3>
            <span className="inline-block mt-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Disponíveis
            </span>
          </div>
          <div className="w-14 h-14 bg-purple-900/40 text-emerald-400 border border-purple-700/50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 shadow-inner">
            🏥
          </div>
        </div>
      </section>

      {/* Tabela de Últimos Pacientes */}
      <section className="bg-[#130f26] rounded-2xl border border-purple-900/50 shadow-xl shadow-purple-950/30 overflow-hidden">
        <div className="p-6 border-b border-purple-900/40 flex justify-between items-center bg-purple-950/30">
          <div>
            <h3 className="font-extrabold text-purple-100 text-lg">Últimos Pacientes Cadastrados</h3>
          </div>
        </div>

        <TabelaPacientes
          pacientes={pacientesRecentes}
          loading={loading}
          onEdit={(p) => { setEditingPaciente(p); setIsModalOpen(true); }}
          onDelete={handleDeletePaciente}
        />
      </section>

      {/* Modal */}
      <ModalNovoPaciente
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPaciente(null); }}
        onSubmit={editingPaciente ? handleUpdatePaciente : handleCreatePaciente}
        pacienteInicial={editingPaciente}
        tutores={tutores}
        veterinarios={veterinarios}
        clinicas={clinicas}
      />
    </div>
  );
}