import React, { useState } from 'react';
import { 
  LineChart, PieChart, TrendingUp, TrendingDown, Target, AlertTriangle
} from 'lucide-react';
import { useDados } from '../contexts/DadosContext';
import { useAlertas } from '../contexts/AlertasContext';
import { useMetas } from '../contexts/MetasContext';
import { formatarMoeda } from '../utils/formatadores';
import GraficoReceitas from '../components/graficos/GraficoReceitas';
import GraficoDespesasCategorias from '../components/graficos/GraficoDespesasCategorias';
import GraficoEvolucao from '../components/graficos/GraficoEvolucao';

const Dashboard: React.FC = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'mes' | 'ano'>('mes');
  const { calcularSaldoAtual, calcularTotalReceitas, calcularTotalDespesas } = useDados();
  const { alertas } = useAlertas();
  const { metas } = useMetas();
  
  const saldoAtual = calcularSaldoAtual();
  const totalReceitas = calcularTotalReceitas(periodoSelecionado);
  const totalDespesas = calcularTotalDespesas(periodoSelecionado);
  
  const alertasNaoLidos = alertas.filter(alerta => !alerta.lido);
  const metasAtivas = metas.filter(meta => meta.ativa);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="mt-2 sm:mt-0">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                periodoSelecionado === 'mes'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
              onClick={() => setPeriodoSelecionado('mes')}
            >
              Mês Atual
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                periodoSelecionado === 'ano'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 border-l-0`}
              onClick={() => setPeriodoSelecionado('ano')}
            >
              Ano Atual
            </button>
          </div>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`card ${saldoAtual >= 0 ? 'border-l-4 border-l-success-500' : 'border-l-4 border-l-danger-500'}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Saldo Atual</p>
              <p className={`text-2xl font-semibold ${saldoAtual >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {formatarMoeda(saldoAtual)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${saldoAtual >= 0 ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'}`}>
              {saldoAtual >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-success-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Receitas {periodoSelecionado === 'mes' ? 'do Mês' : 'do Ano'}</p>
              <p className="text-2xl font-semibold text-success-600">{formatarMoeda(totalReceitas)}</p>
            </div>
            <div className="p-3 rounded-full bg-success-100 text-success-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-danger-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Despesas {periodoSelecionado === 'mes' ? 'do Mês' : 'do Ano'}</p>
              <p className="text-2xl font-semibold text-danger-600">{formatarMoeda(totalDespesas)}</p>
            </div>
            <div className="p-3 rounded-full bg-danger-100 text-danger-600">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-l-warning-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Alertas Pendentes</p>
              <p className="text-2xl font-semibold text-warning-600">{alertasNaoLidos.length}</p>
            </div>
            <div className="p-3 rounded-full bg-warning-100 text-warning-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Receitas vs Despesas</h3>
            <div className="p-2 rounded-full bg-primary-100 text-primary-600">
              <PieChart size={20} />
            </div>
          </div>
          <div className="h-72">
            <GraficoReceitas periodo={periodoSelecionado} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Despesas por Categoria</h3>
            <div className="p-2 rounded-full bg-primary-100 text-primary-600">
              <PieChart size={20} />
            </div>
          </div>
          <div className="h-72">
            <GraficoDespesasCategorias periodo={periodoSelecionado} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Evolução Financeira</h3>
          <div className="p-2 rounded-full bg-primary-100 text-primary-600">
            <LineChart size={20} />
          </div>
        </div>
        <div className="h-72">
          <GraficoEvolucao />
        </div>
      </div>

      {/* Alertas e Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Alertas Recentes</h3>
            <div className="p-2 rounded-full bg-warning-100 text-warning-600">
              <AlertTriangle size={20} />
            </div>
          </div>
          {alertasNaoLidos.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alertasNaoLidos.slice(0, 3).map(alerta => (
                <div 
                  key={alerta.id} 
                  className={`p-3 rounded-md ${
                    alerta.tipo === 'vencimento' ? 'bg-warning-50 border-l-4 border-l-warning-500' :
                    alerta.tipo === 'saldo_baixo' ? 'bg-danger-50 border-l-4 border-l-danger-500' :
                    'bg-primary-50 border-l-4 border-l-primary-500'
                  }`}
                >
                  <p className="text-sm font-medium">{alerta.mensagem}</p>
                </div>
              ))}
              {alertasNaoLidos.length > 3 && (
                <p className="text-sm text-center text-gray-500">
                  +{alertasNaoLidos.length - 3} alertas pendentes
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Nenhum alerta pendente</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Metas de Poupança</h3>
            <div className="p-2 rounded-full bg-success-100 text-success-600">
              <Target size={20} />
            </div>
          </div>
          {metasAtivas.length > 0 ? (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {metasAtivas.slice(0, 3).map(meta => {
                const progresso = (meta.valorAtual / meta.valorAlvo) * 100;
                return (
                  <div key={meta.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{meta.titulo}</p>
                      <p className="text-sm text-gray-600">
                        {formatarMoeda(meta.valorAtual)} / {formatarMoeda(meta.valorAlvo)}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ width: `${progresso}%`, backgroundColor: meta.cor }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {metasAtivas.length > 3 && (
                <p className="text-sm text-center text-gray-500">
                  +{metasAtivas.length - 3} metas ativas
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Nenhuma meta ativa</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;