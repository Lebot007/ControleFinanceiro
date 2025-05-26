import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useDados, CategoriaDespesa } from '../contexts/DadosContext';
import FormularioCategoria from '../components/formularios/FormularioCategoria';

const CategoriasDespesas: React.FC = () => {
  const { categorias, removerCategoria } = useDados();
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState<CategoriaDespesa | null>(null);

  const abrirModalAdicao = () => {
    setCategoriaParaEditar(null);
    setModalAberto(true);
  };

  const abrirModalEdicao = (categoria: CategoriaDespesa) => {
    setCategoriaParaEditar(categoria);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCategoriaParaEditar(null);
  };

  const confirmarRemocao = (id: string) => {
    removerCategoria(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Categorias de Despesas</h1>
        <button 
          onClick={abrirModalAdicao}
          className="mt-3 sm:mt-0 btn btn-primary flex items-center"
        >
          <PlusCircle size={18} className="mr-1" /> Nova Categoria
        </button>
      </div>

      {/* Lista de categorias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categorias.map(categoria => (
          <div 
            key={categoria.id} 
            className="card flex flex-col"
            style={{ borderLeft: `4px solid ${categoria.cor}` }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-800">{categoria.nome}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => abrirModalEdicao(categoria)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => confirmarRemocao(categoria.id)}
                  className="text-danger-600 hover:text-danger-900"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <span 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: categoria.cor }}
              ></span>
              <span className="text-sm text-gray-500">Cor da categoria</span>
            </div>
          </div>
        ))}
      </div>

      {categorias.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhuma categoria cadastrada ainda.</p>
          <button 
            onClick={abrirModalAdicao}
            className="mt-4 btn btn-primary"
          >
            Adicionar primeira categoria
          </button>
        </div>
      )}

      {/* Modal de adição/edição */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">
                {categoriaParaEditar ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
            </div>
            <FormularioCategoria
              categoriaExistente={categoriaParaEditar}
              aoFechar={fecharModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriasDespesas;