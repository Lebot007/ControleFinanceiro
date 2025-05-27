import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Meta, CORES_METAS } from '../types';
import { calcularProgressoMetaHelper, gerarIdMeta, obterMetasStorage, salvarMetasStorage } from '../utils/metasHelpers';

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

export const MetasProvider: React.FC<MetasProviderProps> = ({ children }) => {
  const [metas, setMetas] = useState<Meta[]>([]);

  // Carregar metas do localStorage ao iniciar
  useEffect(() => {
    const metasSalvas = obterMetasStorage();
    if (metasSalvas) setMetas(metasSalvas);
  }, []);

  // Salvar metas no localStorage quando mudam
  useEffect(() => {
    salvarMetasStorage(metas);
  }, [metas]);

  const adicionarMeta = (meta: Omit<Meta, 'id'>) => {
    const index = metas.length % CORES_METAS.length;
    const novaMeta: Meta = {
      ...meta,
      id: gerarIdMeta(),
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
    
    const progresso = calcularProgressoMetaHelper(meta);
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