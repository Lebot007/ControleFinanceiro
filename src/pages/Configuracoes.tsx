import React, { useRef } from 'react';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { useDados } from '../contexts/DadosContext';

const Configuracoes: React.FC = () => {
  const { exportarDados, importarDados, limparTodosDados } = useDados();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportarDados = () => {
    const dadosJson = exportarDados();
    const blob = new Blob([dadosJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `controle-financeiro-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const conteudo = e.target?.result as string;
      if (conteudo) {
        const sucesso = importarDados(conteudo);
        if (sucesso) {
          alert('Dados importados com sucesso!');
        }
      }
    };
    reader.readAsText(file);
    
    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Gerenciamento de Dados</h2>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-gray-50">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Download size={20} className="text-primary-600" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-md font-medium text-gray-900">Exportar Dados</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Faça o download de todos os seus dados financeiros em formato JSON para backup.
                </p>
                <button 
                  onClick={handleExportarDados}
                  className="btn btn-primary"
                >
                  Exportar Dados
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md bg-gray-50">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Upload size={20} className="text-primary-600" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-md font-medium text-gray-900">Importar Dados</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Restaure seus dados a partir de um arquivo JSON exportado anteriormente.
                </p>
                <button 
                  onClick={handleImportarClick}
                  className="btn btn-primary"
                >
                  Selecionar Arquivo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md bg-danger-50">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <AlertTriangle size={20} className="text-danger-600" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-md font-medium text-danger-900">Limpar Todos os Dados</h3>
                <p className="text-sm text-danger-700 mb-3">
                  Esta ação irá remover permanentemente todas as suas receitas, despesas e metas. 
                  As categorias padrão serão mantidas.
                </p>
                <button 
                  onClick={limparTodosDados}
                  className="btn btn-danger flex items-center"
                >
                  <Trash2 size={18} className="mr-1" /> Limpar Todos os Dados
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Sobre o Aplicativo</h2>
        <p className="text-gray-600 mb-3">
          Este é um aplicativo de controle financeiro pessoal que funciona diretamente no seu navegador.
          Todos os dados são armazenados localmente no seu dispositivo, garantindo total privacidade.
        </p>
        <p className="text-gray-600 mb-3">
          Recomendamos que você faça exportações periódicas dos seus dados como backup, especialmente
          antes de limpar o cache do navegador ou de mudar de dispositivo.
        </p>
        <p className="text-gray-600">
          <strong>Versão:</strong> 0.1.0
        </p>
      </div>
    </div>
  );
};

export default Configuracoes;