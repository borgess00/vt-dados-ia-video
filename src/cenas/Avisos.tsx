import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { IconeAlerta } from "../componentes/Textos";
import { Som } from "../componentes/Som";
import { useLayout } from "../componentes/layout";
import { brilho, cores, fontes } from "../tema";

/** Aviso logo após a abertura. */
export const AvisoInicial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { escala, vertical } = useLayout();
  const entra = spring({ frame: frame - 3, fps, config: { damping: 13 } });
  const destaque = spring({ frame: frame - 26, fps, config: { damping: 8, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 60 * escala }}>
      <Som nome="pop" em={3} />
      <div
        style={{
          transform: `scale(${0.8 + 0.2 * entra})`,
          opacity: entra,
          maxWidth: vertical ? 960 * escala : 1500 * escala,
          padding: `${56 * escala}px ${60 * escala}px`,
          borderRadius: 36 * escala,
          background: "rgba(5,16,36,0.92)",
          border: `${5 * escala}px solid ${cores.neonAzul}`,
          boxShadow: `0 0 ${40 * escala}px ${cores.neonAzul}77`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34 * escala,
        }}
      >
        <div
          style={{
            width: 120 * escala,
            height: 120 * escala,
            borderRadius: "50%",
            border: `${7 * escala}px solid ${cores.neonAzul}`,
            boxShadow: brilho(cores.neonAzul, 0.5 * escala),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fontes.titulo,
            fontWeight: 900,
            fontSize: 74 * escala,
            color: cores.neonAzul,
          }}
        >
          i
        </div>
        <div
          style={{
            fontFamily: fontes.texto,
            fontWeight: 800,
            fontSize: (vertical ? 66 : 64) * escala,
            lineHeight: 1.25,
            color: "#fff",
            textAlign: "center",
          }}
        >
          Este passo a passo é feito{" "}
          <span
            style={{
              display: "inline-block",
              color: cores.neonVerde,
              fontWeight: 900,
              textShadow: brilho(cores.neonVerde, 0.5 * escala),
              transform: `scale(${1 + 0.25 * (1 - destaque)})`,
            }}
          >
            DEPOIS
          </span>{" "}
          do pagamento, com a IA <span style={{ color: cores.neonVerde, fontWeight: 900 }}>já paga.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * AVISO FINAL OBRIGATÓRIO: tela inteira, texto grande, pulsando, legível do início ao fim.
 * Nenhum efeito cobre ou acelera o texto.
 */
export const AvisoFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const { escala, vertical } = useLayout();
  const aparece = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const pulso = (Math.sin((frame / 30) * Math.PI * 1.6) + 1) / 2; // ~0.8 pulsos/s
  const fonte = (vertical ? 70 : 62) * escala;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, #2a0505 0%, #0b0101 70%, #000 100%)`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Som nome="impacto" em={0} volume={0.45} />
      {/* moldura pulsante */}
      <div
        style={{
          position: "absolute",
          inset: 26 * escala,
          borderRadius: 30 * escala,
          border: `${8 * escala}px solid ${cores.vermelho}`,
          boxShadow: `0 0 ${(20 + 30 * pulso) * escala}px ${cores.vermelho}, inset 0 0 ${(20 + 30 * pulso) * escala}px ${cores.vermelho}88`,
          opacity: 0.7 + 0.3 * pulso,
        }}
      />
      <div
        style={{
          opacity: aparece,
          transform: `scale(${1 + 0.02 * pulso})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30 * escala,
          padding: `0 ${(vertical ? 80 : 160) * escala}px`,
          textAlign: "center",
        }}
      >
        <IconeAlerta tamanho={(vertical ? 200 : 150) * escala} cor={cores.amarelo} />
        <div
          style={{
            fontFamily: fontes.texto,
            fontWeight: 900,
            fontSize: fonte * 1.25,
            color: cores.amarelo,
            letterSpacing: 3,
            textShadow: `0 0 ${(10 + 18 * pulso) * escala}px ${cores.amarelo}`,
          }}
        >
          LEMBRE-SE:
        </div>
        <div
          style={{
            fontFamily: fontes.texto,
            fontWeight: 900,
            fontSize: fonte,
            lineHeight: 1.22,
            color: cores.amarelo,
            textShadow: `0 ${4 * escala}px 0 #000, 0 0 ${16 * escala}px rgba(255,212,0,0.45)`,
          }}
        >
          ISSO SÃO APENAS PREVISÕES E ANÁLISE DE PADRÕES QUE JÁ OCORRERAM.
        </div>
        <div
          style={{
            fontFamily: fontes.texto,
            fontWeight: 900,
            fontSize: fonte,
            lineHeight: 1.22,
            color: "#ff4a4a",
            WebkitTextStroke: `${2 * escala}px #000`,
            paintOrder: "stroke fill",
            textShadow: `0 0 ${(12 + 22 * pulso) * escala}px rgba(255,40,40,0.9)`,
          }}
        >
          AJA COM SABEDORIA E NÃO GASTE DINHEIRO QUE NÃO PODE PERDER.
        </div>
      </div>
    </AbsoluteFill>
  );
};
