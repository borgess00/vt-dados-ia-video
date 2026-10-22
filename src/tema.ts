import "@fontsource/orbitron/700.css";
import "@fontsource/orbitron/900.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";

export const FPS = 30;

export const cores = {
  fundo: "#03060d",
  fundo2: "#071428",
  painel: "#0b1730",
  painelBorda: "#1b2d52",
  neonVerde: "#39ff9f",
  neonAzul: "#2ee6ff",
  azulForte: "#2b6bff",
  texto: "#ffffff",
  textoSuave: "#9fb3d1",
  amarelo: "#ffd400",
  vermelho: "#ff3b3b",
  player: "#2f7bff",
  banker: "#ff3d4f",
  empate: "#ffc928",
};

export const fontes = {
  titulo: "Orbitron, sans-serif",
  texto: "Montserrat, sans-serif",
};

export const brilho = (cor: string, forca = 1) =>
  `0 0 ${8 * forca}px ${cor}, 0 0 ${22 * forca}px ${cor}, 0 0 ${48 * forca}px ${cor}`;
