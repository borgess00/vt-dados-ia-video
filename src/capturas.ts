/**
 * CAPTURAS REAIS
 *
 * - O gráfico do Bac Bo (public/capturas/bacbo-grafico.png) e a "ordem de leitura"
 *   (public/capturas/ordem-de-leitura.png) são prints reais.
 * - O site é recriado em src/telas/Site.tsx a partir dos prints reais (mesmos textos e botões).
 * - A tela do Bac Bo é um print real (public/capturas/bacbo-tela.jpg, 900x1100). Para trocar,
 *   substitua a imagem e ajuste `grafico` abaixo (coordenadas em px na imagem de 900x1100).
 *   Com `bacbo: null` o vídeo volta a usar a tela ilustrativa.
 */

export type Retangulo = { x: number; y: number; w: number; h: number };

export type CapturaBacBo = {
  arquivo: string;
  /** gráfico no canto inferior esquerdo */
  grafico: Retangulo;
};

export const capturas: {
  bacbo: CapturaBacBo | null;
  /** logo em PNG com fundo transparente, ex.: "capturas/logo.png" */
  logo: string | null;
} = {
  // print real da tela do Bac Bo, recortado em retrato (nomes do chat desfocados)
  bacbo: { arquivo: "capturas/bacbo-tela.jpg", grafico: { x: 4, y: 850, w: 580, h: 142 } },
  logo: null,
};

/** Mostra a etiqueta "TELA ILUSTRATIVA" sobre a tela simulada do Bac Bo (só quando `bacbo` é null). */
export const mostrarSeloIlustrativo = capturas.bacbo === null;
