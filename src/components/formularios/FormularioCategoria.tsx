import React, { useState } from 'react';
import { useDados, CategoriaDespesa } from '../../contexts/DadosContext';

interface FormularioCategoriaProps {
  categoriaExistente: CategoriaDespesa | null;
  aoFechar: () => void;
}

const CORES_DISPONIVEIS = [
  '#3B82F6', // primary-600
  '#10B981', // success-500
  '#F59E0B', // warning-500
  '#EF4444', // danger-500
  '#8B5CF6', // purple-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#6366F1', // indigo-500
  '#D946EF', // fuchsia-500
  '#F97316', // orange-500
];

const FormularioCategoria: React.FC<FormularioCategoriaProps> = ({ categoriaExistente, aoFechar }) => {
  const { adicionarCategoria, editarCategoria } = useDados();
  
  const [nome, setNome] = useState(categoriaExistente?.nome || '');
  const [cor, setCor] = useState(categoriaExistente?.cor || CORES_DISPONIVEIS[0]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      alert('Por favor, preencha o nome da categoria.');
      return;
    }
    
    if (categoriaExistente) {
      editarCategoria(categoriaExistente.id, {
        nome,
        cor
      });
    } else {
      adicionarCategoria({
        nome,
        cor
      });
    }
    
    aoFechar();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4">
        <div className="form-group">
          <label htmlFor="nome" className="label">Nome da Categoria</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="input-field"
            placeholder="Ex: Alimentação, Transporte, etc."
            required
          />
        </div>
        
        <div className="form-group">
          <label className="label">Cor</label>
          <div className="grid grid-cols-5 gap-2">
            {CORES_DISPONIVEIS.map((corOpcao) => (
              <button
                key={corOpcao}
                type="button"
                className={`w-8 h-8 rounded-full ${cor === corOpcao ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}
                style={{ backgroundColor: corOpcao }}
                onClick={() => setCor(corOpcao)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-2 rounded-b-lg">
        <button
          type="button"
          onClick={aoFechar}
          className="btn btn-outline"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {categoriaExistente ? 'Atualizar' : 'Adicionar'} Categoria
        </button>
      </div>
    </form>
  );
};

export default FormularioCategoria;