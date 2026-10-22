import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { capturas, type CapturaSite } from "../capturas";
import { brilho, cores, fontes } from "../tema";
import { GradeResultados, RecorteGrafico, RESULTADOS, corResultado } from "./BacBo";

export const ENDERECO_SITE = "vtdados.netlify.app";

const PADRAO: Omit<CapturaSite, "arquivo"> = {
  altura: 2350,
  logoTopo: { x: 30, y: 20, w: 380, h: 84 },
  secaoImportar: { x: 30, y: 640, w: 840, h: 630 },
  areaAdicionarPrint: { x: 60, y: 760, w: 780, h: 300 },
  botaoLerImagem: { x: 60, y: 1110, w: 780, h: 100 },
  areaRegistro: { x: 60, y: 1410, w: 780, h: 390 },
  graficoIlustrativo: { x: 60, y: 1960, w: 780, h: 340 },
};

/** Posições (em px da página com 900 de largura) das áreas destacadas no vídeo. */
export const SITE = capturas.site ?? PADRAO;

/** Rolagens usadas nos passos (posição do topo da janela). */
export const ROLAGEM = {
  topo: 0,
  importar: SITE.secaoImportar.y - 40,
  registro: SITE.areaRegistro.y - 120,
};

const REG_COLUNAS = 12;
const REG_LINHAS = 6;

const Esqueleto: React.FC<{ w: number | string; h?: number; op?: number }> = ({ w, h = 22, op = 1 }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: "#1a2a48", opacity: op }} />
);

const Cartao: React.FC<{ y: number; h: number; children?: React.ReactNode }> = ({ y, h, children }) => (
  <div
    style={{
      position: "absolute",
      left: 30,
      top: y,
      width: 840,
      height: h,
      borderRadius: 26,
      background: "linear-gradient(180deg, #0c1a33, #081226)",
      border: `2px solid ${cores.painelBorda}`,
    }}
  >
    {children}
  </div>
);

export type EstadoSite = {
  /** frame em que a print aparece na área de envio */
  printEm?: number;
  /** frame do clique em "Ler imagem e reconhecer resultados" */
  cliqueLerEm?: number;
  /** quantas rodadas já foram registradas (pode ser fracionário para animar a última) */
  registros?: number;
};

/** Página do site da VT Dados IA (ilustrativa, ou a captura real configurada em capturas.ts). */
export const PaginaSite: React.FC<EstadoSite> = ({ printEm, cliqueLerEm, registros = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const printVisivel = printEm !== undefined && frame >= printEm;
  const printEntra = printEm !== undefined ? spring({ frame: frame - printEm, fps, config: { damping: 13 } }) : 0;
  const apertado = cliqueLerEm !== undefined && frame >= cliqueLerEm && frame < cliqueLerEm + 6;
  const carregando = cliqueLerEm !== undefined ? interpolate(frame, [cliqueLerEm + 2, cliqueLerEm + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  const camadaRegistro = <CamadaRegistros registros={registros} />;

  if (capturas.site) {
    return (
      <div style={{ position: "relative", width: 900, height: capturas.site.altura }}>
        <Img src={staticFile(capturas.site.arquivo)} style={{ width: 900, display: "block" }} />
        {camadaRegistro}
      </div>
    );
  }

  const a = SITE.areaAdicionarPrint;
  const b = SITE.botaoLerImagem;
  const g = SITE.graficoIlustrativo;

  return (
    <div style={{ position: "relative", width: 900, height: SITE.altura, background: "linear-gradient(180deg, #050b18, #030710)" }}>
      {/* topo com logo */}
      <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            border: `4px solid ${cores.neonAzul}`,
            boxShadow: `0 0 16px ${cores.neonAzul}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fontes.titulo,
            fontWeight: 900,
            fontSize: 28,
            color: "#fff",
          }}
        >
          VT
        </div>
        <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 38, color: "#fff", letterSpacing: 3 }}>
          DADOS <span style={{ color: cores.neonVerde, textShadow: brilho(cores.neonVerde, 0.4) }}>IA</span>
        </div>
      </div>
      <div style={{ position: "absolute", right: 40, top: 48, display: "flex", gap: 14 }}>
        <Esqueleto w={90} />
        <Esqueleto w={90} />
      </div>

      {/* conteúdo inicial (não descrito no roteiro: blocos neutros) */}
      <Cartao y={150} h={450}>
        <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 22 }}>
          <Esqueleto w="70%" h={34} />
          <Esqueleto w="90%" op={0.7} />
          <Esqueleto w="80%" op={0.7} />
          <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1, height: 170, borderRadius: 18, background: "#0f2140", border: `2px solid ${cores.painelBorda}` }} />
            ))}
          </div>
        </div>
      </Cartao>

      {/* Importar tabela por imagem */}
      <Cartao y={SITE.secaoImportar.y} h={SITE.secaoImportar.h} />
      <div style={{ position: "absolute", left: 60, top: SITE.secaoImportar.y + 34, fontFamily: fontes.texto, fontWeight: 800, fontSize: 40, color: "#fff" }}>
        Importar tabela por imagem
      </div>
      <div
        style={{
          position: "absolute",
          left: a.x,
          top: a.y,
          width: a.w,
          height: a.h,
          borderRadius: 20,
          border: `4px dashed ${printVisivel ? cores.neonVerde : "#33507d"}`,
          background: printVisivel ? "rgba(57,255,159,0.06)" : "rgba(20,40,80,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {printVisivel ? (
          <div style={{ transform: `scale(${printEntra})`, display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ border: `3px solid ${cores.neonVerde}`, borderRadius: 12, overflow: "hidden", boxShadow: `0 0 18px ${cores.neonVerde}88` }}>
              <RecorteGrafico largura={280} />
            </div>
            <IconeCheck tamanho={72} />
          </div>
        ) : (
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="#4b6c9e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.8" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: b.x,
          top: b.y,
          width: b.w,
          height: b.h,
          borderRadius: 20,
          background: `linear-gradient(90deg, ${cores.neonVerde}, ${cores.neonAzul})`,
          boxShadow: `0 0 ${apertado ? 40 : 18}px ${cores.neonVerde}aa`,
          transform: `scale(${apertado ? 0.96 : 1})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontes.texto,
          fontWeight: 900,
          fontSize: 34,
          color: "#00150b",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${carregando * 100}%`, background: "rgba(255,255,255,0.35)" }} />
        <span style={{ position: "relative" }}>Ler imagem e reconhecer resultados</span>
      </div>

      {/* registro de rodadas */}
      <Cartao y={SITE.areaRegistro.y - 100} h={SITE.areaRegistro.h + 130} />
      <div style={{ position: "absolute", left: 60, top: SITE.areaRegistro.y - 66 }}>
        <Esqueleto w={320} h={30} />
      </div>
      <div style={{ position: "absolute", left: SITE.areaRegistro.x, top: SITE.areaRegistro.y, borderRadius: 14, overflow: "hidden" }}>
        <GradeVazia />
      </div>
      {camadaRegistro}

      {/* gráfico ilustrativo */}
      <Cartao y={g.y - 90} h={g.h + 120} />
      <div style={{ position: "absolute", left: 60, top: g.y - 64, fontFamily: fontes.texto, fontWeight: 800, fontSize: 34, color: "#fff" }}>
        Gráfico ilustrativo
      </div>
      <div style={{ position: "absolute", left: g.x, top: g.y, borderRadius: 12, overflow: "hidden" }}>
        <GradeResultados largura={g.w} altura={g.h} colunas={13} linhas={6} quantidade={44} />
      </div>
    </div>
  );
};

const GradeVazia: React.FC = () => {
  const r = SITE.areaRegistro;
  const cw = r.w / REG_COLUNAS;
  const ch = r.h / REG_LINHAS;
  return (
    <svg width={r.w} height={r.h} style={{ display: "block", background: "#0a1730" }}>
      {Array.from({ length: REG_COLUNAS + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i * cw} y1={0} x2={i * cw} y2={r.h} stroke="#1f3560" strokeWidth={2} />
      ))}
      {Array.from({ length: REG_LINHAS + 1 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * ch} x2={r.w} y2={i * ch} stroke="#1f3560" strokeWidth={2} />
      ))}
    </svg>
  );
};

/** Centro da célula da rodada `i` na área de registro (coordenadas da página). */
export const posicaoRegistro = (i: number) => {
  const r = SITE.areaRegistro;
  const cw = r.w / REG_COLUNAS;
  const ch = r.h / REG_LINHAS;
  return { x: r.x + Math.floor(i / REG_LINHAS) * cw + cw / 2, y: r.y + (i % REG_LINHAS) * ch + ch / 2, raio: Math.min(cw, ch) * 0.36 };
};

const CamadaRegistros: React.FC<{ registros: number }> = ({ registros }) => (
  <>
    {RESULTADOS.slice(0, Math.ceil(registros)).map((res, i) => {
      const p = posicaoRegistro(i);
      const parcial = Math.min(1, registros - i);
      const s = parcial < 1 ? 1.4 - 0.4 * parcial : 1;
      const cor = corResultado(res);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x - p.raio,
            top: p.y - p.raio,
            width: p.raio * 2,
            height: p.raio * 2,
            borderRadius: "50%",
            background: cor,
            boxShadow: `0 0 ${parcial < 1 ? 26 : 10}px ${cor}`,
            transform: `scale(${s})`,
            opacity: Math.min(1, parcial * 2),
          }}
        />
      );
    })}
  </>
);

export const IconeCheck: React.FC<{ tamanho: number; cor?: string }> = ({ tamanho, cor = cores.neonVerde }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 10px ${cor})`, flexShrink: 0 }}>
    <circle cx="12" cy="12" r="11" fill={cor} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#00150b" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
