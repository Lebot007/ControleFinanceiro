import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Tags, 
  Target, 
  Bell, 
  Settings, 
  LogOut
} from 'lucide-react';

interface SidebarProps {
  paginaAtual: string;
  setPaginaAtual: (pagina: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ paginaAtual, setPaginaAtual }) => {
  const menuItems = [
    { id: 'dashboard', nome: 'Dashboard', icone: <LayoutDashboard size={20} /> },
    { id: 'receitas', nome: 'Receitas', icone: <TrendingUp size={20} /> },
    { id: 'despesas', nome: 'Despesas', icone: <TrendingDown size={20} /> },
    { id: 'categorias', nome: 'Categorias', icone: <Tags size={20} /> },
    { id: 'metas', nome: 'Metas', icone: <Target size={20} /> },
    { id: 'alertas', nome: 'Alertas', icone: <Bell size={20} /> },
    { id: 'configuracoes', nome: 'Configurações', icone: <Settings size={20} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 w-64">
      <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">FinanControl</h1>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPaginaAtual(item.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full transition-colors duration-200 ${
                paginaAtual === item.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-gray-500">{item.icone}</span>
              {item.nome}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => {
              if (confirm('Tem certeza que deseja sair? Seus dados estão salvos localmente.')) {
                // Aqui poderíamos ter uma ação de logout se necessário
              }
            }}
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut size={20} className="mr-3 text-red-500" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;