import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { cores } from "../tema";

export type TipoEntrada = "zoom" | "slide" | "glitch" | "nenhuma";

/**
 * Envolve uma cena com entrada rápida (zoom / slide / glitch leve) e uma saída curta em zoom.
 * `semSaida` mantém a cena 100% visível até o último frame (usado no aviso final).
 */
export const Transicao: React.FC<{ children: React.ReactNode; entrada: TipoEntrada; semSaida?: boolean }> = ({
  children,
  entrada,
  semSaida,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const E = 11;
  const p = interpolate(frame, [0, E], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const saida = semSaida
    ? 0
    : interpolate(frame, [durationInFrames - 6, durationInFrames], [0, 1], { extrapolateLeft: "clamp", easing: Easing.in(Easing.quad) });

  let transform = "";
  let filtro = "";
  let opacidade = 1;
  if (entrada === "zoom") {
    transform = `scale(${interpolate(p, [0, 1], [1.35, 1])})`;
    filtro = `blur(${(1 - p) * 14}px)`;
    opacidade = p;
  } else if (entrada === "slide") {
    transform = `translateX(${(1 - p) * width * 0.9}px) rotate(${(1 - p) * 4}deg)`;
    filtro = `blur(${(1 - p) * 8}px)`;
  } else if (entrada === "glitch") {
    const j = frame < 9 ? (random(`g${frame}`) - 0.5) * 70 : 0;
    transform = `translateX(${j}px) skewX(${frame < 9 ? (random(`s${frame}`) - 0.5) * 10 : 0}deg)`;
    filtro = frame < 9 ? `hue-rotate(${random(`h${frame}`) * 90}deg) saturate(1.6)` : "";
    opacidade = interpolate(frame, [0, 3], [0.4, 1], { extrapolateRight: "clamp" });
  }
  transform += ` scale(${1 + saida * 0.12})`;
  if (saida > 0) filtro += ` blur(${saida * 10}px)`;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform, filter: filtro || undefined, opacity: opacidade * (1 - saida * 0.6) }}>{children}</AbsoluteFill>
      {entrada === "glitch" && frame < 10 ? <FaixasGlitch frame={frame} /> : null}
      {entrada !== "nenhuma" && frame < 7 ? (
        <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [0, 7], [0.35, 0]), mixBlendMode: "overlay" }} />
      ) : null}
    </AbsoluteFill>
  );
};

const FaixasGlitch: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
    {Array.from({ length: 7 }, (_, i) => {
      const top = random(`ft${frame}-${i}`) * 100;
      const h = 1 + random(`fh${frame}-${i}`) * 6;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${top}%`,
            height: `${h}%`,
            background: i % 2 ? cores.neonAzul : "#ff2bd6",
            opacity: 0.35,
            transform: `translateX(${(random(`fx${frame}-${i}`) - 0.5) * 120}px)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);
