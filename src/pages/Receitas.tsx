import React, { useState } from 'react';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { useDados, Transacao } from '../contexts/DadosContext';
import { formatarMoeda, formatarDataBR } from '../utils/formatadores';
import FormularioReceita from '../components/formularios/FormularioReceita';

const Receitas: React.FC = () => {
  const { receitas, removerReceita } = useDados();
  const [modalAberto, setModalAberto] = useState(false);
  const [receitaParaEditar, setReceitaParaEditar] = useState<Transacao | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  
  const receitasFiltradas = receitas
    .filter(receita => 
      receita.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      formatarDataBR(receita.data).includes(termoBusca)
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const abrirModalAdicao = () => {
    setReceitaParaEditar(null);
    setModalAberto(true);
  };

  const abrirModalEdicao = (receita: Transacao) => {
    setReceitaParaEditar(receita);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setReceitaParaEditar(null);
  };

  const confirmarRemocao = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta receita?')) {
      removerReceita(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Receitas</h1>
        <button 
          onClick={abrirModalAdicao}
          className="mt-3 sm:mt-0 btn btn-primary flex items-center"
        >
          <PlusCircle size={18} className="mr-1" /> Nova Receita
        </button>
      </div>

      {/* Formulário de busca */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar receitas..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Lista de receitas */}
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {receitasFiltradas.length > 0 ? (
              receitasFiltradas.map((receita) => (
                <tr key={receita.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {receita.descricao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatarDataBR(receita.data)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-success-600">
                    {formatarMoeda(receita.valor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                    <button
                      onClick={() => abrirModalEdicao(receita)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => confirmarRemocao(receita.id)}
                      className="text-danger-600 hover:text-danger-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  {termoBusca ? 'Nenhuma receita encontrada com este termo.' : 'Nenhuma receita cadastrada ainda.'}
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
                {receitaParaEditar ? 'Editar Receita' : 'Nova Receita'}
              </h3>
            </div>
            <FormularioReceita
              receitaExistente={receitaParaEditar}
              aoFechar={fecharModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Receitas;