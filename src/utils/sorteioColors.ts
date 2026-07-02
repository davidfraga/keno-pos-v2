export const sorteioColor = (sorteio?: SorteioData) => {
  const parsedTipo = sorteio?.tipo_rodada?.split?.(' ')?.[0].toLowerCase() || '';

  if (parsedTipo?.includes('super')) {
    return '#75CF9D';
  }
  if (parsedTipo?.includes('especial')) {
    return '#F8C353';
  }

  return '#333';
};
