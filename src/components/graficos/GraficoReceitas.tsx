import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useDados } from '../../contexts/DadosContext';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface GraficoReceitasProps {
  periodo?: 'mes' | 'ano';
}

const GraficoReceitas: React.FC<GraficoReceitasProps> = ({ periodo = 'mes' }) => {
  const { obterDadosGrafico } = useDados();
  
  const dados = obterDadosGrafico('receitas-despesas', periodo);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
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
      {dados.datasets && dados.datasets[0].data.some((valor: number) => valor > 0) ? (
        <Pie data={dados} options={options} />
      ) : (
        <div className="text-center text-gray-500">
          <p>Não há dados suficientes para exibir o gráfico.</p>
          <p className="text-sm mt-2">Adicione receitas e despesas para visualizar.</p>
        </div>
      )}
    </div>
  );
};

export default GraficoReceitas;