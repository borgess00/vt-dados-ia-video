import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { cores } from "../tema";

const PARTICULAS = Array.from({ length: 46 }, (_, i) => ({
  x: random(`px${i}`),
  y: random(`py${i}`),
  r: 1.5 + random(`pr${i}`) * 3.5,
  vel: 0.15 + random(`pv${i}`) * 0.6,
  verde: random(`pc${i}`) > 0.55,
}));

/** Fundo escuro com grade em perspectiva e partículas neon flutuando. */
export const Fundo: React.FC<{ intensidade?: number }> = ({ intensidade = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const deslocaGrade = (frame * 1.6) % 80;

  return (
    <AbsoluteFill style={{ backgroundColor: cores.fundo, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 12%, ${cores.fundo2} 0%, transparent 62%),
            radial-gradient(ellipse at 88% 88%, rgba(43,107,255,0.30) 0%, transparent 55%),
            radial-gradient(ellipse at 8% 70%, rgba(139,92,246,0.28) 0%, transparent 52%),
            linear-gradient(180deg, #0c0826 0%, #070a24 100%)`,
        }}
      />
      {/* grade em perspectiva */}
      <div
        style={{
          position: "absolute",
          left: -width * 0.5,
          width: width * 2,
          bottom: -height * 0.05,
          height: height * 0.45,
          transform: "perspective(600px) rotateX(62deg)",
          transformOrigin: "50% 100%",
          backgroundImage: `linear-gradient(rgba(139,92,246,0.35) 2px, transparent 2px),
            linear-gradient(90deg, rgba(139,92,246,0.35) 2px, transparent 2px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `0 ${deslocaGrade}px`,
          maskImage: "linear-gradient(to top, black 10%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 90%)",
          opacity: 0.55 * intensidade,
        }}
      />
      {PARTICULAS.map((p, i) => {
        const y = ((p.y * height - frame * p.vel * 3) % height + height) % height;
        const piscar = 0.35 + 0.65 * Math.abs(Math.sin(frame / 20 + i));
        const cor = p.verde ? cores.roxo : "#4f8bff";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x * width,
              top: y,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: "50%",
              background: cor,
              boxShadow: `0 0 ${p.r * 4}px ${cor}`,
              opacity: piscar * 0.7 * intensidade,
            }}
          />
        );
      })}
      {/* vinheta */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(3,0,15,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};
