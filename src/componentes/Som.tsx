import { Html5Audio, Sequence, staticFile } from "remotion";

export type NomeSom = "whoosh" | "impacto" | "clique" | "glitch" | "pop" | "notificacao" | "scan";

const volumes: Record<NomeSom, number> = {
  whoosh: 0.35,
  impacto: 0.5,
  clique: 0.4,
  glitch: 0.22,
  pop: 0.3,
  notificacao: 0.55,
  scan: 0.18,
};

/** Toca um efeito sonoro no frame `em` (relativo à sequência atual). */
export const Som: React.FC<{ nome: NomeSom; em: number; volume?: number; duracao?: number; loop?: boolean }> = ({
  nome,
  em,
  volume,
  duracao,
  loop,
}) => (
  <Sequence from={Math.max(0, em)} durationInFrames={duracao} layout="none" name={`som:${nome}`}>
    <Html5Audio src={staticFile(`audio/${nome}.wav`)} volume={volume ?? volumes[nome]} loop={loop} />
  </Sequence>
);
