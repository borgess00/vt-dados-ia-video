import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { CaixaBrilho, CirculoAnimado, CursorClique, SetaAnimada } from "../componentes/Destaques";
import { Instrucao, PassoBadge } from "../componentes/Textos";
import { Som } from "../componentes/Som";
import { Tela } from "../componentes/Tela";
import { TELA_H } from "../componentes/layout";
import { GRAFICO_BACBO, RecorteGrafico, TelaBacBo } from "../telas/BacBo";
import { ALTURA_HIPOTESE, ENDERECO_SITE, IconeCheck, PaginaSite, RODADAS_REGISTRO, ROLAGEM, SITE } from "../telas/Site";
import { cenaPorId, fimFrase, marca } from "../tempo";
import { cores, fontes } from "../tema";

const centro = (r: { x: number; y: number; w: number; h: number }) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
const suave = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;

/* ───────────────────────── PASSO 1 – Print do gráfico ───────────────────────── */
export const Passo1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const C = "passo-1";
  const m1 = marca(C, "p1-1");
  const m2 = marca(C, "p1-2");
  const flash = fimFrase(C, "p1-1") - 6;
  const salvo = m2 + 26;

  const voo = interpolate(frame, [flash + 4, flash + 22], [0, 1], suave);
  const g = GRAFICO_BACBO;
  const destinoW = 520;
  const cardX = g.x + (450 - destinoW / 2 - g.x) * voo;
  const cardY = g.y + (300 - g.y) * voo;
  const cardW = g.w + (destinoW - g.w) * voo;
  const seta = spring({ frame: frame - m2, fps, config: { damping: 10 } });
  const check = spring({ frame: frame - salvo, fps, config: { damping: 9, stiffness: 180 } });

  return (
    <AbsoluteFill>
      <Som nome="clique" em={flash} volume={0.6} />
      <Som nome="whoosh" em={flash + 2} volume={0.25} />
      <Som nome="whoosh" em={m2 + 2} volume={0.2} />
      <Som nome="pop" em={salvo} volume={0.4} />
      <Tela
        corBorda={cores.neonAzul}
        selo
        fixo={
          <>
            {/* cantos de "captura" antes do print */}
            {frame > m1 + 40 && frame < flash ? <CantosCaptura r={g} /> : null}
            {/* flash da captura */}
            {frame >= flash && frame < flash + 8 ? (
              <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [flash, flash + 8], [0.95, 0]) }} />
            ) : null}
            {frame >= flash ? (
              <>
                <AbsoluteFill style={{ background: "rgba(0,0,0,0.6)", opacity: voo }} />
                <div
                  style={{
                    position: "absolute",
                    left: cardX,
                    top: cardY,
                    transform: `rotate(${-3 * voo}deg)`,
                    border: `6px solid #fff`,
                    borderRadius: 16,
                    boxShadow: `0 0 40px ${cores.neonAzul}, 0 20px 60px rgba(0,0,0,0.8)`,
                    overflow: "hidden",
                  }}
                >
                  <RecorteGrafico largura={cardW} />
                </div>
                {/* salvar a print */}
                {frame >= m2 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 450,
                      top: 300 + (g.h * destinoW) / g.w + 70,
                      transform: `translate(-50%, 0) scale(${seta})`,
                      display: "flex",
                      alignItems: "center",
                      gap: 22,
                    }}
                  >
                    <IconeSalvar tamanho={130} progresso={interpolate(frame, [m2, salvo], [0, 1], suave)} />
                    {frame >= salvo ? (
                      <div style={{ transform: `scale(${check})` }}>
                        <IconeCheck tamanho={110} />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : null}
          </>
        }
      >
        <TelaBacBo />
        <CirculoAnimado r={g} inicio={m1 + 18} fim={flash} />
      </Tela>
      <PassoBadge numero={1} />
      <Instrucao
        itens={[
          { de: m1, texto: "Tire um print do gráfico no canto inferior esquerdo" },
          { de: m2, texto: "Salve a print" },
        ]}
      />
    </AbsoluteFill>
  );
};

const CantosCaptura: React.FC<{ r: { x: number; y: number; w: number; h: number } }> = ({ r }) => {
  const frame = useCurrentFrame();
  const m = 18 + Math.sin(frame / 3) * 4;
  const L = 60;
  const estilo = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: L,
    height: L,
    borderColor: "#fff",
    borderStyle: "solid",
    borderWidth: 0,
    filter: `drop-shadow(0 0 8px ${cores.neonAzul})`,
    ...pos,
  });
  return (
    <>
      <div style={estilo({ left: r.x - m, top: r.y - m, borderTopWidth: 8, borderLeftWidth: 8 })} />
      <div style={estilo({ left: r.x + r.w + m - L, top: r.y - m, borderTopWidth: 8, borderRightWidth: 8 })} />
      <div style={estilo({ left: r.x - m, top: r.y + r.h + m - L, borderBottomWidth: 8, borderLeftWidth: 8 })} />
      <div style={estilo({ left: r.x + r.w + m - L, top: r.y + r.h + m - L, borderBottomWidth: 8, borderRightWidth: 8 })} />
    </>
  );
};

const IconeSalvar: React.FC<{ tamanho: number; progresso: number }> = ({ tamanho, progresso }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 14px ${cores.neonAzul})` }}>
    <circle cx="50" cy="50" r="46" fill="#06142b" stroke={cores.neonAzul} strokeWidth="6" />
    <circle
      cx="50"
      cy="50"
      r="46"
      fill="none"
      stroke={cores.neonVerde}
      strokeWidth="6"
      strokeDasharray={289}
      strokeDashoffset={289 * (1 - progresso)}
      transform="rotate(-90 50 50)"
    />
    <g transform={`translate(0 ${Math.sin(progresso * Math.PI * 3) * 4})`}>
      <path d="M50 24 V60 M34 46 L50 62 L66 46" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <path d="M30 72 H70" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

/* ───────────────────────── PASSO 2 – Voltar para o site ───────────────────────── */
export const Passo2: React.FC = () => {
  const C = "passo-2";
  const m1 = marca(C, "p2-1");
  return (
    <AbsoluteFill>
      <Tela endereco={ENDERECO_SITE} corBorda={cores.neonVerde}>
        <PaginaSite />
        <CaixaBrilho r={SITE.titulo} inicio={m1 + 6} cor={cores.neonVerde} />
      </Tela>
      <PassoBadge numero={2} />
      <Instrucao itens={[{ de: m1, texto: "Volte para o site da IA" }]} />
    </AbsoluteFill>
  );
};

/* ─────────────────────── PASSO 3 – Importar tabela por imagem ─────────────────────── */
export const Passo3: React.FC = () => {
  const frame = useCurrentFrame();
  const C = "passo-3";
  const m1 = marca(C, "p3-1");
  const m2 = marca(C, "p3-2");
  const m3 = marca(C, "p3-3");
  const cliqueArquivo = m2 + 12;
  const printEm = m2 + 26;
  const cliqueBotao = m3 + 50;

  const rolagem =
    frame < cliqueBotao
      ? interpolate(frame, [m1 + 8, m1 + 44], [ROLAGEM.topo, ROLAGEM.importar], suave)
      : interpolate(frame, [cliqueBotao + 32, cliqueBotao + 62], [ROLAGEM.importar, ROLAGEM.importarResultado], suave);
  const arq = SITE.escolherArquivo;
  const botaoArquivo = { x: arq.x + 125, y: centro(arq).y };
  const b = SITE.botaoLerImagem;

  // print "voando" de baixo da tela até o campo de arquivo
  const voo = interpolate(frame, [cliqueArquivo + 2, printEm], [0, 1], suave);
  const destino = { x: centro(arq).x - 40, y: arq.y - rolagem - 10 };
  const origem = { x: 520, y: TELA_H + 40 };

  return (
    <AbsoluteFill>
      <Som nome="whoosh" em={m1 + 8} volume={0.2} />
      <Som nome="clique" em={cliqueArquivo} />
      <Som nome="pop" em={printEm} volume={0.4} />
      <Som nome="clique" em={cliqueBotao} volume={0.55} />
      <Som nome="pop" em={cliqueBotao + 18} volume={0.35} />
      <Som nome="whoosh" em={cliqueBotao + 32} volume={0.15} />
      <Tela
        endereco={ENDERECO_SITE}
        corBorda={cores.neonVerde}
        rolagem={rolagem}
        fixo={
          frame > cliqueArquivo && frame < printEm ? (
            <div
              style={{
                position: "absolute",
                left: origem.x + (destino.x - origem.x) * voo,
                top: origem.y + (destino.y - origem.y) * voo,
                transform: `rotate(${(1 - voo) * 12}deg) scale(${1 - 0.6 * voo})`,
                transformOrigin: "0 0",
                border: "4px solid #fff",
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: `0 0 30px ${cores.neonAzul}`,
              }}
            >
              <RecorteGrafico largura={420} />
            </div>
          ) : null
        }
      >
        <PaginaSite printEm={printEm} cliqueLerEm={cliqueBotao} />
        <CaixaBrilho r={SITE.secaoImportar} inicio={m1 + 44} fim={m2} />
        <CaixaBrilho r={arq} inicio={m2} fim={m3} cor={cores.neonAzul} />
        <CursorClique de={{ x: 700, y: ROLAGEM.importar + 900 }} para={botaoArquivo} inicio={m2} clique={cliqueArquivo} fim={m3 + 12} />
        <SetaAnimada x={centro(b).x} y={b.y - 16} inicio={m3} fim={cliqueBotao + 20} />
        <CaixaBrilho r={b} inicio={m3 + 4} fim={cliqueBotao + 24} cor={cores.neonVerde} />
        <CursorClique de={{ x: botaoArquivo.x + 40, y: botaoArquivo.y + 30 }} para={{ x: centro(b).x + 190, y: centro(b).y + 10 }} inicio={m3 + 12} clique={cliqueBotao} fim={cliqueBotao + 30} />
      </Tela>
      <PassoBadge numero={3} />
      <Instrucao
        itens={[
          { de: m2, texto: "Adicione a print" },
          { de: m3, texto: "Clique em ‘Ler imagem e reconhecer resultados’" },
        ]}
      />
    </AbsoluteFill>
  );
};

/* ───────────────────────── PASSO 4 – Registrar as rodadas ───────────────────────── */
const CICLO = 18; // frames por rodada registrada

export const Passo4: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const C = "passo-4";
  const m1 = marca(C, "p4-1");
  const m2 = marca(C, "p4-2");
  const m3 = marca(C, "p4-3");
  const troca = m1 + 40;
  const inicioRegistro = troca + 14;

  const slide = interpolate(frame, [troca, troca + 12], [0, 1], suave);
  const rolagem = interpolate(frame, [m3 + 2, m3 + 32], [ROLAGEM.registro, ROLAGEM.grafico], suave);

  // cada rodada: digita o total (0-6), toca no botão da cor (9), a ficha aparece e o campo limpa (12)
  const k = Math.floor((frame - inicioRegistro) / CICLO);
  const t = (frame - inicioRegistro) % CICLO;
  const emAndamento = frame >= inicioRegistro && k < RODADAS_REGISTRO.length;
  const atual = emAndamento ? RODADAS_REGISTRO[k] : null;
  const registradas = frame < inicioRegistro ? 0 : Math.min(RODADAS_REGISTRO.length, k + (t >= 10 ? 1 : 0));
  const texto = atual ? String(atual.n) : "";
  const digitando = atual && t < 12 ? texto.slice(0, t < 3 ? 1 : texto.length) : "";
  const tocando = atual && t >= 9 && t < 14 ? atual.r : null;
  const botao = (r: string) => (r === "J" ? SITE.botaoJogador : r === "B" ? SITE.botaoBanca : SITE.botaoEmpate);
  const areaRegistro = { x: SITE.campoTotal.x, y: SITE.campoTotal.y, w: SITE.campoTotal.w, h: SITE.botaoEmpate.y + SITE.botaoEmpate.h - SITE.campoTotal.y };

  return (
    <AbsoluteFill>
      <Som nome="whoosh" em={troca - 2} volume={0.3} />
      {RODADAS_REGISTRO.map((_, i) => (
        <Som key={i} nome="clique" em={inicioRegistro + i * CICLO + 9} volume={0.3} />
      ))}
      <Som nome="glitch" em={m2} volume={0.18} />
      <Som nome="whoosh" em={m3 + 2} volume={0.15} />
      {frame < troca + 12 ? (
        <AbsoluteFill style={{ transform: `translateX(${-slide * width}px)` }}>
          <Tela corBorda={cores.neonAzul} selo>
            <TelaBacBo />
            <CirculoAnimado r={GRAFICO_BACBO} inicio={8} />
          </Tela>
        </AbsoluteFill>
      ) : null}
      {frame >= troca ? (
        <AbsoluteFill style={{ transform: `translateX(${(1 - slide) * width}px)` }}>
          <Tela endereco={ENDERECO_SITE} corBorda={cores.neonVerde} rolagem={rolagem}>
            <PaginaSite importado rodadas={RODADAS_REGISTRO.slice(0, registradas)} digitando={digitando} tocando={tocando} />
            {atual && t >= 3 ? (
              <CursorClique
                de={{ x: centro(botao(atual.r)).x + 60, y: centro(botao(atual.r)).y + 90 }}
                para={{ x: centro(botao(atual.r)).x + 40, y: centro(botao(atual.r)).y + 6 }}
                inicio={inicioRegistro + k * CICLO + 3}
                clique={inicioRegistro + k * CICLO + 9}
              />
            ) : null}
            <CaixaBrilho r={areaRegistro} inicio={m2} fim={m3 + 4} cor={cores.amarelo} />
            <SetaAnimada x={SITE.grade.x + SITE.grade.w - 120} y={SITE.secaoGrafico.y - 6} inicio={m3 + 26} cor={cores.neonVerde} tamanho={90} />
            <CaixaBrilho r={SITE.secaoGrafico} inicio={m3 + 30} cor={cores.neonVerde} />
          </Tela>
        </AbsoluteFill>
      ) : null}
      <PassoBadge numero={4} />
      <Instrucao
        itens={[
          { de: m1, texto: "Registre todas as rodadas no site" },
          { de: m2, texto: "Cuide para registrar corretamente!", alerta: true },
        ]}
      />
    </AbsoluteFill>
  );
};

/* ───────────────────────── PASSO 5 – Aguardar o padrão ───────────────────────── */
export const Passo5: React.FC = () => {
  const frame = useCurrentFrame();
  const C = "passo-5";
  const m1 = marca(C, "p5-1");
  const detectado = marca(C, "p5-2") - 8;
  const duracaoCena = cenaPorId(C).duracao;
  const escaneando = frame >= 6 && frame < detectado;

  return (
    <AbsoluteFill>
      <Som nome="scan" em={6} duracao={Math.max(1, detectado - 6)} loop />
      <Som nome="notificacao" em={detectado} />
      <Tela endereco={ENDERECO_SITE} corBorda={cores.neonVerde} rolagem={ROLAGEM.sinal} fixo={escaneando ? <Carregando /> : null}>
        <PaginaSite importado rodadas={RODADAS_REGISTRO} sinal={{ escaneandoDe: 6, detectadoEm: detectado }} />
        <CaixaBrilho r={SITE.statusSinal(1, ALTURA_HIPOTESE)} inicio={detectado + 10} cor="#ff3b4f" />
      </Tela>
      <PassoBadge numero={5} />
      <Instrucao itens={[{ de: m1, texto: "Agora é só aguardar a IA detectar um padrão", ate: duracaoCena }]} />
    </AbsoluteFill>
  );
};

const Carregando: React.FC = () => {
  const frame = useCurrentFrame();
  const pontos = ".".repeat(1 + (Math.floor(frame / 8) % 3));
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        right: 110,
        top: 560,
        padding: "30px 28px",
        borderRadius: 26,
        background: "rgba(3,10,24,0.94)",
        border: `4px solid ${cores.neonAzul}`,
        boxShadow: `0 0 30px ${cores.neonAzul}88`,
        display: "flex",
        alignItems: "center",
        gap: 28,
      }}
    >
      <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: `rotate(${frame * 12}deg)`, filter: `drop-shadow(0 0 10px ${cores.neonAzul})` }}>
        <circle cx="50" cy="50" r="40" stroke="#123056" strokeWidth="12" fill="none" />
        <circle cx="50" cy="50" r="40" stroke={cores.neonAzul} strokeWidth="12" fill="none" strokeDasharray="80 172" strokeLinecap="round" />
      </svg>
      <div style={{ fontFamily: fontes.titulo, fontWeight: 900, fontSize: 38, color: "#fff", letterSpacing: 3 }}>
        ESCANEANDO DADOS<span style={{ color: cores.neonAzul }}>{pontos}</span>
      </div>
    </div>
  );
};
