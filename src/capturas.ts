/**
 * CAPTURAS REAIS
 *
 * Por padrão o vídeo usa telas ilustrativas. Para trocar pelas telas reais:
 *  1. Coloque as imagens em public/capturas/ (ex.: public/capturas/bacbo.png).
 *  2. Preencha o objeto abaixo. As coordenadas são em pixels, considerando a
 *     imagem redimensionada para 900px de largura (a altura é proporcional).
 *  3. Mude `mostrarSeloIlustrativo` para false.
 */

export type Retangulo = { x: number; y: number; w: number; h: number };

export type CapturaBacBo = {
  arquivo: string;
  /** altura da imagem quando redimensionada para 900px de largura */
  altura: number;
  /** gráfico no canto inferior esquerdo */
  grafico: Retangulo;
};

export type CapturaSite = {
  /** print da página inteira do site (rolagem completa) */
  arquivo: string;
  altura: number;
  logoTopo: Retangulo;
  secaoImportar: Retangulo;
  areaAdicionarPrint: Retangulo;
  botaoLerImagem: Retangulo;
  areaRegistro: Retangulo;
  graficoIlustrativo: Retangulo;
};

export const capturas: {
  bacbo: CapturaBacBo | null;
  site: CapturaSite | null;
  /** logo em PNG com fundo transparente, ex.: "capturas/logo.png" */
  logo: string | null;
} = {
  bacbo: null,
  site: null,
  logo: null,
};

/** Mostra a etiqueta "TELA ILUSTRATIVA" sobre as telas simuladas. */
export const mostrarSeloIlustrativo = true;
