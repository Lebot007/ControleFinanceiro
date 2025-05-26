import React, { useState } from 'react';
import { useDados, Transacao } from '../../contexts/DadosContext';

interface FormularioReceitaProps {
  receitaExistente: Transacao | null;
  aoFechar: () => void;
}

const FormularioReceita: React.FC<FormularioReceitaProps> = ({ receitaExistente, aoFechar }) => {
  const { adicionarReceita, editarReceita } = useDados();
  
  const [descricao, setDescricao] = useState(receitaExistente?.descricao || '');
  const [valor, setValor] = useState(receitaExistente?.valor.toString() || '');
  const [data, setData] = useState(receitaExistente?.data || new Date().toISOString().split('T')[0]);
  
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
    
    if (receitaExistente) {
      editarReceita(receitaExistente.id, {
        descricao,
        valor: valorNumerico,
        data
      });
    } else {
      adicionarReceita({
        descricao,
        valor: valorNumerico,
        data
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
            placeholder="Ex: Salário, Freelance, etc."
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
          {receitaExistente ? 'Atualizar' : 'Adicionar'} Receita
        </button>
      </div>
    </form>
  );
};

export default FormularioReceita;