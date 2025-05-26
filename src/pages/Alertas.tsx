import React, { useState } from 'react';
import { Bell, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import { useAlertas, Alerta } from '../contexts/AlertasContext';
import { formatarDataBR } from '../utils/formatadores';

const Alertas: React.FC = () => {
  const { 
    alertas, 
    marcarComoLido, 
    marcarTodosComoLidos, 
    removerAlerta,
    removerTodosAlertas,
    gerarAlertasInteligentes
  } = useAlertas();
  const [filtro, setFiltro] = useState<'todos' | 'nao-lidos' | 'lidos'>('nao-lidos');

  const alertasFiltrados = alertas
    .filter(alerta => {
      if (filtro === 'todos') return true;
      if (filtro === 'nao-lidos') return !alerta.lido;
      if (filtro === 'lidos') return alerta.lido;
      return true;
    })
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case 'vencimento':
        return <Bell className="text-warning-500" />;
      case 'saldo_baixo':
        return <Bell className="text-danger-500" />;
      case 'aumento_custos':
        return <Bell className="text-primary-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'vencimento':
        return 'border-l-warning-500 bg-warning-50';
      case 'saldo_baixo':
        return 'border-l-danger-500 bg-danger-50';
      case 'aumento_custos':
        return 'border-l-primary-500 bg-primary-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Alertas Financeiros</h1>
        <div className="mt-3 sm:mt-0 flex space-x-2">
          <button 
            onClick={() => gerarAlertasInteligentes()}
            className="btn btn-primary flex items-center"
          >
            <RefreshCw size={18} className="mr-1" /> Atualizar Alertas
          </button>
          {alertasFiltrados.some(a => !a.lido) && (
            <button 
              onClick={() => marcarTodosComoLidos()}
              className="btn btn-outline flex items-center"
            >
              <CheckCircle size={18} className="mr-1" /> Marcar todos como lidos
            </button>
          )}
          {alertasFiltrados.length > 0 && (
            <button 
              onClick={() => removerTodosAlertas()}
              className="btn btn-danger flex items-center"
            >
              <Trash2 size={18} className="mr-1" /> Limpar
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFiltro('todos')}
          className={`btn ${filtro === 'todos' ? 'btn-primary' : 'btn-outline'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro('nao-lidos')}
          className={`btn ${filtro === 'nao-lidos' ? 'btn-primary' : 'btn-outline'}`}
        >
          Não lidos
        </button>
        <button
          onClick={() => setFiltro('lidos')}
          className={`btn ${filtro === 'lidos' ? 'btn-primary' : 'btn-outline'}`}
        >
          Lidos
        </button>
      </div>

      {/* Lista de alertas */}
      <div className="space-y-4">
        {alertasFiltrados.map(alerta => (
          <div 
            key={alerta.id} 
            className={`p-4 border-l-4 rounded-md ${getCorPorTipo(alerta.tipo)} ${alerta.lido ? 'opacity-70' : ''}`}
          >
            <div className="flex justify-between">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  {getIconePorTipo(alerta.tipo)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{alerta.mensagem}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatarDataBR(alerta.data)}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!alerta.lido && (
                  <button
                    onClick={() => marcarComoLido(alerta.id)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button
                  onClick={() => removerAlerta(alerta.id)}
                  className="text-danger-600 hover:text-danger-900"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {alertasFiltrados.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-md">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">Nenhum alerta {filtro !== 'todos' ? filtro === 'nao-lidos' ? 'não lido' : 'lido' : ''} encontrado.</p>
            <button 
              onClick={() => gerarAlertasInteligentes()}
              className="mt-4 btn btn-primary"
            >
              Verificar novos alertas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alertas;