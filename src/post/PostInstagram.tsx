import { AbsoluteFill, Img, staticFile } from "remotion";
import { capturas } from "../capturas";
import { RecorteGrafico } from "../telas/BacBo";
import { PaginaSite, ROLAGEM, RODADAS_REGISTRO } from "../telas/Site";
import { cores, fontes } from "../tema";

/** Post de divulgação para o feed do Instagram (1080x1350). */

const TELA_W = 410;
const TELA_H = 880;
const ESCALA = TELA_W / 900;

const Celular: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 618,
      top: 236,
      width: TELA_W + 24,
      height: TELA_H + 24,
      borderRadius: 54,
      background: "#0d0b1c",
      border: "2px solid #2d2650",
      boxShadow: "0 40px 90px rgba(0,0,0,0.65), 0 0 60px rgba(139,92,246,0.25)",
      padding: 12,
      boxSizing: "border-box",
      transform: "rotate(3deg)",
    }}
  >
    <div style={{ position: "relative", width: TELA_W, height: TELA_H, borderRadius: 42, overflow: "hidden", background: "#040a1a" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 900, transform: `scale(${ESCALA}) translateY(${-ROLAGEM.sinal + 10}px)`, transformOrigin: "0 0" }}>
        <PaginaSite importado rodadas={RODADAS_REGISTRO} sinal={{ detectadoEm: -90 }} />
      </div>
      {/* entalhe da câmera */}
      <div style={{ position: "absolute", top: 12, left: "50%", width: 110, height: 28, marginLeft: -55, borderRadius: 14, background: "#000" }} />
    </div>
  </div>
);

const Item: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: fontes.texto, fontWeight: 600, fontSize: 29, color: "#dcd6f5" }}>
    <svg width="30" height="30" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="rgba(139,92,246,0.22)" stroke={cores.roxo} strokeWidth="1.5" />
      <path d="M7 12.5l3.2 3.2L17 9" stroke="#c4a5ff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>{children}</span>
  </div>
);

export const PostInstagram: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 85% 35%, rgba(109,40,217,0.45) 0%, transparent 55%),
        radial-gradient(ellipse at 0% 100%, rgba(43,107,255,0.22) 0%, transparent 50%),
        linear-gradient(160deg, #0f0a24 0%, #08061a 60%, #050414 100%)`,
      overflow: "hidden",
    }}
  >
    {/* textura sutil de grade, só no fundo */}
    <AbsoluteFill
      style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "54px 54px",
        maskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
      }}
    />

    {capturas.logo ? <Img src={staticFile(capturas.logo)} style={{ position: "absolute", left: 50, top: 46, height: 170 }} /> : null}

    <Celular />

    {/* print do gráfico "entrando" no site */}
    <div
      style={{
        position: "absolute",
        left: 590,
        top: 1050,
        transform: "rotate(-5deg)",
        border: "6px solid #fff",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 24px 50px rgba(0,0,0,0.6)",
      }}
    >
      <RecorteGrafico largura={360} />
    </div>

    <div style={{ position: "absolute", left: 64, top: 262, width: 560 }}>
      <div style={{ fontFamily: fontes.texto, fontWeight: 600, fontSize: 24, letterSpacing: 4, color: "#a995e8" }}>ANÁLISE DE PADRÕES · BAC BO</div>
      <div style={{ marginTop: 18, fontFamily: fontes.texto, fontWeight: 900, fontSize: 74, lineHeight: 1.06, color: "#fff", letterSpacing: -1 }}>
        Leia o histórico do Bac Bo <span style={{ color: "#b794ff" }}>em segundos.</span>
      </div>
      <div style={{ marginTop: 26, fontFamily: fontes.texto, fontWeight: 600, fontSize: 30, lineHeight: 1.4, color: "#b9b2d6" }}>
        Mande o print do gráfico e a IA organiza as rodadas e mostra os padrões que já se repetiram.
      </div>
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 20 }}>
        <Item>Importa o print do gráfico</Item>
        <Item>Registro rápido das rodadas</Item>
        <Item>Padrões com base no histórico</Item>
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        left: 64,
        top: 1118,
        padding: "20px 38px",
        borderRadius: 999,
        background: `linear-gradient(90deg, ${cores.roxo}, ${cores.roxoForte})`,
        boxShadow: "0 12px 30px rgba(109,40,217,0.45)",
        fontFamily: fontes.texto,
        fontWeight: 900,
        fontSize: 32,
        color: "#fff",
      }}
    >
      Acesse pelo link na bio
    </div>

    <div
      style={{
        position: "absolute",
        left: 64,
        right: 64,
        bottom: 34,
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: fontes.texto,
        fontWeight: 600,
        fontSize: 19,
        color: "#8a84a8",
      }}
    >
      <span style={{ border: "2px solid #8a84a8", borderRadius: 8, padding: "1px 8px", fontWeight: 900 }}>+18</span>
      Análise de resultados passados, não é garantia de ganho. Jogue com responsabilidade.
    </div>
  </AbsoluteFill>
);
