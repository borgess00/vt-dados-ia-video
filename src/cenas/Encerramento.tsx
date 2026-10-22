import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LogoNeon } from "../componentes/Logo";
import { useLayout } from "../componentes/layout";
import { brilho, cores, fontes } from "../tema";

export const Encerramento: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { escala, vertical } = useLayout();
  const logo = spring({ frame, fps, config: { damping: 12 } });
  const texto = interpolate(frame, [22, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fade = interpolate(frame, [durationInFrames - 45, durationInFrames], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 70 * escala, flexDirection: "column" }}>
      <div style={{ transform: `scale(${logo * (vertical ? 1.2 : 0.9) * escala})` }}>
        <LogoNeon inicio={2} />
      </div>
      <div
        style={{
          opacity: texto,
          transform: `translateY(${(1 - texto) * 30}px)`,
          fontFamily: fontes.texto,
          fontWeight: 800,
          fontSize: (vertical ? 58 : 56) * escala,
          color: "#fff",
          textAlign: "center",
          padding: `0 ${40 * escala}px`,
        }}
      >
        VT Dados IA <span style={{ color: cores.neonAzul }}>–</span>{" "}
        <span style={{ display: vertical ? "block" : "inline", whiteSpace: "nowrap", color: "#c4a5ff", textShadow: brilho(cores.roxo, 0.5 * escala) }}>
          Analise com inteligência
        </span>
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};
