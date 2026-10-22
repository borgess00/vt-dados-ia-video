import { interpolate, spring, useCurrentFrame, useVideoConfig, random } from "remotion";
import { brilho, cores, fontes } from "../tema";
import { useLayout } from "./layout";

/** Selo "PASSO N" com entrada animada (zoom + deslize + leve glitch). */
export const PassoBadge: React.FC<{ numero: number }> = ({ numero }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { badge, escala } = useLayout();
  const entra = spring({ frame: frame - 2, fps, config: { damping: 11, stiffness: 140 } });
  const tremor = frame < 10 ? (random(`b${frame}`) - 0.5) * 24 : 0;
  const varredura = interpolate(frame, [6, 26], [-120, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: badge.x,
        top: badge.y,
        transform: `translate(-50%, -50%) translateX(${tremor}px) scale(${entra * escala})`,
        opacity: entra,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "16px 40px 16px 20px",
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(57,255,159,0.18), rgba(46,230,255,0.12))",
          border: `4px solid ${cores.neonVerde}`,
          boxShadow: `0 0 28px ${cores.neonVerde}88, inset 0 0 20px ${cores.neonVerde}44`,
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: cores.neonVerde,
            color: "#00180c",
            fontFamily: fontes.titulo,
            fontWeight: 900,
            fontSize: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: brilho(cores.neonVerde, 0.6),
          }}
        >
          {numero}
        </div>
        <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 66, letterSpacing: 6, color: "#fff", textShadow: brilho(cores.neonAzul, 0.5) }}>
          PASSO {numero}
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${varredura}%`,
            width: "30%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
            transform: "skewX(-20deg)",
          }}
        />
      </div>
    </div>
  );
};

export type ItemInstrucao = { de: number; texto: string; alerta?: boolean; ate?: number };

/** Cartão com o texto na tela de cada etapa. Troca o texto com animação. */
export const Instrucao: React.FC<{ itens: ItemInstrucao[] }> = ({ itens }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { instrucao, escala, vertical } = useLayout();
  const ativos = itens.filter((i) => frame >= i.de && (i.ate === undefined || frame < i.ate));
  const atual = ativos[ativos.length - 1];
  if (!atual) return null;
  const local = frame - atual.de;
  const entra = spring({ frame: local, fps, config: { damping: 14, stiffness: 160 } });
  const cor = atual.alerta ? cores.amarelo : cores.neonAzul;
  const tremor = atual.alerta && local < 18 ? Math.sin(local * 2.2) * (18 - local) * 0.9 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: instrucao.x,
        top: instrucao.y,
        width: instrucao.w,
        height: instrucao.h,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `translateX(${tremor}px) translateY(${(1 - entra) * 40}px) scale(${0.9 + 0.1 * entra})`,
          opacity: entra,
          padding: `${16 * escala}px ${30 * escala}px`,
          borderRadius: 22 * escala,
          background: atual.alerta ? "rgba(60,40,0,0.85)" : "rgba(5,16,36,0.88)",
          border: `${4 * escala}px solid ${cor}`,
          boxShadow: `0 0 ${24 * escala}px ${cor}77`,
          color: atual.alerta ? cores.amarelo : "#fff",
          fontFamily: fontes.texto,
          fontWeight: 800,
          fontSize: (vertical ? 46 : 50) * escala,
          lineHeight: 1.2,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          gap: 16 * escala,
        }}
      >
        {atual.alerta ? <IconeAlerta tamanho={56 * escala} cor={cores.amarelo} /> : null}
        <span>{atual.texto}</span>
      </div>
    </div>
  );
};

export const IconeAlerta: React.FC<{ tamanho: number; cor: string }> = ({ tamanho, cor }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 100 90" style={{ flexShrink: 0, filter: `drop-shadow(0 0 8px ${cor})` }}>
    <path d="M50 4 L97 86 H3 Z" fill={cor} stroke="#000" strokeWidth="4" strokeLinejoin="round" />
    <rect x="45" y="30" width="10" height="32" rx="4" fill="#000" />
    <circle cx="50" cy="73" r="6" fill="#000" />
  </svg>
);
