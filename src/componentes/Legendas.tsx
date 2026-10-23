import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { linhaDoTempo, type PaginaLegenda } from "../tempo";
import { brilho, cores, fontes } from "../tema";
import { useLayout } from "./layout";

/** Legendas grandes sincronizadas com a narração, palavra por palavra, com palavras-chave em destaque. */
export const Legendas: React.FC<{ legendas?: PaginaLegenda[] }> = ({ legendas = linhaDoTempo.legendas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { legenda, escala, vertical } = useLayout();
  const pagina = legendas.find((p) => frame >= p.inicio && frame < p.fim);
  if (!pagina) return null;
  const local = frame - pagina.inicio;
  const entra = spring({ frame: local, fps, config: { damping: 15, stiffness: 200 } });
  const sai = interpolate(frame, [pagina.fim - 4, pagina.fim], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: legenda.x,
        top: legenda.y,
        width: legenda.w,
        height: legenda.h,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: sai,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: (vertical ? 34 : 30) * escala,
          rowGap: 4 * escala,
          transform: `scale(${0.85 + 0.15 * entra})`,
          fontFamily: fontes.texto,
          fontWeight: 900,
          fontSize: (vertical ? 86 : 80) * escala,
          lineHeight: 1.12,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {pagina.palavras.map((p, i) => {
          const falada = frame >= p.inicio;
          const pop = spring({ frame: frame - p.inicio, fps, config: { damping: 9, stiffness: 260 } });
          const cor = p.destaque ? cores.neonVerde : "#ffffff";
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: falada ? cor : "rgba(255,255,255,0.55)",
                transform: `scale(${falada ? 1 + 0.1 * (1 - pop) : 0.96})`,
                WebkitTextStroke: `${3 * escala}px #000`,
                paintOrder: "stroke fill",
                textShadow:
                  falada && p.destaque
                    ? `${brilho(cores.neonVerde, 0.45)}, 0 ${6 * escala}px 0 #000`
                    : `0 ${6 * escala}px 0 #000, 0 0 ${20 * escala}px rgba(0,0,0,0.8)`,
              }}
            >
              {p.texto}
            </span>
          );
        })}
      </div>
    </div>
  );
};
