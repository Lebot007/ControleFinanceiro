import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDados } from './DadosContext';

export interface Alerta {
  id: string;
  tipo: 'vencimento' | 'saldo_baixo' | 'aumento_custos' | 'outro';
  mensagem: string;
  data: string;
  lido: boolean;
}

interface AlertasContextType {
  alertas: Alerta[];
  adicionarAlerta: (alerta: Omit<Alerta, 'id' | 'data' | 'lido'>) => void;
  marcarComoLido: (id: string) => void;
  marcarTodosComoLidos: () => void;
  removerAlerta: (id: string) => void;
  removerTodosAlertas: () => void;
  gerarAlertasInteligentes: () => void;
}

const AlertasContext = createContext<AlertasContextType | undefined>(undefined);

export const useAlertas = () => {
  const context = useContext(AlertasContext);
  if (!context) {
    throw new Error('useAlertas deve ser usado dentro de um AlertasProvider');
  }
  return context;
};

interface AlertasProviderProps {
  children: ReactNode;
}

export const AlertasProvider: React.FC<AlertasProviderProps> = ({ children }) => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const { despesas, calcularSaldoAtual, calcularTotalDespesas } = useDados();

  // Carregar alertas do localStorage ao iniciar
  useEffect(() => {
    const alertasSalvos = localStorage.getItem('alertas');
    if (alertasSalvos) setAlertas(JSON.parse(alertasSalvos));
    
    // Gerar alertas ao iniciar
    const timeoutId = setTimeout(() => {
      gerarAlertasInteligentes();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Salvar alertas no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem('alertas', JSON.stringify(alertas));
  }, [alertas]);

  // Verificar novas condições para gerar alertas quando despesas mudam
  useEffect(() => {
    gerarAlertasInteligentes();
  }, [despesas]);

  const adicionarAlerta = (alerta: Omit<Alerta, 'id' | 'data' | 'lido'>) => {
    const novoAlerta: Alerta = {
      ...alerta,
      id: crypto.randomUUID(),
      data: new Date().toISOString(),
      lido: false
    };
    setAlertas(alertasAtuais => [...alertasAtuais, novoAlerta]);
  };

  const marcarComoLido = (id: string) => {
    setAlertas(alertas.map(alerta => 
      alerta.id === id ? { ...alerta, lido: true } : alerta
    ));
  };

  const marcarTodosComoLidos = () => {
    setAlertas(alertas.map(alerta => ({ ...alerta, lido: true })));
  };

  const removerAlerta = (id: string) => {
    setAlertas(alertas.filter(alerta => alerta.id !== id));
  };

  const removerTodosAlertas = () => {
    if (confirm('Tem certeza que deseja remover todos os alertas?')) {
      setAlertas([]);
    }
  };

  const gerarAlertasInteligentes = () => {
    const hoje = new Date();
    const novosMensagens: Omit<Alerta, 'id' | 'data' | 'lido'>[] = [];

    // Alerta de saldo baixo
    const saldoAtual = calcularSaldoAtual();
    if (saldoAtual < 0) {
      const mensagemSaldoBaixo = {
        tipo: 'saldo_baixo' as const,
        mensagem: `Seu saldo está negativo: R$ ${saldoAtual.toFixed(2).replace('.', ',')}`
      };
      
      // Verificar se já existe um alerta de saldo baixo não lido
      const temAlertaSaldoBaixo = alertas.some(
        alerta => alerta.tipo === 'saldo_baixo' && !alerta.lido
      );
      
      if (!temAlertaSaldoBaixo) {
        novosMensagens.push(mensagemSaldoBaixo);
      }
    }

    // Alerta de vencimentos próximos (contas a pagar nos próximos 3 dias)
    const proximos3Dias = new Date(hoje);
    proximos3Dias.setDate(hoje.getDate() + 3);
    
    despesas.forEach(despesa => {
      const dataDespesa = new Date(despesa.data);
      
      // Se a data da despesa é futura e está nos próximos 3 dias
      if (dataDespesa > hoje && dataDespesa <= proximos3Dias) {
        const mensagemVencimento = {
          tipo: 'vencimento' as const,
          mensagem: `Vencimento próximo: ${despesa.descricao} - R$ ${despesa.valor.toFixed(2).replace('.', ',')} (${dataDespesa.toLocaleDateString('pt-BR')})`
        };
        
        // Verificar se já existe um alerta para este vencimento específico
        const temAlertaVencimento = alertas.some(
          alerta => alerta.tipo === 'vencimento' && 
                   alerta.mensagem.includes(despesa.descricao) &&
                   !alerta.lido
        );
        
        if (!temAlertaVencimento) {
          novosMensagens.push(mensagemVencimento);
        }
      }
    });

    // Alerta de aumento de custos (comparando mês atual com o anterior)
    const mesAtual = hoje.getMonth();
    const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
    const anoAtual = hoje.getFullYear();
    const anoMesAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
    
    const despesasMesAtual = despesas.filter(despesa => {
      const dataDespesa = new Date(despesa.data);
      return dataDespesa.getMonth() === mesAtual && 
             dataDespesa.getFullYear() === anoAtual;
    }).reduce((total, despesa) => total + despesa.valor, 0);
    
    const despesasMesAnterior = despesas.filter(despesa => {
      const dataDespesa = new Date(despesa.data);
      return dataDespesa.getMonth() === mesAnterior && 
             dataDespesa.getFullYear() === anoMesAnterior;
    }).reduce((total, despesa) => total + despesa.valor, 0);
    
    // Se o mês anterior tiver despesas e houver um aumento de mais de 20%
    if (despesasMesAnterior > 0 && despesasMesAtual > despesasMesAnterior * 1.2) {
      const percentualAumento = Math.round((despesasMesAtual / despesasMesAnterior - 1) * 100);
      
      const mensagemAumentoCustos = {
        tipo: 'aumento_custos' as const,
        mensagem: `Aumento significativo de gastos: ${percentualAumento}% em relação ao mês anterior`
      };
      
      // Verificar se já existe um alerta de aumento de custos não lido
      const temAlertaAumentoCustos = alertas.some(
        alerta => alerta.tipo === 'aumento_custos' && !alerta.lido
      );
      
      if (!temAlertaAumentoCustos) {
        novosMensagens.push(mensagemAumentoCustos);
      }
    }

    // Adicionar novos alertas
    novosMensagens.forEach(mensagem => {
      adicionarAlerta(mensagem);
    });
  };

  const contextValue: AlertasContextType = {
    alertas,
    adicionarAlerta,
    marcarComoLido,
    marcarTodosComoLidos,
    removerAlerta,
    removerTodosAlertas,
    gerarAlertasInteligentes
  };

  return (
    <AlertasContext.Provider value={contextValue}>
      {children}
    </AlertasContext.Provider>
  );
};