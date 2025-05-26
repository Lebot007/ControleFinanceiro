import React, { useState } from 'react';
import { useMetas, Meta } from '../../contexts/MetasContext';

interface FormularioMetaProps {
  metaExistente: Meta | null;
  aoFechar: () => void;
}

const CORES_DISPONIVEIS = [
  '#3B82F6', // primary-600
  '#10B981', // success-500
  '#F59E0B', // warning-500
  '#8B5CF6', // purple-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#6366F1', // indigo-500
  '#F97316', // orange-500
];

const FormularioMeta: React.FC<FormularioMetaProps> = ({ metaExistente, aoFechar }) => {
  const { adicionarMeta, editarMeta } = useMetas();
  
  const [titulo, setTitulo] = useState(metaExistente?.titulo || '');
  const [valorAlvo, setValorAlvo] = useState(metaExistente?.valorAlvo.toString() || '');
  const [valorAtual, setValorAtual] = useState(metaExistente?.valorAtual.toString() || '0');
  const [dataFinal, setDataFinal] = useState(metaExistente?.dataFinal || '');
  const [cor, setCor] = useState(metaExistente?.cor || CORES_DISPONIVEIS[0]);
  const [ativa, setAtiva] = useState(metaExistente ? metaExistente.ativa : true);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo.trim() || !valorAlvo.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    const valorAlvoNumerico = parseFloat(valorAlvo.replace(',', '.'));
    const valorAtualNumerico = parseFloat(valorAtual.replace(',', '.'));
    
    if (isNaN(valorAlvoNumerico) || valorAlvoNumerico <= 0) {
      alert('Por favor, insira um valor alvo válido.');
      return;
    }
    
    if (isNaN(valorAtualNumerico) || valorAtualNumerico < 0) {
      alert('Por favor, insira um valor atual válido.');
      return;
    }
    
    // Verificar se a meta deve estar ativa
    const novoAtiva = valorAtualNumerico < valorAlvoNumerico && ativa;
    
    if (metaExistente) {
      editarMeta(metaExistente.id, {
        titulo,
        valorAlvo: valorAlvoNumerico,
        valorAtual: valorAtualNumerico,
        dataFinal: dataFinal || undefined,
        cor,
        ativa: novoAtiva
      });
    } else {
      adicionarMeta({
        titulo,
        valorAlvo: valorAlvoNumerico,
        valorAtual: valorAtualNumerico,
        dataInicio: new Date().toISOString(),
        dataFinal: dataFinal || undefined,
        cor,
        ativa: novoAtiva
      });
    }
    
    aoFechar();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4">
        <div className="form-group">
          <label htmlFor="titulo" className="label">Título da Meta</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input-field"
            placeholder="Ex: Viagem, Novo carro, etc."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="valorAlvo" className="label">Valor Alvo (R$)</label>
          <input
            type="text"
            id="valorAlvo"
            value={valorAlvo}
            onChange={(e) => {
              // Permitir apenas números e vírgula
              const value = e.target.value.replace(/[^0-9.,]/g, '');
              setValorAlvo(value);
            }}
            className="input-field"
            placeholder="0,00"
            required
          />
        </div>
        
        {metaExistente && (
          <div className="form-group">
            <label htmlFor="valorAtual" className="label">Valor Atual (R$)</label>
            <input
              type="text"
              id="valorAtual"
              value={valorAtual}
              onChange={(e) => {
                // Permitir apenas números e vírgula
                const value = e.target.value.replace(/[^0-9.,]/g, '');
                setValorAtual(value);
              }}
              className="input-field"
              placeholder="0,00"
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="dataFinal" className="label">Data Final (opcional)</label>
          <input
            type="date"
            id="dataFinal"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
            className="input-field"
          />
        </div>
        
        <div className="form-group">
          <label className="label">Cor</label>
          <div className="grid grid-cols-4 gap-2">
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
        
        {metaExistente && (
          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={ativa}
                onChange={(e) => setAtiva(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Meta Ativa</span>
            </label>
          </div>
        )}
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
          {metaExistente ? 'Atualizar' : 'Adicionar'} Meta
        </button>
      </div>
    </form>
  );
};

export default FormularioMeta;