export const removerAcento = (str: string) => str.normalize('NFD').replace(/[^0-9a-zA-Z ]/g, '');
