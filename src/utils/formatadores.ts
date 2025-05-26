export const formatarData = (data: Date): string => {
  return data.toISOString().split('T')[0];
};

export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

export const formatarDataBR = (dataString: string): string => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
};

export const obterNomeMes = (data: Date): string => {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return meses[data.getMonth()];
};