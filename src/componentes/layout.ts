import { useVideoConfig } from "remotion";

export type Caixa = { x: number; y: number; w: number; h: number };

/** Tamanho interno das telas (bac bo / site). Tudo dentro delas usa esta escala. */
export const TELA_W = 900;
export const TELA_H = 1100;

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const vertical = height >= width;
  if (vertical) {
    const telaH = 1000;
    const telaW = (telaH * TELA_W) / TELA_H;
    return {
      vertical,
      escala: width / 1080,
      badge: { x: width / 2, y: 130 },
      instrucao: { x: 50, y: 236, w: width - 100, h: 140 },
      tela: { x: (width - telaW) / 2, y: 405, w: telaW, h: telaH },
      legenda: { x: 30, y: 1470, w: width - 60, h: 330 },
    };
  }
  const telaH = 940;
  const telaW = (telaH * TELA_W) / TELA_H;
  return {
    vertical,
    escala: height / 1080,
    badge: { x: 1410, y: 160 },
    instrucao: { x: 980, y: 270, w: 860, h: 190 },
    tela: { x: 110, y: (height - telaH) / 2, w: telaW, h: telaH },
    legenda: { x: 960, y: 560, w: 900, h: 380 },
  };
};
