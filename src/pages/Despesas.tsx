import React, { useState } from 'react';
import { PlusCircle, Search, Edit, Trash2, Filter } from 'lucide-react';
import { useDados, Transacao } from '../contexts/DadosContext';
import { formatarMoeda, formatarDataBR } from '../utils/formatadores';
import FormularioDespesa from '../components/formularios/FormularioDespesa';

const Despesas: React.FC = () => {
  const { despesas, categorias, removerDespesa } = useDados();
  const [modalAberto, setModalAberto] = useState(false);
  const [despesaParaEditar, setDespesaParaEditar] = useState<Transacao | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  
  const despesasFiltradas = despesas
    .filter(despesa => 
      (despesa.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
       formatarDataBR(despesa.data).includes(termoBusca)) &&
      (filtroCategoria === '' || despesa.categoria === filtroCategoria)
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const abrirModalAdicao = () => {
    setDespesaParaEditar(null);
    setModalAberto(true);
  };

  const abrirModalEdicao = (despesa: Transacao) => {
    setDespesaParaEditar(despesa);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setDespesaParaEditar(null);
  };

  const confirmarRemocao = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta despesa?')) {
      removerDespesa(id);
    }
  };

  const obterNomeCategoria = (id?: string) => {
    if (!id) return 'Sem categoria';
    const categoria = categorias.find(cat => cat.id === id);
    return categoria ? categoria.nome : 'Sem categoria';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Despesas</h1>
        <button 
          onClick={abrirModalAdicao}
          className="mt-3 sm:mt-0 btn btn-primary flex items-center"
        >
          <PlusCircle size={18} className="mr-1" /> Nova Despesa
        </button>
      </div>

      {/* Formulário de busca e filtro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar despesas..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="input-field pl-10"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de despesas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {despesasFiltradas.length > 0 ? (
              despesasFiltradas.map((despesa) => {
                const categoria = categorias.find(cat => cat.id === despesa.categoria);
                return (
                  <tr key={despesa.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {despesa.descricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatarDataBR(despesa.data)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {categoria && (
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${categoria.cor}20`, 
                            color: categoria.cor 
                          }}
                        >
                          {categoria.nome}
                        </span>
                      )}
                      {!categoria && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Sem categoria
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-danger-600">
                      {formatarMoeda(despesa.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                      <button
                        onClick={() => abrirModalEdicao(despesa)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => confirmarRemocao(despesa.id)}
                        className="text-danger-600 hover:text-danger-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  {termoBusca || filtroCategoria ? 'Nenhuma despesa encontrada com estes filtros.' : 'Nenhuma despesa cadastrada ainda.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de adição/edição */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">
                {despesaParaEditar ? 'Editar Despesa' : 'Nova Despesa'}
              </h3>
            </div>
            <FormularioDespesa
              despesaExistente={despesaParaEditar}
              aoFechar={fecharModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Despesas;