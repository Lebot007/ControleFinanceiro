import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TooltipItem,
  Scale,
  CoreScaleOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useDados } from '../../contexts/DadosContext';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const GraficoEvolucao: React.FC = () => {
  const { obterDadosGrafico } = useDados();
  
  const dados = obterDadosGrafico('evolucao');
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, tickValue: string | number) {
            if (typeof tickValue === 'number') {
              return tickValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            }
            return tickValue;
          }
        }
      }
    }
  };
  
  return (
    <div className="h-full flex items-center justify-center">
      {dados.datasets && 
       dados.datasets.length > 0 && 
       (dados.datasets[0].data.some((v: number) => v > 0) || dados.datasets[1].data.some((v: number) => v > 0)) ? (
        <Line data={dados} options={options} />
      ) : (
        <div className="text-center text-gray-500">
          <p>Não há dados suficientes para exibir o gráfico.</p>
          <p className="text-sm mt-2">Adicione receitas e despesas ao longo do tempo para visualizar.</p>
        </div>
      )}
    </div>
  );
};

export default GraficoEvolucao;