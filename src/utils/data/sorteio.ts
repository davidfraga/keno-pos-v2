import lista_aleatoria_1_90 from '../listaAleatoria';

export const sorteio = (
  qtd: number,
  data: SorteioData,
  estabelecimento = 'Bar do Alê'
) => ({
  ...data,
  cartelas: new Array(qtd).fill(0).map((_, id) => {
    const num = lista_aleatoria_1_90(15);
    return {
      codigo: 2000 + id,
      estabelecimento,
      linha1_lista: num.slice(0, 5),
      linha2_lista: num.slice(5, 10),
      linha3_lista: num.slice(10, 15)
    };
  })
});
