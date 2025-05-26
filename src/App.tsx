import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Receitas from './pages/Receitas';
import Despesas from './pages/Despesas';
import CategoriasDespesas from './pages/CategoriasDespesas';
import Metas from './pages/Metas';
import Alertas from './pages/Alertas';
import Configuracoes from './pages/Configuracoes';
import { DadosProvider } from './contexts/DadosContext';
import { AlertasProvider } from './contexts/AlertasContext';
import { MetasProvider } from './contexts/MetasContext';

function App() {
  const [paginaAtual, setPaginaAtual] = useState('dashboard');
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case 'dashboard':
        return <Dashboard />;
      case 'receitas':
        return <Receitas />;
      case 'despesas':
        return <Despesas />;
      case 'categorias':
        return <CategoriasDespesas />;
      case 'metas':
        return <Metas />;
      case 'alertas':
        return <Alertas />;
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DadosProvider>
      <AlertasProvider>
        <MetasProvider>
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar em dispositivos maiores */}
            <div className="hidden md:flex md:flex-shrink-0">
              <Sidebar paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} />
            </div>

            {/* Menu Mobile */}
            <div className={`fixed inset-0 z-40 lg:hidden ${menuMobileAberto ? 'block' : 'hidden'}`}>
              <div 
                className="fixed inset-0 bg-gray-600 bg-opacity-75" 
                onClick={() => setMenuMobileAberto(false)}
              />
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button 
                    type="button" 
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setMenuMobileAberto(false)}
                  >
                    <span className="sr-only">Fechar menu</span>
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <Sidebar paginaAtual={paginaAtual} setPaginaAtual={(pagina) => {
                    setPaginaAtual(pagina);
                    setMenuMobileAberto(false);
                  }} />
                </div>
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Cabeçalho mobile */}
              <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
                <button
                  type="button"
                  className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  onClick={() => setMenuMobileAberto(true)}
                >
                  <span className="sr-only">Abrir menu</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Área principal de conteúdo */}
              <main className="flex-1 relative overflow-y-auto focus:outline-none">
                <div className="py-6">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    {renderizarPagina()}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </MetasProvider>
      </AlertasProvider>
    </DadosProvider>
  );
}

export default App;