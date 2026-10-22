import { useCurrentFrame } from "remotion";
import { mostrarSeloIlustrativo } from "../capturas";
import { brilho, cores, fontes } from "../tema";
import { TELA_H, TELA_W, useLayout } from "./layout";

const BARRA = 64;

/**
 * Moldura de dispositivo com a "tela" (900x1100 interno). `rolagem` desloca o conteúdo
 * (útil para páginas longas). `fixo` fica por cima, sem rolar.
 */
export const Tela: React.FC<{
  children: React.ReactNode;
  rolagem?: number;
  endereco?: string;
  fixo?: React.ReactNode;
  corBorda?: string;
  /** mostra a etiqueta "TELA ILUSTRATIVA" */
  selo?: boolean;
}> = ({ children, rolagem = 0, endereco, fixo, corBorda = cores.neonAzul, selo }) => {
  const { tela } = useLayout();
  const frame = useCurrentFrame();
  const escala = tela.w / TELA_W;
  const alturaConteudo = endereco ? TELA_H - BARRA : TELA_H;

  return (
    <div
      style={{
        position: "absolute",
        left: tela.x,
        top: tela.y,
        width: tela.w,
        height: tela.h,
        borderRadius: 34 * escala,
        border: `${4 * escala}px solid ${corBorda}`,
        boxShadow: `0 0 ${30 * escala}px ${corBorda}66, 0 ${30 * escala}px ${80 * escala}px rgba(0,0,0,0.7)`,
        overflow: "hidden",
        background: "#000",
      }}
    >
      <div style={{ position: "absolute", width: TELA_W, height: TELA_H, transform: `scale(${escala})`, transformOrigin: "0 0" }}>
        {endereco ? (
          <div
            style={{
              height: BARRA,
              background: "#0d1526",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 22px",
              borderBottom: `1px solid ${cores.painelBorda}`,
            }}
          >
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
            ))}
            <div
              style={{
                flex: 1,
                marginLeft: 12,
                height: 38,
                borderRadius: 19,
                background: "#050a14",
                color: cores.textoSuave,
                fontFamily: fontes.texto,
                fontWeight: 600,
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                padding: "0 20px",
              }}
            >
              <svg width="18" height="20" viewBox="0 0 18 20" style={{ marginRight: 10 }}>
                <rect x="1" y="8" width="16" height="11" rx="2" fill={cores.neonVerde} />
                <path d="M4.5 8V5.5a4.5 4.5 0 0 1 9 0V8" stroke={cores.neonVerde} strokeWidth="2.4" fill="none" />
              </svg>
              {endereco}
            </div>
          </div>
        ) : null}
        <div style={{ position: "relative", height: alturaConteudo, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: TELA_W, transform: `translateY(${-rolagem}px)` }}>
            {children}
          </div>
          {fixo}
        </div>
        {selo && mostrarSeloIlustrativo ? (
          <div
            style={{
              position: "absolute",
              right: 18,
              top: endereco ? BARRA + 14 : 14,
              padding: "6px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.75)",
              fontFamily: fontes.texto,
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: 2,
            }}
          >
            TELA ILUSTRATIVA
          </div>
        ) : null}
      </div>
      {/* reflexo de vidro */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${115 + Math.sin(frame / 40) * 4}deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 ${24 * escala}px ${corBorda}33`, pointerEvents: "none" }} />
    </div>
  );
};

export const AlturaBarra = BARRA;
export const textoNeon = (cor: string) => ({ color: cor, textShadow: brilho(cor, 0.6) });
