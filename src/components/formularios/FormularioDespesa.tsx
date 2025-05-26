import React, { useState } from 'react';
import { useDados, Transacao } from '../../contexts/DadosContext';

interface FormularioDespesaProps {
  despesaExistente: Transacao | null;
  aoFechar: () => void;
}

const FormularioDespesa: React.FC<FormularioDespesaProps> = ({ despesaExistente, aoFechar }) => {
  const { adicionarDespesa, editarDespesa, categorias } = useDados();
  
  const [descricao, setDescricao] = useState(despesaExistente?.descricao || '');
  const [valor, setValor] = useState(despesaExistente?.valor.toString() || '');
  const [data, setData] = useState(despesaExistente?.data || new Date().toISOString().split('T')[0]);
  const [categoria, setCategoria] = useState(despesaExistente?.categoria || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao.trim() || !valor.trim() || !data) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Por favor, insira um valor válido.');
      return;
    }
    
    if (despesaExistente) {
      editarDespesa(despesaExistente.id, {
        descricao,
        valor: valorNumerico,
        data,
        categoria: categoria || undefined
      });
    } else {
      adicionarDespesa({
        descricao,
        valor: valorNumerico,
        data,
        categoria: categoria || undefined
      });
    }
    
    aoFechar();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4">
        <div className="form-group">
          <label htmlFor="descricao" className="label">Descrição</label>
          <input
            type="text"
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="input-field"
            placeholder="Ex: Mercado, Aluguel, etc."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="valor" className="label">Valor (R$)</label>
          <input
            type="text"
            id="valor"
            value={valor}
            onChange={(e) => {
              // Permitir apenas números e vírgula
              const value = e.target.value.replace(/[^0-9.,]/g, '');
              setValor(value);
            }}
            className="input-field"
            placeholder="0,00"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="data" className="label">Data</label>
          <input
            type="date"
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="categoria" className="label">Categoria</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="input-field"
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
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
          {despesaExistente ? 'Atualizar' : 'Adicionar'} Despesa
        </button>
      </div>
    </form>
  );
};

export default FormularioDespesa;