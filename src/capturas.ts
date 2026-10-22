/**
 * CAPTURAS REAIS
 *
 * - O gráfico do Bac Bo (public/capturas/bacbo-grafico.png) e a "ordem de leitura"
 *   (public/capturas/ordem-de-leitura.png) são prints reais.
 * - O site é recriado em src/telas/Site.tsx a partir dos prints reais (mesmos textos e botões).
 * - O restante da tela do Bac Bo é ilustrativo. Para trocar por um print real da tela inteira,
 *   coloque a imagem em public/capturas/ e preencha `bacbo` abaixo (coordenadas em px com a
 *   imagem redimensionada para 900px de largura).
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
  bacbo: null,
  logo: null,
};

/** Mostra a etiqueta "TELA ILUSTRATIVA" sobre a tela simulada do Bac Bo. */
export const mostrarSeloIlustrativo = true;
