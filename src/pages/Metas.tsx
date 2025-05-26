import React, { useState } from 'react';
import { PlusCircle, Target, Edit, Trash2, Plus } from 'lucide-react';
import { useMetas, Meta } from '../contexts/MetasContext';
import { formatarMoeda, formatarDataBR } from '../utils/formatadores';
import FormularioMeta from '../components/formularios/FormularioMeta';
import FormularioDepositoMeta from '../components/formularios/FormularioDepositoMeta';

const Metas: React.FC = () => {
  const { metas, removerMeta, calcularProgressoMeta } = useMetas();
  const [modalMetaAberto, setModalMetaAberto] = useState(false);
  const [modalDepositoAberto, setModalDepositoAberto] = useState(false);
  const [metaParaEditar, setMetaParaEditar] = useState<Meta | null>(null);
  const [metaParaDeposito, setMetaParaDeposito] = useState<Meta | null>(null);
  const [filtro, setFiltro] = useState<'todas' | 'ativas' | 'concluidas'>('ativas');

  const metasFiltradas = metas.filter(meta => {
    if (filtro === 'todas') return true;
    if (filtro === 'ativas') return meta.ativa;
    if (filtro === 'concluidas') return !meta.ativa;
    return true;
  });

  const abrirModalAdicao = () => {
    setMetaParaEditar(null);
    setModalMetaAberto(true);
  };

  const abrirModalEdicao = (meta: Meta) => {
    setMetaParaEditar(meta);
    setModalMetaAberto(true);
  };

  const abrirModalDeposito = (meta: Meta) => {
    setMetaParaDeposito(meta);
    setModalDepositoAberto(true);
  };

  const fecharModalMeta = () => {
    setModalMetaAberto(false);
    setMetaParaEditar(null);
  };

  const fecharModalDeposito = () => {
    setModalDepositoAberto(false);
    setMetaParaDeposito(null);
  };

  const confirmarRemocao = (id: string) => {
    removerMeta(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Metas de Poupança</h1>
        <button 
          onClick={abrirModalAdicao}
          className="mt-3 sm:mt-0 btn btn-primary flex items-center"
        >
          <PlusCircle size={18} className="mr-1" /> Nova Meta
        </button>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFiltro('todas')}
          className={`btn ${filtro === 'todas' ? 'btn-primary' : 'btn-outline'}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltro('ativas')}
          className={`btn ${filtro === 'ativas' ? 'btn-primary' : 'btn-outline'}`}
        >
          Ativas
        </button>
        <button
          onClick={() => setFiltro('concluidas')}
          className={`btn ${filtro === 'concluidas' ? 'btn-primary' : 'btn-outline'}`}
        >
          Concluídas
        </button>
      </div>

      {/* Lista de metas */}
      <div className="grid grid-cols-1 gap-6">
        {metasFiltradas.map(meta => {
          const progresso = calcularProgressoMeta(meta.id);
          
          return (
            <div 
              key={meta.id} 
              className="card"
              style={{ borderLeft: `4px solid ${meta.cor}` }}
            >
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <Target size={20} style={{ color: meta.cor }} className="mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">{meta.titulo}</h3>
                    {!meta.ativa && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Concluída
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Iniciada em {formatarDataBR(meta.dataInicio)}
                    {meta.dataFinal && ` • Meta até ${formatarDataBR(meta.dataFinal)}`}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex space-x-2">
                  {meta.ativa && (
                    <button
                      onClick={() => abrirModalDeposito(meta)}
                      className="btn btn-success flex items-center text-sm"
                    >
                      <Plus size={16} className="mr-1" /> Depositar
                    </button>
                  )}
                  <button
                    onClick={() => abrirModalEdicao(meta)}
                    className="btn btn-outline p-2"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => confirmarRemocao(meta.id)}
                    className="btn btn-outline p-2 text-danger-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Progresso: {progresso.toFixed(0)}%</span>
                  <span className="text-sm text-gray-600">
                    {formatarMoeda(meta.valorAtual)} / {formatarMoeda(meta.valorAlvo)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ width: `${progresso}%`, backgroundColor: meta.cor }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {metasFiltradas.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhuma meta {filtro !== 'todas' ? filtro === 'ativas' ? 'ativa' : 'concluída' : ''} encontrada.</p>
          {filtro === 'ativas' && (
            <button 
              onClick={abrirModalAdicao}
              className="mt-4 btn btn-primary"
            >
              Criar nova meta
            </button>
          )}
        </div>
      )}

      {/* Modal de adição/edição de meta */}
      {modalMetaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">
                {metaParaEditar ? 'Editar Meta' : 'Nova Meta'}
              </h3>
            </div>
            <FormularioMeta
              metaExistente={metaParaEditar}
              aoFechar={fecharModalMeta}
            />
          </div>
        </div>
      )}

      {/* Modal de depósito */}
      {modalDepositoAberto && metaParaDeposito && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">
                Adicionar Depósito em: {metaParaDeposito.titulo}
              </h3>
            </div>
            <FormularioDepositoMeta
              meta={metaParaDeposito}
              aoFechar={fecharModalDeposito}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Metas;