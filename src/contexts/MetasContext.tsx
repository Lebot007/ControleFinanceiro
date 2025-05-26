import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Meta {
  id: string;
  titulo: string;
  valorAlvo: number;
  valorAtual: number;
  dataInicio: string;
  dataFinal?: string;
  cor: string;
  ativa: boolean;
}

interface MetasContextType {
  metas: Meta[];
  adicionarMeta: (meta: Omit<Meta, 'id'>) => void;
  editarMeta: (id: string, meta: Partial<Meta>) => void;
  removerMeta: (id: string) => void;
  adicionarValorMeta: (id: string, valor: number) => void;
  calcularProgressoMeta: (id: string) => number;
}

const MetasContext = createContext<MetasContextType | undefined>(undefined);

export const useMetas = () => {
  const context = useContext(MetasContext);
  if (!context) {
    throw new Error('useMetas deve ser usado dentro de um MetasProvider');
  }
  return context;
};

interface MetasProviderProps {
  children: ReactNode;
}

const CORES_METAS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#6366F1', '#D946EF', '#F97316'
];

export const MetasProvider: React.FC<MetasProviderProps> = ({ children }) => {
  const [metas, setMetas] = useState<Meta[]>([]);

  // Carregar metas do localStorage ao iniciar
  useEffect(() => {
    const metasSalvas = localStorage.getItem('metas');
    if (metasSalvas) setMetas(JSON.parse(metasSalvas));
  }, []);

  // Salvar metas no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem('metas', JSON.stringify(metas));
  }, [metas]);

  const adicionarMeta = (meta: Omit<Meta, 'id'>) => {
    const index = metas.length % CORES_METAS.length;
    const novaMeta: Meta = {
      ...meta,
      id: crypto.randomUUID(),
      cor: meta.cor || CORES_METAS[index],
      dataInicio: meta.dataInicio || new Date().toISOString(),
      ativa: meta.ativa !== undefined ? meta.ativa : true
    };
    setMetas([...metas, novaMeta]);
  };

  const editarMeta = (id: string, metaAtualizada: Partial<Meta>) => {
    setMetas(metas.map(meta => 
      meta.id === id ? { ...meta, ...metaAtualizada } : meta
    ));
  };

  const removerMeta = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta meta?')) {
      setMetas(metas.filter(meta => meta.id !== id));
    }
  };

  const adicionarValorMeta = (id: string, valor: number) => {
    setMetas(metas.map(meta => {
      if (meta.id === id) {
        const novoValor = meta.valorAtual + valor;
        // Se o novo valor atingir ou ultrapassar o alvo, marcar como inativa
        const ativa = novoValor < meta.valorAlvo;
        return { 
          ...meta, 
          valorAtual: novoValor,
          ativa
        };
      }
      return meta;
    }));
  };

  const calcularProgressoMeta = (id: string) => {
    const meta = metas.find(m => m.id === id);
    if (!meta) return 0;
    
    const progresso = (meta.valorAtual / meta.valorAlvo) * 100;
    return Math.min(progresso, 100); // Limita a 100% mesmo se ultrapassar
  };

  const contextValue: MetasContextType = {
    metas,
    adicionarMeta,
    editarMeta,
    removerMeta,
    adicionarValorMeta,
    calcularProgressoMeta
  };

  return (
    <MetasContext.Provider value={contextValue}>
      {children}
    </MetasContext.Provider>
  );
};