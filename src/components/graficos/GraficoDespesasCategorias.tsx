import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useDados } from '../../contexts/DadosContext';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface GraficoDespesasCategoriasProps {
  periodo?: 'mes' | 'ano';
}

const GraficoDespesasCategorias: React.FC<GraficoDespesasCategoriasProps> = ({ periodo = 'mes' }) => {
  const { obterDadosGrafico } = useDados();
  
  const dados = obterDadosGrafico('categorias', periodo);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 11,
          },
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
          }
        }
      }
    },
  };
  
  return (
    <div className="h-full flex items-center justify-center">
      {dados.datasets && dados.datasets[0].data.length > 0 ? (
        <Doughnut data={dados} options={options} />
      ) : (
        <div className="text-center text-gray-500">
          <p>Não há dados suficientes para exibir o gráfico.</p>
          <p className="text-sm mt-2">Adicione despesas com categorias para visualizar.</p>
        </div>
      )}
    </div>
  );
};

export default GraficoDespesasCategorias;