import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ExplosaoParticulas, LogoNeon, ParticulasConvergindo } from "../componentes/Logo";
import { Som } from "../componentes/Som";
import { useLayout } from "../componentes/layout";
import { brilho, cores, fontes } from "../tema";

const IMPACTO = 24;
const TITULO = 54;
const SUBTITULO = 86;

export const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { vertical, escala } = useLayout();
  const cx = width / 2;
  const cy = height * (vertical ? 0.33 : 0.3);

  const logoEscala = spring({ frame: frame - IMPACTO, fps, config: { damping: 9, stiffness: 120 } });
  const tremor = frame >= IMPACTO && frame < IMPACTO + 8 ? Math.sin(frame * 3) * (IMPACTO + 8 - frame) * 2.5 : 0;
  const titulo = spring({ frame: frame - TITULO, fps, config: { damping: 14 } });
  const sub = interpolate(frame, [SUBTITULO, SUBTITULO + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const varredura = interpolate(frame, [TITULO + 6, TITULO + 34], [-30, 130], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const anel = interpolate(frame, [IMPACTO, IMPACTO + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ transform: `translate(${tremor}px, ${tremor * 0.6}px)` }}>
      <Som nome="whoosh" em={0} volume={0.45} />
      <Som nome="impacto" em={IMPACTO - 2} />
      <Som nome="whoosh" em={TITULO - 4} volume={0.3} />
      <Som nome="pop" em={SUBTITULO} />

      <ParticulasConvergindo cx={cx} cy={cy} inicio={0} duracao={IMPACTO} raio={width * 0.7} />
      {/* onda de choque */}
      {frame >= IMPACTO ? (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            width: 0,
            height: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -anel * width * 0.6,
              top: -anel * width * 0.6,
              width: anel * width * 1.2,
              height: anel * width * 1.2,
              borderRadius: "50%",
              border: `${6 * escala}px solid ${cores.neonAzul}`,
              boxShadow: brilho(cores.neonAzul, 0.6),
              opacity: 1 - anel,
            }}
          />
        </div>
      ) : null}
      <ExplosaoParticulas cx={cx} cy={cy} inicio={IMPACTO} />

      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          transform: `translate(-50%, -50%) scale(${logoEscala * (vertical ? 1.15 : 0.8) * escala})`,
        }}
      >
        <LogoNeon inicio={IMPACTO} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: height * (vertical ? 0.55 : 0.6),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26 * escala,
          padding: `0 ${50 * escala}px`,
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            transform: `translateY(${(1 - titulo) * 80}px)`,
            opacity: titulo,
            fontFamily: fontes.titulo,
            fontWeight: 900,
            fontSize: (vertical ? 92 : 96) * escala,
            lineHeight: 1.08,
            color: "#fff",
            textAlign: "center",
            textShadow: brilho(cores.neonAzul, 0.55 * escala),
            letterSpacing: 2,
          }}
        >
          COMO USAR A{vertical ? <br /> : " "}
          <span style={{ color: cores.neonVerde, textShadow: brilho(cores.neonVerde, 0.6 * escala) }}>VT DADOS IA</span>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${varredura}%`,
              width: "18%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
              transform: "skewX(-20deg)",
            }}
          />
        </div>
        <div
          style={{
            opacity: sub,
            transform: `translateY(${(1 - sub) * 30}px)`,
            fontFamily: fontes.texto,
            fontWeight: 800,
            fontSize: (vertical ? 46 : 52) * escala,
            whiteSpace: "nowrap",
            color: cores.textoSuave,
            letterSpacing: 1,
            textAlign: "center",
            padding: `${10 * escala}px ${30 * escala}px`,
            borderTop: `${3 * escala}px solid ${cores.neonAzul}`,
            borderBottom: `${3 * escala}px solid ${cores.neonAzul}`,
          }}
        >
          Passo a passo completo e simples
        </div>
      </div>
    </AbsoluteFill>
  );
};
