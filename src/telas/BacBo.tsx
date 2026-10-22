import { Img, staticFile } from "remotion";
import { capturas, type Retangulo } from "../capturas";
import { cores, fontes } from "../tema";

/** Print real do gráfico do Bac Bo (415x129). */
export const IMG_GRAFICO = "capturas/bacbo-grafico.png";
const PROPORCAO_GRAFICO = 129 / 415;

/** Área do gráfico (canto inferior esquerdo) na tela interna 900x1100. */
export const GRAFICO_BACBO: Retangulo = capturas.bacbo?.grafico ?? { x: 24, y: 800, w: 560, h: Math.round(560 * PROPORCAO_GRAFICO) };

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

/** Tela do Bac Bo: ilustrativa, com o gráfico real no canto inferior esquerdo. */
export const TelaBacBo: React.FC = () => {
  if (capturas.bacbo) {
    return <Img src={staticFile(capturas.bacbo.arquivo)} style={{ width: 900, height: 1100, display: "block", objectFit: "cover" }} />;
  }
  const g = GRAFICO_BACBO;
  return (
    <div style={{ width: 900, height: 1100, position: "relative", background: "linear-gradient(180deg, #1b0a12 0%, #2a0c14 45%, #12060b 100%)" }}>
      <div
        style={{
          position: "absolute",
          top: 22,
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
          top: 100,
          height: 410,
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
              height: 270,
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
      {/* área de apostas (ilustrativa, sem texto) */}
      <div style={{ position: "absolute", left: 24, right: 24, top: 540, height: 220, display: "flex", gap: 18 }}>
        {[cores.player, cores.empate, cores.banker].map((c) => (
          <div key={c} style={{ flex: c === cores.empate ? 0.7 : 1, borderRadius: 18, background: `${c}30`, border: `4px solid ${c}` }} />
        ))}
      </div>
      {/* gráfico real no canto inferior esquerdo */}
      <div style={{ position: "absolute", left: g.x, top: g.y, borderRadius: 8, overflow: "hidden", boxShadow: "0 0 0 3px #6b3a1e" }}>
        <Img src={staticFile(IMG_GRAFICO)} style={{ width: g.w, height: g.h, display: "block" }} />
      </div>
      <div style={{ position: "absolute", left: g.x + g.w + 18, right: 24, top: g.y, height: g.h, borderRadius: 8, background: "#f4f1ea22", border: "3px solid #6b3a1e" }} />
      <div style={{ position: "absolute", left: 24, right: 24, top: g.y + g.h + 26, height: 80, borderRadius: 16, background: "rgba(0,0,0,0.35)", border: "2px solid #3a1a12" }} />
    </div>
  );
};

/** O "print" do gráfico. */
export const RecorteGrafico: React.FC<{ largura: number }> = ({ largura }) => (
  <Img src={staticFile(IMG_GRAFICO)} style={{ width: largura, height: largura * PROPORCAO_GRAFICO, display: "block" }} />
);
