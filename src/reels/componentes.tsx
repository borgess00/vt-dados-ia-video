// Poppins e Caveat empacotadas localmente (o render não tem acesso ao Google Fonts)
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";
import "@fontsource/caveat/700.css";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CORES } from "./config";

export const POPPINS = "Poppins, sans-serif";
export const CAVEAT = "Caveat, cursive";

export type Resultado = "J" | "B" | "E";
export const corDe = (r: Resultado) => (r === "J" ? CORES.jogador : r === "B" ? CORES.banca : CORES.empate);

/**
 * Gráfico no estilo do print (estradão): cada coluna é uma sequência da mesma cor,
 * lida de cima para baixo; o empate vira um risco amarelo sobre a bolinha.
 * Formato: [resultado, tamanho da coluna, linhas com empate (opcional), empates por linha (opcional)]
 */
type Coluna = { r: "J" | "B"; n: number; empates?: number[]; dois?: number[] };
const COLUNAS: Coluna[] = [
  { r: "B", n: 2, empates: [1] },
  { r: "J", n: 1 },
  { r: "B", n: 6 }, // sequência
  { r: "J", n: 2, empates: [0] },
  { r: "B", n: 1 }, // xadrez (colunas 4 a 7)
  { r: "J", n: 1 },
  { r: "B", n: 1 },
  { r: "J", n: 1 },
  { r: "B", n: 1 }, // rampa (colunas 8 a 11)
  { r: "J", n: 2, empates: [1] },
  { r: "B", n: 3 },
  { r: "J", n: 4, dois: [2] },
  { r: "B", n: 2 },
  { r: "J", n: 3 },
  { r: "B", n: 1, empates: [0] },
  { r: "J", n: 2 },
];
export type Celula = { c: number; l: number; r: "J" | "B"; empate: number };
export const CELULAS: Celula[] = COLUNAS.flatMap((col, c) =>
  Array.from({ length: col.n }, (_, l) => ({ c, l, r: col.r, empate: col.dois?.includes(l) ? 2 : col.empates?.includes(l) ? 1 : 0 })),
);
export const TOTAL_COLUNAS = COLUNAS.length;
export const LINHAS = 6;

/* ───────────── fundo ───────────── */
export const FundoReels: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${CORES.fundoTopo} 0%, ${CORES.fundoBase} 100%)` }}>
      <div
        style={{
          position: "absolute",
          left: width * (0.15 + 0.08 * Math.sin(t / 3)),
          top: height * 0.12,
          width: 900,
          height: 900,
          marginLeft: -450,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CORES.roxo}55 0%, transparent 65%)`,
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * (0.85 - 0.08 * Math.sin(t / 4)),
          top: height * 0.62,
          width: 1000,
          height: 1000,
          marginLeft: -500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CORES.jogador}33 0%, transparent 65%)`,
          filter: "blur(40px)",
        }}
      />
      {Array.from({ length: 26 }, (_, i) => {
        const y = (((random(`y${i}`) * height - frame * (0.4 + random(`v${i}`))) % height) + height) % height;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`x${i}`) * width,
              top: y,
              width: 4,
              height: 4,
              borderRadius: 2,
              background: i % 2 ? CORES.roxo : CORES.jogador,
              opacity: 0.25 + 0.35 * Math.abs(Math.sin(frame / 25 + i)),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────────── bolinha e gráfico ───────────── */
export const Bolinha: React.FC<{ r: Resultado; tamanho: number; numero?: number; escala?: number; brilho?: number }> = ({ r, tamanho, numero, escala = 1, brilho = 0 }) => (
  <div
    style={{
      width: tamanho,
      height: tamanho,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, #ffffff66 0%, ${corDe(r)} 45%)`,
      transform: `scale(${escala})`,
      boxShadow: brilho ? `0 0 ${18 * brilho}px ${corDe(r)}` : undefined,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: POPPINS,
      fontWeight: 700,
      fontSize: tamanho * 0.42,
      color: "#fff",
    }}
  >
    {numero ?? null}
  </div>
);

/** Bolinha vazada do gráfico, com risco amarelo quando houve empate. */
export const Anel: React.FC<{ r: Resultado; tamanho: number; empate?: number; numero?: number; escala?: number; brilho?: number }> = ({
  r,
  tamanho,
  empate = 0,
  numero,
  escala = 1,
  brilho = 0,
}) => (
  <div style={{ position: "relative", width: tamanho, height: tamanho, transform: `scale(${escala})` }}>
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" style={{ filter: brilho ? `drop-shadow(0 0 ${10 * brilho}px ${corDe(r)})` : undefined }}>
      <circle cx="50" cy="50" r="38" fill="none" stroke={corDe(r)} strokeWidth="13" />
      {empate ? <line x1="22" y1="78" x2="78" y2="22" stroke={CORES.empate} strokeWidth="15" strokeLinecap="round" /> : null}
    </svg>
    {numero !== undefined || empate === 2 ? (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: POPPINS,
          fontWeight: 700,
          fontSize: tamanho * (numero !== undefined ? 0.36 : 0.5),
          color: numero !== undefined ? "#1b1640" : "#1b1640",
        }}
      >
        {numero ?? 2}
      </div>
    ) : null}
  </div>
);

/** Destaque sobre células do gráfico (coluna, linha). */
export type Destaque = { celulas: [number, number][]; rotulo: string; de: number; ate: number };

/**
 * Gráfico (quadro branco com bolinhas vazadas). `visiveis` pode ser fracionário (a última bolinha "entra").
 * `numeros` mostra a ordem de leitura sobre as primeiras N bolinhas.
 */
export const Grafico: React.FC<{
  x: number;
  y: number;
  celula: number;
  colunas?: number;
  visiveis: number;
  numeros?: number;
  destaques?: Destaque[];
}> = ({ x, y, celula, colunas = TOTAL_COLUNAS, visiveis, numeros = 0, destaques = [] }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: colunas * celula,
        height: LINHAS * celula,
        borderRadius: 14,
        background: "#ffffff",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      }}
    >
      <svg width={colunas * celula} height={LINHAS * celula} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: colunas + 1 }, (_, i) => (
          <line key={`v${i}`} x1={i * celula} y1={0} x2={i * celula} y2={LINHAS * celula} stroke="#dfe3ea" strokeWidth={1.5} />
        ))}
        {Array.from({ length: LINHAS + 1 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * celula} x2={colunas * celula} y2={i * celula} stroke="#dfe3ea" strokeWidth={1.5} />
        ))}
      </svg>
      {CELULAS.slice(0, Math.min(CELULAS.length, Math.ceil(visiveis))).map((cel, i) => {
        const parcial = Math.min(1, visiveis - i);
        const t = celula * 0.84;
        return (
          <div key={i} style={{ position: "absolute", left: cel.c * celula + (celula - t) / 2, top: cel.l * celula + (celula - t) / 2, opacity: Math.min(1, parcial * 2) }}>
            <Anel r={cel.r} tamanho={t} empate={cel.empate} escala={parcial < 1 ? 0.4 + 0.8 * parcial : 1} numero={i < numeros ? i + 1 : undefined} />
          </div>
        );
      })}
      {destaques.map((d, k) => {
        if (frame < d.de || frame > d.ate) return null;
        const a = interpolate(frame, [d.de, d.de + 8, d.ate - 8, d.ate], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const pulso = 0.7 + 0.3 * Math.sin((frame - d.de) / 4);
        const topo = Math.min(...d.celulas.map(([, l]) => l)) * celula;
        const esquerda = Math.min(...d.celulas.map(([c]) => c)) * celula;
        return (
          <div key={k} style={{ opacity: a }}>
            {d.celulas.map(([c, l], j) => (
              <div
                key={j}
                style={{
                  position: "absolute",
                  left: c * celula + 1,
                  top: l * celula + 1,
                  width: celula - 2,
                  height: celula - 2,
                  borderRadius: 10,
                  background: `${CORES.roxo}26`,
                  border: `4px solid ${CORES.roxo}`,
                  boxShadow: `0 0 ${16 * pulso}px ${CORES.roxo}`,
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: esquerda,
                top: topo - 56,
                padding: "4px 14px",
                borderRadius: 10,
                background: CORES.roxo,
                fontFamily: POPPINS,
                fontWeight: 700,
                fontSize: 28,
                color: "#fff",
                whiteSpace: "nowrap",
                boxShadow: `0 0 18px ${CORES.roxo}`,
              }}
            >
              {d.rotulo}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ───────────── dado ───────────── */
const PONTOS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[26, 26], [50, 50], [74, 74]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
  6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
};

/** Dado que gira entre `inicio` e `para` e mostra `valor` no fim. */
export const Dado: React.FC<{ cor: string; valor: number; inicio: number; para: number; tamanho: number; semente: string }> = ({ cor, valor, inicio, para, tamanho, semente }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rolando = frame >= inicio && frame < para;
  const face = rolando ? 1 + Math.floor(random(`${semente}-${Math.floor(frame / 3)}`) * 6) : valor;
  const giro = rolando ? (frame - inicio) * 31 : 0;
  const pousa = spring({ frame: frame - para, fps, config: { damping: 8, stiffness: 180 } });
  const pulo = rolando ? -Math.abs(Math.sin((frame - inicio) / 3)) * 40 : 0;
  const escala = frame >= para ? 1.15 - 0.15 * pousa : 1;
  return (
    <div style={{ width: tamanho, height: tamanho, transform: `translateY(${pulo}px) rotate(${giro}deg) scale(${escala})` }}>
      <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 16px ${cor}aa)` }}>
        <rect x="4" y="4" width="92" height="92" rx="20" fill={cor} stroke="#ffffff55" strokeWidth="3" />
        <rect x="8" y="8" width="84" height="40" rx="16" fill="#ffffff22" />
        {PONTOS[face].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="9" fill="#fff" />
        ))}
      </svg>
    </div>
  );
};

/* ───────────── celular ───────────── */
export const Celular: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; inclinacao?: number }> = ({ x, y, w, h, children, inclinacao = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 64,
      background: "#0c0a1c",
      border: "3px solid #2f2860",
      boxShadow: `0 40px 90px rgba(0,0,0,0.6), 0 0 70px ${CORES.roxo}44`,
      padding: 14,
      boxSizing: "border-box",
      transform: `rotate(${inclinacao}deg)`,
    }}
  >
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", background: "linear-gradient(180deg, #0b1330, #0a0820)" }}>
      {children}
      <div style={{ position: "absolute", top: 14, left: "50%", width: 120, height: 30, marginLeft: -60, borderRadius: 15, background: "#000" }} />
    </div>
  </div>
);

/* ───────────── legenda ───────────── */
const PontoCor: React.FC<{ r: Resultado }> = ({ r }) => (
  <span
    style={{
      display: "inline-block",
      width: "0.72em",
      height: "0.72em",
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, #ffffff88 0%, ${corDe(r)} 50%)`,
      verticalAlign: "-0.06em",
      margin: "0 0.08em",
      boxShadow: `0 0 12px ${corDe(r)}`,
    }}
  />
);

export const TextoComPontos: React.FC<{ texto: string }> = ({ texto }) => (
  <>
    {texto.split(/(\[[JBE]\])/).map((parte, i) => {
      const m = parte.match(/^\[([JBE])\]$/);
      return m ? <PontoCor key={i} r={m[1] as Resultado} /> : <span key={i}>{parte}</span>;
    })}
  </>
);

/** Legenda grande, centralizada, até 2 linhas, entrando com fade + leve subida. */
export const Legenda: React.FC<{ texto: string; duracao: number }> = ({ texto, duracao }) => {
  const frame = useCurrentFrame();
  const entra = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const sai = interpolate(frame, [duracao - 6, duracao], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1330,
        height: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: entra * sai,
        transform: `translateY(${(1 - entra) * 26}px)`,
      }}
    >
      <div
        style={{
          fontFamily: POPPINS,
          fontWeight: 700,
          fontSize: 58,
          lineHeight: 1.22,
          color: CORES.texto,
          textAlign: "center",
          textShadow: "0 4px 18px rgba(0,0,0,0.7)",
        }}
      >
        <TextoComPontos texto={texto} />
      </div>
    </div>
  );
};
