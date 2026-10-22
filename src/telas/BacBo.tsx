import { Img, staticFile } from "remotion";
import { capturas, type Retangulo } from "../capturas";
import { cores, fontes } from "../tema";

/** Sequência de resultados usada no gráfico ilustrativo (P = azul, B = vermelho, E = empate). */
export const RESULTADOS = "PBBPPEBPBBPBPPBEPBBPPBPBEBBPPBPPBEBPBBPBPPBBEPBP".split("") as ("P" | "B" | "E")[];
export const corResultado = (r: "P" | "B" | "E") => (r === "P" ? cores.player : r === "B" ? cores.banker : cores.empate);

/** Área do gráfico (canto inferior esquerdo) na tela interna 900x1100. */
export const GRAFICO_BACBO: Retangulo = capturas.bacbo?.grafico ?? { x: 24, y: 650, w: 430, h: 400 };

export const GradeResultados: React.FC<{ largura: number; altura: number; colunas: number; linhas: number; quantidade?: number; fundo?: string }> = ({
  largura,
  altura,
  colunas,
  linhas,
  quantidade = colunas * linhas,
  fundo = "#f4f1ea",
}) => {
  const celW = largura / colunas;
  const celH = altura / linhas;
  const r = Math.min(celW, celH) * 0.38;
  return (
    <svg width={largura} height={altura} style={{ display: "block", background: fundo, borderRadius: 10 }}>
      {Array.from({ length: colunas + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i * celW} y1={0} x2={i * celW} y2={altura} stroke="#c9c3b6" strokeWidth={1.5} />
      ))}
      {Array.from({ length: linhas + 1 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * celH} x2={largura} y2={i * celH} stroke="#c9c3b6" strokeWidth={1.5} />
      ))}
      {RESULTADOS.slice(0, Math.min(quantidade, colunas * linhas)).map((res, i) => {
        const c = Math.floor(i / linhas);
        const l = i % linhas;
        return <circle key={i} cx={c * celW + celW / 2} cy={l * celH + celH / 2} r={r} fill={corResultado(res)} />;
      })}
    </svg>
  );
};

const Dado: React.FC<{ valor: number; cor: string }> = ({ valor, cor }) => {
  const pontos: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[26, 26], [50, 50], [74, 74]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
    6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
  };
  return (
    <svg width={96} height={96} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 14px ${cor})` }}>
      <rect x="4" y="4" width="92" height="92" rx="18" fill="#fff" stroke={cor} strokeWidth="5" />
      {pontos[valor].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8.5" fill={cor} />
      ))}
    </svg>
  );
};

/** Tela ilustrativa do Bac Bo (ou a captura real, se configurada em capturas.ts). */
export const TelaBacBo: React.FC = () => {
  if (capturas.bacbo) {
    return <Img src={staticFile(capturas.bacbo.arquivo)} style={{ width: 900, display: "block" }} />;
  }
  return (
    <div style={{ width: 900, height: 1100, position: "relative", background: "linear-gradient(180deg, #1b0a12 0%, #2a0c14 45%, #12060b 100%)" }}>
      <div
        style={{
          position: "absolute",
          top: 26,
          width: "100%",
          textAlign: "center",
          fontFamily: fontes.titulo,
          fontWeight: 900,
          fontSize: 54,
          color: "#ffd77a",
          letterSpacing: 8,
          textShadow: "0 0 18px rgba(255,190,80,0.6)",
        }}
      >
        BAC BO
      </div>
      {/* mesa com os dados */}
      <div
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          top: 110,
          height: 500,
          borderRadius: 26,
          background: "radial-gradient(ellipse at 50% 30%, #4a1a26 0%, #24090f 75%)",
          border: "3px solid #6b3a1e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {[
          { cor: cores.player, dados: [4, 2] },
          { cor: cores.banker, dados: [3, 5] },
        ].map((lado, i) => (
          <div
            key={i}
            style={{
              width: 330,
              height: 300,
              borderRadius: 24,
              background: `${lado.cor}22`,
              border: `4px solid ${lado.cor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 26,
            }}
          >
            {lado.dados.map((v, j) => (
              <Dado key={j} valor={v} cor={lado.cor} />
            ))}
          </div>
        ))}
      </div>
      {/* gráfico no canto inferior esquerdo */}
      <div style={{ position: "absolute", left: GRAFICO_BACBO.x, top: GRAFICO_BACBO.y, borderRadius: 12, overflow: "hidden", boxShadow: "0 0 0 3px #6b3a1e" }}>
        <GradeResultados largura={GRAFICO_BACBO.w} altura={GRAFICO_BACBO.h} colunas={8} linhas={6} quantidade={44} />
      </div>
      {/* área de apostas (ilustrativa, sem texto) */}
      <div style={{ position: "absolute", left: 480, top: 650, width: 396, height: 400, display: "flex", flexDirection: "column", gap: 18 }}>
        {[cores.player, cores.empate, cores.banker].map((c) => (
          <div key={c} style={{ flex: 1, borderRadius: 18, background: `${c}30`, border: `4px solid ${c}` }} />
        ))}
      </div>
    </div>
  );
};

/** Recorte só do gráfico (usado como "print"). */
export const RecorteGrafico: React.FC<{ largura: number }> = ({ largura }) => {
  const s = largura / GRAFICO_BACBO.w;
  return (
    <div style={{ width: largura, height: GRAFICO_BACBO.h * s, overflow: "hidden", position: "relative", borderRadius: 10 }}>
      <div style={{ position: "absolute", left: -GRAFICO_BACBO.x * s, top: -GRAFICO_BACBO.y * s, transform: `scale(${s})`, transformOrigin: "0 0" }}>
        <TelaBacBo />
      </div>
    </div>
  );
};
