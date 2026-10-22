import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import type { Retangulo } from "../capturas";
import { cores } from "../tema";

const sumirAte = (frame: number, fim: number) =>
  Number.isFinite(fim) ? interpolate(frame, [fim - 6, fim], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

/** Círculo (elipse) desenhado ao redor de uma área, com brilho pulsante. Coordenadas da tela interna. */
export const CirculoAnimado: React.FC<{ r: Retangulo; inicio: number; fim?: number; cor?: string }> = ({
  r,
  inicio,
  fim = Infinity,
  cor = cores.neonVerde,
}) => {
  const frame = useCurrentFrame();
  if (frame < inicio || frame > fim) return null;
  const local = frame - inicio;
  const desenho = interpolate(local, [0, 16], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const sumir = sumirAte(frame, fim);
  const pulso = 1 + Math.sin(local / 5) * 0.025;
  const m = 34;
  const rx = r.w / 2 + m;
  const ry = r.h / 2 + m;
  const perimetro = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  return (
    <svg
      style={{
        position: "absolute",
        left: r.x - m - 10,
        top: r.y - m - 10,
        overflow: "visible",
        transform: `scale(${pulso})`,
        transformOrigin: `${rx + 10}px ${ry + 10}px`,
        opacity: sumir,
        filter: `drop-shadow(0 0 10px ${cor}) drop-shadow(0 0 22px ${cor})`,
      }}
      width={rx * 2 + 20}
      height={ry * 2 + 20}
    >
      <ellipse
        cx={rx + 10}
        cy={ry + 10}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={cor}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={perimetro}
        strokeDashoffset={perimetro * (1 - desenho)}
        transform={`rotate(-100 ${rx + 10} ${ry + 10})`}
      />
    </svg>
  );
};

/** Caixa com brilho neon em volta de uma área (destaque de seção). */
export const CaixaBrilho: React.FC<{ r: Retangulo; inicio: number; fim?: number; cor?: string; rotulo?: string }> = ({
  r,
  inicio,
  fim = Infinity,
  cor = cores.neonVerde,
  rotulo,
}) => {
  const frame = useCurrentFrame();
  if (frame < inicio || frame > fim) return null;
  const local = frame - inicio;
  const entra = interpolate(local, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const sumir = sumirAte(frame, fim);
  const pulso = 0.6 + 0.4 * Math.abs(Math.sin(local / 8));
  return (
    <div
      style={{
        position: "absolute",
        left: r.x - 14,
        top: r.y - 14,
        width: r.w + 28,
        height: r.h + 28,
        borderRadius: 22,
        border: `6px solid ${cor}`,
        boxShadow: `0 0 ${30 * pulso}px ${cor}, inset 0 0 ${26 * pulso}px ${cor}55`,
        opacity: entra * sumir,
        transform: `scale(${interpolate(entra, [0, 1], [1.06, 1])})`,
      }}
    >
      {rotulo ? (
        <div
          style={{
            position: "absolute",
            left: 18,
            top: -24,
            background: cor,
            color: "#00140a",
            fontFamily: "Montserrat",
            fontWeight: 900,
            fontSize: 24,
            padding: "4px 14px",
            borderRadius: 8,
          }}
        >
          {rotulo}
        </div>
      ) : null}
    </div>
  );
};

/** Seta neon que entra e fica "quicando" apontando para (x, y). */
export const SetaAnimada: React.FC<{
  x: number;
  y: number;
  inicio: number;
  fim?: number;
  direcao?: "baixo" | "cima" | "esquerda" | "direita";
  cor?: string;
  tamanho?: number;
}> = ({ x, y, inicio, fim = Infinity, direcao = "baixo", cor = cores.neonVerde, tamanho = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < inicio || frame > fim) return null;
  const local = frame - inicio;
  const entra = spring({ frame: local, fps, config: { damping: 12 } });
  const quique = Math.sin(local / 4) * 14;
  const rot = { baixo: 0, esquerda: 90, cima: 180, direita: -90 }[direcao];
  const sumir = sumirAte(frame, fim);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 0,
        height: 0,
        transform: `rotate(${rot}deg)`,
        opacity: sumir,
      }}
    >
      <svg
        width={tamanho}
        height={tamanho * 1.3}
        viewBox="0 0 100 130"
        style={{
          position: "absolute",
          left: -tamanho / 2,
          top: -tamanho * 1.3 - 12 - quique - (1 - entra) * 120,
          opacity: entra,
          filter: `drop-shadow(0 0 10px ${cor}) drop-shadow(0 0 20px ${cor})`,
        }}
      >
        <path d="M35 0 H65 V70 H95 L50 128 L5 70 H35 Z" fill={cor} stroke="#002a16" strokeWidth="4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Cursor que se move de um ponto a outro e "clica" (com onda) no frame `clique`. */
export const CursorClique: React.FC<{
  de: { x: number; y: number };
  para: { x: number; y: number };
  inicio: number;
  clique: number;
  fim?: number;
}> = ({ de, para, inicio, clique, fim = Infinity }) => {
  const frame = useCurrentFrame();
  if (frame < inicio || frame > fim) return null;
  const t = interpolate(frame, [inicio, clique - 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const x = de.x + (para.x - de.x) * t;
  const y = de.y + (para.y - de.y) * t;
  const aperta = frame >= clique && frame < clique + 5 ? 0.82 : 1;
  const onda = frame - clique;
  const aparece = interpolate(frame, [inicio, inicio + 6], [0, 1], { extrapolateRight: "clamp" });
  const sumir = sumirAte(frame, fim);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, opacity: aparece * sumir }}>
      {onda >= 0 && onda < 24
        ? [0, 7].map((atraso) => {
            const o = onda - atraso;
            if (o < 0) return null;
            const r = interpolate(o, [0, 17], [10, 90], { extrapolateRight: "clamp" });
            return (
              <div
                key={atraso}
                style={{
                  position: "absolute",
                  left: -r,
                  top: -r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: "50%",
                  border: `6px solid ${cores.neonAzul}`,
                  boxShadow: `0 0 18px ${cores.neonAzul}`,
                  opacity: interpolate(o, [0, 17], [1, 0], { extrapolateRight: "clamp" }),
                }}
              />
            );
          })
        : null}
      <svg
        width={70}
        height={70}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: -8,
          top: -4,
          transform: `scale(${aperta})`,
          transformOrigin: "8px 4px",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.8))",
        }}
      >
        <path d="M5 2 L5 19 L9.5 15 L12.5 22 L15.5 20.7 L12.6 14 L18.5 14 Z" fill="#fff" stroke="#000" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
