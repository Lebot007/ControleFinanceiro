import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { formatarData } from '../utils/formatadores';

// Tipos
export interface Transacao {
  id: string;
  valor: number;
  data: string;
  descricao: string;
  tipo?: string; // Somente para despesas
  categoria?: string; // Somente para despesas
}

export interface CategoriaDespesa {
  id: string;
  nome: string;
  cor: string;
}

interface DadosContextType {
  receitas: Transacao[];
  despesas: Transacao[];
  categorias: CategoriaDespesa[];
  adicionarReceita: (receita: Omit<Transacao, 'id'>) => void;
  adicionarDespesa: (despesa: Omit<Transacao, 'id'>) => void;
  adicionarCategoria: (categoria: Omit<CategoriaDespesa, 'id'>) => void;
  removerReceita: (id: string) => void;
  removerDespesa: (id: string) => void;
  removerCategoria: (id: string) => void;
  editarReceita: (id: string, receita: Partial<Transacao>) => void;
  editarDespesa: (id: string, despesa: Partial<Transacao>) => void;
  editarCategoria: (id: string, categoria: Partial<CategoriaDespesa>) => void;
  limparTodosDados: () => void;
  calcularSaldoAtual: () => number;
  calcularTotalReceitas: (periodo?: 'mes' | 'ano') => number;
  calcularTotalDespesas: (periodo?: 'mes' | 'ano') => number;
  calcularDespesasPorCategoria: (periodo?: 'mes' | 'ano') => { categoria: string; valor: number; cor: string }[];
  exportarDados: () => string;
  importarDados: (dados: string) => boolean;
  obterDadosGrafico: (tipo: 'receitas-despesas' | 'categorias' | 'evolucao', periodo?: 'mes' | 'ano') => any;
}

const DadosContext = createContext<DadosContextType | undefined>(undefined);

export const useDados = () => {
  const context = useContext(DadosContext);
  if (!context) {
    throw new Error('useDados deve ser usado dentro de um DadosProvider');
  }
  return context;
};

interface DadosProviderProps {
  children: ReactNode;
}

const CORES_CATEGORIAS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#6366F1', '#D946EF', '#F97316'
];

export const DadosProvider: React.FC<DadosProviderProps> = ({ children }) => {
  const [receitas, setReceitas] = useState<Transacao[]>([]);
  const [despesas, setDespesas] = useState<Transacao[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDespesa[]>([]);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const receitasSalvas = localStorage.getItem('receitas');
    const despesasSalvas = localStorage.getItem('despesas');
    const categoriasSalvas = localStorage.getItem('categorias');

    if (receitasSalvas) setReceitas(JSON.parse(receitasSalvas));
    if (despesasSalvas) setDespesas(JSON.parse(despesasSalvas));
    if (categoriasSalvas) {
      setCategorias(JSON.parse(categoriasSalvas));
    } else {
      // Categorias padrão se não existirem
      const categoriasIniciais = [
        { id: crypto.randomUUID(), nome: 'Alimentação', cor: CORES_CATEGORIAS[0] },
        { id: crypto.randomUUID(), nome: 'Transporte', cor: CORES_CATEGORIAS[1] },
        { id: crypto.randomUUID(), nome: 'Moradia', cor: CORES_CATEGORIAS[2] },
        { id: crypto.randomUUID(), nome: 'Saúde', cor: CORES_CATEGORIAS[3] },
        { id: crypto.randomUUID(), nome: 'Educação', cor: CORES_CATEGORIAS[4] },
        { id: crypto.randomUUID(), nome: 'Lazer', cor: CORES_CATEGORIAS[5] },
        { id: crypto.randomUUID(), nome: 'Outros', cor: CORES_CATEGORIAS[6] },
      ];
      setCategorias(categoriasIniciais);
      localStorage.setItem('categorias', JSON.stringify(categoriasIniciais));
    }
  }, []);

  // Salvar dados no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem('receitas', JSON.stringify(receitas));
  }, [receitas]);

  useEffect(() => {
    localStorage.setItem('despesas', JSON.stringify(despesas));
  }, [despesas]);

  useEffect(() => {
    localStorage.setItem('categorias', JSON.stringify(categorias));
  }, [categorias]);

  const adicionarReceita = (receita: Omit<Transacao, 'id'>) => {
    const novaReceita = {
      ...receita,
      id: crypto.randomUUID(),
      data: receita.data || formatarData(new Date())
    };
    setReceitas([...receitas, novaReceita]);
  };

  const adicionarDespesa = (despesa: Omit<Transacao, 'id'>) => {
    const novaDespesa = {
      ...despesa,
      id: crypto.randomUUID(),
      data: despesa.data || formatarData(new Date())
    };
    setDespesas([...despesas, novaDespesa]);
  };

  const adicionarCategoria = (categoria: Omit<CategoriaDespesa, 'id'>) => {
    const index = categorias.length % CORES_CATEGORIAS.length;
    const novaCategoria = {
      ...categoria,
      id: crypto.randomUUID(),
      cor: categoria.cor || CORES_CATEGORIAS[index]
    };
    setCategorias([...categorias, novaCategoria]);
  };

  const removerReceita = (id: string) => {
    setReceitas(receitas.filter(receita => receita.id !== id));
  };

  const removerDespesa = (id: string) => {
    setDespesas(despesas.filter(despesa => despesa.id !== id));
  };

  const removerCategoria = (id: string) => {
    // Verificar se há despesas usando esta categoria
    const temDespesasComCategoria = despesas.some(despesa => despesa.categoria === id);
    
    if (temDespesasComCategoria) {
      if (!confirm("Existem despesas associadas a esta categoria. Ao remover, estas despesas ficarão sem categoria. Deseja continuar?")) {
        return;
      }
      
      // Atualizar despesas que usam esta categoria
      setDespesas(despesas.map(despesa => 
        despesa.categoria === id ? { ...despesa, categoria: undefined } : despesa
      ));
    }
    
    setCategorias(categorias.filter(categoria => categoria.id !== id));
  };

  const editarReceita = (id: string, receitaAtualizada: Partial<Transacao>) => {
    setReceitas(receitas.map(receita => 
      receita.id === id ? { ...receita, ...receitaAtualizada } : receita
    ));
  };

  const editarDespesa = (id: string, despesaAtualizada: Partial<Transacao>) => {
    setDespesas(despesas.map(despesa => 
      despesa.id === id ? { ...despesa, ...despesaAtualizada } : despesa
    ));
  };

  const editarCategoria = (id: string, categoriaAtualizada: Partial<CategoriaDespesa>) => {
    setCategorias(categorias.map(categoria => 
      categoria.id === id ? { ...categoria, ...categoriaAtualizada } : categoria
    ));
  };

  const limparTodosDados = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      setReceitas([]);
      setDespesas([]);
      // Mantém as categorias padrão
      const categoriasIniciais = [
        { id: crypto.randomUUID(), nome: 'Alimentação', cor: CORES_CATEGORIAS[0] },
        { id: crypto.randomUUID(), nome: 'Transporte', cor: CORES_CATEGORIAS[1] },
        { id: crypto.randomUUID(), nome: 'Moradia', cor: CORES_CATEGORIAS[2] },
        { id: crypto.randomUUID(), nome: 'Saúde', cor: CORES_CATEGORIAS[3] },
        { id: crypto.randomUUID(), nome: 'Educação', cor: CORES_CATEGORIAS[4] },
        { id: crypto.randomUUID(), nome: 'Lazer', cor: CORES_CATEGORIAS[5] },
        { id: crypto.randomUUID(), nome: 'Outros', cor: CORES_CATEGORIAS[6] },
      ];
      setCategorias(categoriasIniciais);
    }
  };

  const calcularSaldoAtual = () => {
    const totalReceitas = receitas.reduce((total, receita) => total + receita.valor, 0);
    const totalDespesas = despesas.reduce((total, despesa) => total + despesa.valor, 0);
    return totalReceitas - totalDespesas;
  };

  const calcularTotalReceitas = (periodo?: 'mes' | 'ano') => {
    if (!periodo) {
      return receitas.reduce((total, receita) => total + receita.valor, 0);
    }

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    return receitas.reduce((total, receita) => {
      const dataReceita = new Date(receita.data);
      
      if (periodo === 'mes' && 
          dataReceita.getFullYear() === anoAtual && 
          dataReceita.getMonth() === mesAtual) {
        return total + receita.valor;
      }
      
      if (periodo === 'ano' && dataReceita.getFullYear() === anoAtual) {
        return total + receita.valor;
      }
      
      return total;
    }, 0);
  };

  const calcularTotalDespesas = (periodo?: 'mes' | 'ano') => {
    if (!periodo) {
      return despesas.reduce((total, despesa) => total + despesa.valor, 0);
    }

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    return despesas.reduce((total, despesa) => {
      const dataDespesa = new Date(despesa.data);
      
      if (periodo === 'mes' && 
          dataDespesa.getFullYear() === anoAtual && 
          dataDespesa.getMonth() === mesAtual) {
        return total + despesa.valor;
      }
      
      if (periodo === 'ano' && dataDespesa.getFullYear() === anoAtual) {
        return total + despesa.valor;
      }
      
      return total;
    }, 0);
  };

  const calcularDespesasPorCategoria = (periodo?: 'mes' | 'ano') => {
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    // Filtra despesas pelo período se necessário
    const despesasFiltradas = despesas.filter(despesa => {
      if (!periodo) return true;
      
      const dataDespesa = new Date(despesa.data);
      
      if (periodo === 'mes') {
        return dataDespesa.getFullYear() === anoAtual && dataDespesa.getMonth() === mesAtual;
      }
      
      if (periodo === 'ano') {
        return dataDespesa.getFullYear() === anoAtual;
      }
      
      return true;
    });

    // Agrupa despesas por categoria
    const despesasPorCategoria: Record<string, number> = {};
    despesasFiltradas.forEach(despesa => {
      const categoriaId = despesa.categoria || 'sem-categoria';
      if (!despesasPorCategoria[categoriaId]) {
        despesasPorCategoria[categoriaId] = 0;
      }
      despesasPorCategoria[categoriaId] += despesa.valor;
    });

    // Formata o resultado
    return Object.entries(despesasPorCategoria).map(([categoriaId, valor]) => {
      const categoria = categorias.find(cat => cat.id === categoriaId);
      return {
        categoria: categoria ? categoria.nome : 'Sem Categoria',
        valor,
        cor: categoria ? categoria.cor : '#CCCCCC'
      };
    });
  };

  const exportarDados = () => {
    const dados = {
      receitas,
      despesas,
      categorias
    };
    return JSON.stringify(dados);
  };

  const importarDados = (dadosJson: string) => {
    try {
      const dados = JSON.parse(dadosJson);
      
      if (!dados.receitas || !dados.despesas || !dados.categorias) {
        throw new Error('Formato de dados inválido');
      }

      if (confirm('Isso substituirá todos os seus dados atuais. Deseja continuar?')) {
        setReceitas(dados.receitas);
        setDespesas(dados.despesas);
        setCategorias(dados.categorias);
        return true;
      }
      
      return false;
    } catch (error) {
      alert('Erro ao importar dados. Verifique se o formato é válido.');
      return false;
    }
  };

  const obterDadosGrafico = (tipo: 'receitas-despesas' | 'categorias' | 'evolucao', periodo?: 'mes' | 'ano') => {
    switch (tipo) {
      case 'receitas-despesas':
        return {
          labels: ['Receitas', 'Despesas'],
          datasets: [
            {
              data: [calcularTotalReceitas(periodo), calcularTotalDespesas(periodo)],
              backgroundColor: ['#10B981', '#EF4444'],
              borderColor: ['#047857', '#B91C1C'],
              borderWidth: 1,
            }
          ]
        };
      
      case 'categorias': {
        const despesasPorCategoria = calcularDespesasPorCategoria(periodo);
        return {
          labels: despesasPorCategoria.map(item => item.categoria),
          datasets: [
            {
              data: despesasPorCategoria.map(item => item.valor),
              backgroundColor: despesasPorCategoria.map(item => item.cor),
              borderWidth: 1,
            }
          ]
        };
      }
      
      case 'evolucao': {
        // Exemplo de evolução mensal para o ano atual
        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        const receitasMensais = Array(12).fill(0);
        const despesasMensais = Array(12).fill(0);
        
        receitas.forEach(receita => {
          const dataReceita = new Date(receita.data);
          if (dataReceita.getFullYear() === anoAtual) {
            const mes = dataReceita.getMonth();
            receitasMensais[mes] += receita.valor;
          }
        });
        
        despesas.forEach(despesa => {
          const dataDespesa = new Date(despesa.data);
          if (dataDespesa.getFullYear() === anoAtual) {
            const mes = dataDespesa.getMonth();
            despesasMensais[mes] += despesa.valor;
          }
        });
        
        return {
          labels: meses,
          datasets: [
            {
              label: 'Receitas',
              data: receitasMensais,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Despesas',
              data: despesasMensais,
              borderColor: '#EF4444',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              fill: true,
              tension: 0.4,
            }
          ]
        };
      }
      
      default:
        return {};
    }
  };

  const contextValue: DadosContextType = {
    receitas,
    despesas,
    categorias,
    adicionarReceita,
    adicionarDespesa,
    adicionarCategoria,
    removerReceita,
    removerDespesa,
    removerCategoria,
    editarReceita,
    editarDespesa,
    editarCategoria,
    limparTodosDados,
    calcularSaldoAtual,
    calcularTotalReceitas,
    calcularTotalDespesas,
    calcularDespesasPorCategoria,
    exportarDados,
    importarDados,
    obterDadosGrafico
  };

  return (
    <DadosContext.Provider value={contextValue}>
      {children}
    </DadosContext.Provider>
  );
};