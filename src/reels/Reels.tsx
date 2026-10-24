import { AbsoluteFill, Easing, getStaticFiles, Html5Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CENAS, CORES, DURACAO, FPS, LEGENDAS, TEXTOS, VOLUME_TRILHA } from "./config";
import { Bolinha, CAVEAT, Celular, Dado, FundoReels, Grafico, Legenda, POPPINS, type Destaque, type Resultado } from "./componentes";

const s = (seg: number) => Math.round(seg * FPS);
const suave = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Cena com entrada (fade + zoom leve) e saída rápida. */
const Cena: React.FC<{ children: React.ReactNode; semSaida?: boolean }> = ({ children, semSaida }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const entra = interpolate(frame, [0, 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sai = semSaida ? 1 : interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], clamp);
  return <AbsoluteFill style={{ opacity: entra * sai, transform: `scale(${1.04 - 0.04 * entra})` }}>{children}</AbsoluteFill>;
};

/* 1 ─ gancho: gráfico se preenchendo rápido */
const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  return <Grafico x={36} y={500} celula={72} colunas={14} visiveis={interpolate(frame, [4, 78], [0, 84], clamp)} />;
};

/* 2 ─ dados: Jogador x Banca */
const LadoDados: React.FC<{ x: number; rotulo: string; cor: string; valores: [number, number]; inicio: number; para: number; semente: string; somaDe: number; venceu?: number }> = ({
  x,
  rotulo,
  cor,
  valores,
  inicio,
  para,
  semente,
  somaDe,
  venceu = 0,
}) => {
  const frame = useCurrentFrame();
  const soma = interpolate(frame, [somaDe, somaDe + 8], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x - 210, top: 380, width: 420, height: 520 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 36,
          border: `4px solid ${cor}`,
          background: `${cor}14`,
          opacity: 0.35 + 0.65 * venceu,
          boxShadow: venceu ? `0 0 ${50 * venceu}px ${cor}, inset 0 0 ${30 * venceu}px ${cor}55` : "none",
          transform: `scale(${1 + 0.04 * venceu})`,
        }}
      />
      <div style={{ position: "absolute", top: 34, width: "100%", textAlign: "center", fontFamily: POPPINS, fontWeight: 700, fontSize: 44, letterSpacing: 4, color: cor }}>{rotulo}</div>
      <div style={{ position: "absolute", top: 140, width: "100%", display: "flex", justifyContent: "center", gap: 26 }}>
        <Dado cor={cor} valor={valores[0]} inicio={inicio} para={para} tamanho={150} semente={`${semente}a`} />
        <Dado cor={cor} valor={valores[1]} inicio={inicio + 2} para={para + 4} tamanho={150} semente={`${semente}b`} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 360,
          width: "100%",
          textAlign: "center",
          fontFamily: POPPINS,
          fontWeight: 700,
          fontSize: 66,
          color: "#fff",
          opacity: soma,
          transform: `translateY(${(1 - soma) * 20}px)`,
        }}
      >
        {valores[0]} + {valores[1]} = <span style={{ color: cor }}>{valores[0] + valores[1]}</span>
      </div>
    </div>
  );
};

const Dados: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const segunda = frame >= 190;
  const venceu = !segunda ? interpolate(frame, [62, 74, 178, 188], [0, 1, 1, 0], clamp) : 0;
  const empate = spring({ frame: frame - 250, fps, config: { damping: 10 } });
  const base = segunda ? 195 : 9;
  return (
    <>
      <LadoDados
        x={290}
        rotulo="JOGADOR"
        cor={CORES.jogador}
        valores={segunda ? [2, 4] : [4, 5]}
        inicio={base}
        para={base + 38}
        semente={segunda ? "j2" : "j1"}
        somaDe={base + 46}
        venceu={venceu}
      />
      <LadoDados x={790} rotulo="BANCA" cor={CORES.banca} valores={segunda ? [5, 1] : [3, 3]} inicio={base} para={base + 40} semente={segunda ? "b2" : "b1"} somaDe={base + 48} />
      {frame >= 250 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              transform: `scale(${empate})`,
              padding: "18px 64px",
              borderRadius: 999,
              background: CORES.empate,
              boxShadow: `0 0 50px ${CORES.empate}`,
              fontFamily: POPPINS,
              fontWeight: 700,
              fontSize: 72,
              letterSpacing: 6,
              color: "#2a1d00",
            }}
          >
            {TEXTOS.empate}
          </div>
        </div>
      ) : null}
    </>
  );
};

/* 3 ─ gráfico coluna por coluna, com destaques de desenhos */
const DESTAQUES: Destaque[] = [
  { celulas: [0, 1, 2, 3, 4, 5].map((l) => [2, l] as [number, number]), rotulo: TEXTOS.rotulosPadroes.sequencia, de: 160, ate: 212 },
  {
    celulas: [0, 1, 2, 3, 4, 5].flatMap((l) => [[5, l] as [number, number], [6, l] as [number, number]]),
    rotulo: TEXTOS.rotulosPadroes.xadrez,
    de: 206,
    ate: 258,
  },
  { celulas: [0, 1, 2, 3, 4].map((k) => [8 + k, k] as [number, number]), rotulo: TEXTOS.rotulosPadroes.rampa, de: 252, ate: 300 },
];

const GraficoColunas: React.FC = () => {
  const frame = useCurrentFrame();
  return <Grafico x={36} y={540} celula={72} colunas={14} visiveis={interpolate(frame, [6, 228], [0, 84], clamp)} destaques={DESTAQUES} />;
};

/* 4 ─ caderno bagunçado */
const Rabisco: React.FC<{ d: string; de: number; cor?: string; largura?: number }> = ({ d, de, cor = "#3b3b8a", largura = 5 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [de, de + 14], [0, 1], clamp);
  return <path d={d} fill="none" stroke={cor} strokeWidth={largura} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
};

const LINHAS_CADERNO: { texto: string; de: number; rot: number; x: number }[] = [
  { texto: "B B J B E J ?", de: 6, rot: -2, x: 90 },
  { texto: "J J B J B B B", de: 26, rot: 1.5, x: 110 },
  { texto: "xadrez?? 3x B", de: 46, rot: -3, x: 80 },
  { texto: "B J B J ... J?", de: 66, rot: 2, x: 120 },
  { texto: "rampa ou não??", de: 86, rot: -1.5, x: 95 },
  { texto: "J B B E B J B", de: 106, rot: 2.5, x: 100 },
];

const Caderno: React.FC = () => {
  const frame = useCurrentFrame();
  const tremor = Math.sin(frame / 2.3) * 1.2;
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        top: 300,
        width: 800,
        height: 960,
        transform: `rotate(${-4 + tremor * 0.3}deg)`,
        borderRadius: 18,
        background: "#f6f1e3",
        boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 15 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 110 + i * 58, height: 2, background: "#b9cbe6" }} />
      ))}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 70, width: 3, background: "#e88a8a" }} />
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 22, top: 60 + i * 100, width: 26, height: 26, borderRadius: 13, background: CORES.fundoBase, opacity: 0.8 }} />
      ))}
      {LINHAS_CADERNO.map((l, i) => {
        const p = interpolate(frame, [l.de, l.de + 16], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: l.x,
              top: 128 + i * 116,
              fontFamily: CAVEAT,
              fontWeight: 700,
              fontSize: 72,
              color: i % 2 ? "#2b2b6e" : "#1d3f8a",
              transform: `rotate(${l.rot}deg)`,
              whiteSpace: "nowrap",
              clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
            }}
          >
            {l.texto}
          </div>
        );
      })}
      <svg width={800} height={960} style={{ position: "absolute", left: 0, top: 0 }}>
        <Rabisco d="M 90 205 L 520 175" de={40} cor="#c0392b" largura={7} />
        <Rabisco d="M 100 445 C 180 400, 260 490, 340 430 S 500 480, 560 420" de={80} cor="#c0392b" largura={6} />
        <Rabisco d="M 560 330 m -70 0 a 70 50 0 1 0 140 0 a 70 50 0 1 0 -140 0" de={60} cor="#d35400" largura={5} />
        <Rabisco d="M 600 560 L 700 640 M 700 560 L 600 640" de={100} cor="#c0392b" largura={8} />
        <Rabisco d="M 120 800 C 300 760, 420 860, 650 790" de={118} cor="#2b2b6e" largura={5} />
        <Rabisco d="M 640 780 l -26 -8 m 26 8 l -12 22" de={126} cor="#2b2b6e" largura={5} />
      </svg>
    </div>
  );
};

/* 5 ─ logo + celular enviando o print */
const IconeUpload: React.FC<{ tamanho: number; cor: string; pulo: number }> = ({ tamanho, cor, pulo }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <g transform={`translate(0 ${-pulo})`}>
      <path d="M12 15V4" />
      <path d="M7.5 8.5L12 4l4.5 4.5" />
    </g>
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);

const Check: React.FC<{ tamanho: number }> = ({ tamanho }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill={CORES.verde} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Envio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 12 } });
  const brilhoLogo = 0.6 + 0.4 * Math.sin(frame / 8);
  const celular = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const voo = interpolate(frame, [64, 104], [0, 1], suave);
  const progresso = interpolate(frame, [110, 196], [0, 1], suave);
  const ok = spring({ frame: frame - 200, fps, config: { damping: 9 } });
  return (
    <>
      <Img
        src={staticFile("logo-vtdados.png")}
        style={{
          position: "absolute",
          left: 540 - 150,
          top: 160,
          width: 300,
          transform: `scale(${logo})`,
          filter: `drop-shadow(0 0 ${20 * brilhoLogo}px ${CORES.roxo}) drop-shadow(0 0 ${44 * brilhoLogo}px ${CORES.roxo}aa)`,
        }}
      />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - celular) * 500}px)`, opacity: celular }}>
        <Celular x={290} y={540} w={500} h={760}>
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: 150,
              height: 300,
              borderRadius: 28,
              border: `4px dashed ${progresso > 0 ? CORES.roxo : "#4a4380"}`,
              background: "rgba(139,64,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {frame < 104 ? <IconeUpload tamanho={110} cor="#b9a4ff" pulo={Math.abs(Math.sin(frame / 6)) * 2} /> : null}
          </div>
          {/* print do gráfico (real) entrando no envio */}
          <div
            style={{
              position: "absolute",
              left: 50,
              top: interpolate(voo, [0, 1], [740, 230]),
              width: 372,
              transform: `rotate(${(1 - voo) * 8}deg)`,
              border: "5px solid #fff",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 18px 40px rgba(0,0,0,0.6)",
            }}
          >
            <Img src={staticFile("capturas/bacbo-grafico.png")} style={{ width: "100%", display: "block" }} />
          </div>
          {frame >= 104 ? (
            <div style={{ position: "absolute", left: 60, right: 60, top: 500, height: 18, borderRadius: 9, background: "#221d48", overflow: "hidden" }}>
              <div style={{ width: `${progresso * 100}%`, height: "100%", background: `linear-gradient(90deg, ${CORES.roxo}, ${CORES.jogador})` }} />
            </div>
          ) : null}
          {frame >= 104 && frame < 200 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
              <IconeUpload tamanho={70} cor={CORES.roxo} pulo={Math.abs(Math.sin(frame / 5)) * 3} />
            </div>
          ) : null}
          {frame >= 200 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 550, display: "flex", justifyContent: "center", transform: `scale(${ok})` }}>
              <Check tamanho={90} />
            </div>
          ) : null}
        </Celular>
      </div>
    </>
  );
};

/* 6 e 7 ─ leitura coluna por coluna, painel e atualização */
const RECENTES: Resultado[] = ["B", "J", "J", "B", "E", "J", "B", "J", "B", "B"];

const Painel: React.FC<{ atualiza: number; novaBolinha: number }> = ({ atualiza, novaBolinha }) => {
  const rodadas = Math.round(interpolate(atualiza, [0, 1], [TEXTOS.padroes.rodadasAntes, TEXTOS.padroes.rodadasDepois]));
  const cores = [CORES.jogador, CORES.banca, CORES.empate];
  return (
    <div style={{ position: "absolute", inset: 0, padding: "84px 30px 30px", boxSizing: "border-box" }}>
      {/* últimas rodadas */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", height: 64, alignItems: "center", overflow: "hidden" }}>
        {RECENTES.map((r, i) => (
          <Bolinha key={i} r={r} tamanho={54} />
        ))}
        {novaBolinha > 0 ? (
          <div style={{ width: 54 * novaBolinha, overflow: "visible" }}>
            <Bolinha r="B" tamanho={54} escala={novaBolinha} brilho={1 - novaBolinha * 0.5} />
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
        {TEXTOS.cartoes.map((c, i) => {
          const v = interpolate(atualiza, [0, 1], [c.antes, c.depois]);
          return (
            <div key={c.rotulo} style={{ flex: 1, borderRadius: 24, border: `2px solid ${cores[i]}55`, background: "rgba(255,255,255,0.04)", padding: "22px 0 20px", textAlign: "center" }}>
              <div style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: cores[i] }}>{c.rotulo}</div>
              <div style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 64, color: cores[i], lineHeight: 1.2 }}>{Math.round(v)}%</div>
              <div style={{ margin: "8px auto 0", width: "80%", height: 12, borderRadius: 6, background: "#1c1a3a", overflow: "hidden" }}>
                <div style={{ width: `${v}%`, height: "100%", background: cores[i], borderRadius: 6 }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 44, fontFamily: POPPINS, fontWeight: 700, fontSize: 40, color: "#fff" }}>{TEXTOS.padroesTitulo}</div>
      {[
        { texto: TEXTOS.padroes.historico, cor: CORES.roxo },
        { texto: `Rodadas lidas: ${rodadas}`, cor: CORES.verde },
        {
          texto: atualiza < 0.5 ? TEXTOS.padroes.sequenciaAntes : TEXTOS.padroes.sequenciaDepois,
          cor: CORES.banca,
          op: atualiza > 0 && atualiza < 1 ? Math.abs(atualiza - 0.5) * 2 : 1,
        },
      ].map((linha, i) => (
        <div
          key={i}
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "22px 26px",
            borderRadius: 20,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: POPPINS,
            fontWeight: 500,
            fontSize: 32,
            color: "#e8e4ff",
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 8, background: linha.cor, boxShadow: `0 0 12px ${linha.cor}` }} />
          <span style={{ opacity: linha.op ?? 1 }}>{linha.texto}</span>
        </div>
      ))}
      {/* brilho de atualização */}
      {atualiza > 0 && atualiza < 1 ? (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent ${atualiza * 100 - 10}%, ${CORES.roxo}22 ${atualiza * 100}%, transparent ${atualiza * 100 + 10}%)` }} />
      ) : null}
    </div>
  );
};

const LeituraPainel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame, fps, config: { damping: 14 } });
  const numeros = Math.floor(interpolate(frame, [10, 124], [0, 84], clamp));
  const troca = interpolate(frame, [130, 144], [0, 1], suave);
  // cena 7 começa em 50s (10s depois do início desta sequência)
  const nova = interpolate(frame, [s(10) + 24, s(10) + 40], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const atualiza = interpolate(frame, [s(10) + 40, s(10) + 80], [0, 1], suave);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${0.9 + 0.1 * entra})`, opacity: entra }}>
      <Celular x={130} y={190} w={820} h={1100}>
        {troca < 1 ? (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - troca }}>
            <Grafico x={22} y={330} celula={52} colunas={14} visiveis={84} numeros={numeros} fundo="rgba(255,255,255,0.06)" />
          </div>
        ) : null}
        {troca > 0 ? (
          <div style={{ position: "absolute", inset: 0, opacity: troca, transform: `translateY(${(1 - troca) * 40}px)` }}>
            <Painel atualiza={atualiza} novaBolinha={nova} />
          </div>
        ) : null}
      </Celular>
    </div>
  );
};

/* 8 ─ final */
const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 12 } });
  const pulso = 1 + 0.05 * Math.sin(frame / 5);
  return (
    <>
      <Img
        src={staticFile("logo-vtdados.png")}
        style={{
          position: "absolute",
          left: 540 - 250,
          top: 200,
          width: 500,
          transform: `scale(${logo})`,
          filter: `drop-shadow(0 0 24px ${CORES.roxo}) drop-shadow(0 0 60px ${CORES.roxo}88)`,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${pulso})`,
            padding: "30px 90px",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${CORES.roxo}, #6a2ae0)`,
            boxShadow: `0 0 ${40 + 30 * (pulso - 1) * 20}px ${CORES.roxo}`,
            fontFamily: POPPINS,
            fontWeight: 700,
            fontSize: 64,
            color: "#fff",
          }}
        >
          {TEXTOS.botao}
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1080, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <div style={{ flexShrink: 0, border: "4px solid #fff", borderRadius: 14, padding: "4px 14px", fontFamily: POPPINS, fontWeight: 700, fontSize: 42, color: "#fff" }}>+18</div>
        <div style={{ fontFamily: POPPINS, fontWeight: 500, fontSize: 34, lineHeight: 1.3, color: "#fff" }}>{TEXTOS.aviso}</div>
      </div>
    </>
  );
};

const ORDEM: { de: number; ate: number; cena: React.FC; semSaida?: boolean }[] = [
  { de: CENAS.gancho, ate: CENAS.dados, cena: Gancho },
  { de: CENAS.dados, ate: CENAS.grafico, cena: Dados },
  { de: CENAS.grafico, ate: CENAS.caderno, cena: GraficoColunas },
  { de: CENAS.caderno, ate: CENAS.envio, cena: Caderno },
  { de: CENAS.envio, ate: CENAS.leitura, cena: Envio },
  { de: CENAS.leitura, ate: CENAS.final, cena: LeituraPainel },
  { de: CENAS.final, ate: 60, cena: Final, semSaida: true },
];

export const Reels: React.FC = () => {
  const temTrilha = getStaticFiles().some((f) => f.name === "trilha.mp3");
  return (
    <AbsoluteFill style={{ backgroundColor: CORES.fundoTopo, fontFamily: POPPINS }}>
      <FundoReels />
      {ORDEM.map(({ de, ate, cena: C, semSaida }) => (
        <Sequence key={de} from={s(de)} durationInFrames={s(ate - de)}>
          <Cena semSaida={semSaida}>
            <C />
          </Cena>
        </Sequence>
      ))}
      {LEGENDAS.map((l) => (
        <Sequence key={l.de} from={s(l.de)} durationInFrames={s(l.ate - l.de)} layout="none">
          <Legenda texto={l.texto} duracao={s(l.ate - l.de)} />
        </Sequence>
      ))}
      {temTrilha ? (
        <Html5Audio
          src={staticFile("trilha.mp3")}
          volume={(f) => VOLUME_TRILHA * interpolate(f, [0, 15, DURACAO - 60, DURACAO], [0, 1, 1, 0], clamp)}
        />
      ) : null}
    </AbsoluteFill>
  );
};
