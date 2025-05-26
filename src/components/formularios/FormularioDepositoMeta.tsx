import React, { useState } from 'react';
import { useMetas, Meta } from '../../contexts/MetasContext';

interface FormularioDepositoMetaProps {
  meta: Meta;
  aoFechar: () => void;
}

const FormularioDepositoMeta: React.FC<FormularioDepositoMetaProps> = ({ meta, aoFechar }) => {
  const { adicionarValorMeta } = useMetas();
  const [valor, setValor] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!valor.trim()) {
      alert('Por favor, informe o valor do depósito.');
      return;
    }
    
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Por favor, insira um valor válido.');
      return;
    }
    
    adicionarValorMeta(meta.id, valorNumerico);
    aoFechar();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4">
        <div className="form-group">
          <div className="flex justify-between mb-2">
            <span className="label">Meta Atual</span>
            <span className="text-sm font-medium">{meta.titulo}</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="label">Valor Alvo</span>
            <span className="text-sm font-medium">
              {meta.valorAlvo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="label">Valor Atual</span>
            <span className="text-sm font-medium">
              {meta.valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="label">Valor Restante</span>
            <span className="text-sm font-medium">
              {(meta.valorAlvo - meta.valorAtual).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="valor" className="label">Valor do Depósito (R$)</label>
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
          Adicionar Depósito
        </button>
      </div>
    </form>
  );
};

export default FormularioDepositoMeta;