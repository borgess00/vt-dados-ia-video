import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Retangulo } from "../capturas";
import { cores, fontes } from "../tema";

/**
 * Site recriado a partir dos prints reais (versão celular, 900px de largura).
 * Todos os textos e botões abaixo existem no site; nada foi inventado.
 */

export const ENDERECO_SITE = "vtdados.netlify.app";

const roxo = "#8b5cf6";
const S = {
  fundo: "#040a1a",
  cartao: "linear-gradient(180deg, #0a1530, #070f24)",
  borda: "#1c3366",
  texto: "#e8eefc",
  suave: "#9fb0d0",
  azul: "linear-gradient(90deg, #1f6fff, #0b55e6)",
  vermelho: "linear-gradient(90deg, #ff4a5e, #df1031)",
  amarelo: "linear-gradient(90deg, #ffd447, #b98500)",
  roxo: "linear-gradient(90deg, #7c3aed, #4c25c9)",
  escuro: "#0b1d44",
};

export type Rodada = { r: "J" | "B" | "E"; n: number | "?" };
const corRodada = (r: Rodada["r"]) => (r === "J" ? "#1f6fff" : r === "B" ? "#ff3b55" : "#f0b400");

/** Rodadas registradas manualmente no passo 4 (exemplo). */
export const RODADAS_REGISTRO: Rodada[] = [
  { r: "B", n: 9 },
  { r: "J", n: 8 },
  { r: "B", n: 11 },
  { r: "E", n: 7 },
  { r: "J", n: 6 },
  { r: "J", n: 9 },
];

/** Prévia real mostrada após "Ler imagem e reconhecer resultados". */
const PREVIA: Rodada[] = [
  { r: "B", n: 9 }, { r: "B", n: 9 }, { r: "E", n: 9 }, { r: "E", n: 6 }, { r: "E", n: 7 },
  { r: "J", n: 8 }, { r: "J", n: 9 }, { r: "E", n: 6 }, { r: "B", n: 7 }, { r: "B", n: 9 },
  { r: "J", n: 9 }, { r: "J", n: "?" }, { r: "J", n: 6 }, { r: "B", n: 11 },
];

/* ───────────── layout (y em px da página) ───────────── */
const X = 24;
const W = 852;
const PAD = 28;
const IW = W - PAD * 2; // largura interna dos cartões

const REG = 450;
const GRAF = 1170;
const IMP = 1590;
const IMP_FECHADO = 430;
const EXPANSAO = 626;
const sinalY = (e: number) => IMP + IMP_FECHADO + 30 + EXPANSAO * e;

const ret = (x: number, y: number, w: number, h: number): Retangulo => ({ x, y, w, h });

export const SITE = {
  titulo: ret(110, 18, 680, 100),
  botoesTopo: ret(X + 180, 172, 490, 56),
  secaoRegistro: ret(X, REG, W, 690),
  campoTotal: ret(X + PAD, REG + 185, IW, 76),
  botaoJogador: ret(X + PAD, REG + 280, (IW - 16) / 2, 70),
  botaoBanca: ret(X + PAD + (IW + 16) / 2, REG + 280, (IW - 16) / 2, 70),
  botaoEmpate: ret(X + PAD, REG + 366, IW, 70),
  resultados: ret(X + PAD, REG + 540, IW, 120),
  secaoGrafico: ret(X, GRAF, W, 390),
  grade: ret(X + PAD, GRAF + 160, 792, 198),
  secaoImportar: ret(X, IMP, W, IMP_FECHADO),
  escolherArquivo: ret(X + PAD, IMP + 222, IW, 80),
  botaoLerImagem: ret(X + PAD, IMP + 320, IW, 80),
  statusSinal: (e = 1) => ret(X + PAD, sinalY(e) + 215, IW, 170),
  secaoSinal: (e = 1) => ret(X, sinalY(e), W, 620),
};

/** Posições de rolagem (topo da janela) usadas nos passos. */
export const ROLAGEM = {
  topo: 0,
  importar: IMP - 40,
  importarResultado: IMP + 34,
  registro: REG - 40,
  grafico: 880,
  sinal: sinalY(1) - 40,
};

export const ALTURA_PAGINA = sinalY(1) + 1410;

export type EstadoSite = {
  /** frame em que a print é escolhida no campo de arquivo */
  printEm?: number;
  /** frame do clique em "Ler imagem e reconhecer resultados" */
  cliqueLerEm?: number;
  /** força a seção de importação aberta (passos 4 e 5) */
  importado?: boolean;
  /** rodadas registradas manualmente */
  rodadas?: Rodada[];
  /** texto sendo digitado no campo "Total dos dados" */
  digitando?: string;
  /** botão de resultado sendo tocado */
  tocando?: Rodada["r"] | null;
  /** status do sinal */
  sinal?: { escaneandoDe?: number; detectadoEm?: number };
};

export const PaginaSite: React.FC<EstadoSite> = ({ printEm, cliqueLerEm, importado, rodadas = [], digitando = "", tocando = null, sinal }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const arquivoEscolhido = printEm !== undefined && frame >= printEm;
  const lido = importado || (cliqueLerEm !== undefined && frame >= cliqueLerEm + 18);
  const e = importado
    ? 1
    : cliqueLerEm !== undefined
      ? interpolate(frame, [cliqueLerEm + 18, cliqueLerEm + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;
  const lendo = cliqueLerEm !== undefined && frame >= cliqueLerEm && frame < cliqueLerEm + 18;
  const apertado = (inicio?: number) => inicio !== undefined && frame >= inicio && frame < inicio + 6;

  const total = rodadas.length;
  const pct = (r: Rodada["r"]) => (total ? Math.round((rodadas.filter((x) => x.r === r).length / total) * 100) : 0);
  const sy = sinalY(e);

  return (
    <div style={{ position: "relative", width: 900, height: ALTURA_PAGINA, background: `radial-gradient(ellipse at 50% 0%, #0d1f4a 0%, ${S.fundo} 45%)`, fontFamily: fontes.texto, color: S.texto }}>
      {/* topo */}
      <div style={{ position: "absolute", top: 22, width: "100%", textAlign: "center", fontFamily: fontes.texto, fontWeight: 900, fontSize: 66, letterSpacing: 1 }}>
        <span style={{ color: "#f2f0ff", textShadow: `0 0 18px ${roxo}` }}>VTzin </span>
        <span style={{ color: "#a77bff", textShadow: `0 0 22px ${roxo}, 0 0 40px ${roxo}` }}>BAC BO LIVE</span>
      </div>
      <div style={{ position: "absolute", top: 124, width: "100%", textAlign: "center", fontSize: 20, fontWeight: 600, letterSpacing: 6, color: S.suave }}>
        BAC BO · ANÁLISE DE PADRÕES
      </div>
      <div style={{ position: "absolute", top: 172, width: "100%", display: "flex", justifyContent: "center", gap: 14 }}>
        {["Sair da conta", "Cancelar assinatura"].map((t) => (
          <div key={t} style={{ padding: "12px 22px", borderRadius: 14, border: `2px solid ${S.borda}`, background: S.escuro, fontWeight: 900, fontSize: 22 }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: X, width: W, top: 250, height: 2, background: S.borda }} />

      {/* percentuais */}
      <div style={{ position: "absolute", left: X, width: W, top: 272, height: 150, display: "flex", gap: 16 }}>
        {[
          { t: "JOGADOR", c: "#3b82ff", v: pct("J") },
          { t: "BANCA", c: "#ff3b55", v: pct("B") },
          { t: "EMPATE", c: "#ffc828", v: pct("E") },
        ].map((s) => (
          <div key={s.t} style={{ flex: 1, borderRadius: 18, border: `2px solid ${S.borda}`, background: S.cartao, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2, color: s.c }}>{s.t}</div>
            <div style={{ fontSize: 58, fontWeight: 900, color: s.c, marginTop: 4 }}>{s.v}%</div>
            <div style={{ width: "88%", height: 8, borderRadius: 4, background: "#16264a", marginTop: 6, overflow: "hidden" }}>
              <div style={{ width: `${s.v}%`, height: "100%", background: s.c }} />
            </div>
          </div>
        ))}
      </div>

      {/* Registrar rodada */}
      <Cartao r={SITE.secaoRegistro} icone="dado" titulo="Registrar rodada">
        <Descricao>
          Digite o total dos dados e toque no resultado correspondente. A análise usa somente rodadas registradas/importadas aqui; ainda não há conexão
          automática com uma API ao vivo.
        </Descricao>
      </Cartao>
      <Caixa r={SITE.campoTotal} style={{ border: `2px solid ${digitando ? "#3b82ff" : S.borda}`, background: S.escuro, justifyContent: "flex-start", padding: "0 22px", fontSize: 26, fontWeight: 600, color: digitando ? "#fff" : "#7f93bb" }}>
        {digitando || "Total dos dados (2 a 12)"}
        {digitando ? <span style={{ width: 3, height: 32, background: "#fff", marginLeft: 3, opacity: frame % 16 < 8 ? 1 : 0 }} /> : null}
      </Caixa>
      <Botao r={SITE.botaoJogador} fundo={S.azul} apertado={tocando === "J"}>
        <Bolinha cor="#5b8cff" /> Jogador + número
      </Botao>
      <Botao r={SITE.botaoBanca} fundo={S.vermelho} apertado={tocando === "B"}>
        <Bolinha cor="#ff8a96" /> Banca + número
      </Botao>
      <Botao r={SITE.botaoEmpate} fundo={S.amarelo} cor="#2a1d00" apertado={tocando === "E"}>
        <Bolinha cor="#ffe27a" /> Empate + número
      </Botao>
      <Botao r={ret(X + PAD, REG + 452, (IW - 16) / 2, 70)} fundo={S.escuro} borda>
        ↩ Desfazer última
      </Botao>
      <Botao r={ret(X + PAD + (IW + 16) / 2, REG + 452, (IW - 16) / 2, 70)} fundo={S.roxo}>
        Atualizar análise
      </Botao>
      <div style={{ position: "absolute", left: X + PAD, top: REG + 545, width: IW, height: 80, display: "flex", alignItems: "center", gap: 10 }}>
        {total === 0 ? (
          <span style={{ fontSize: 22, color: S.suave, fontWeight: 600 }}>Ainda sem resultados.</span>
        ) : (
          rodadas.map((rd, i) => <Ficha key={i} rodada={rd} />)
        )}
      </div>
      <div style={{ position: "absolute", left: X + PAD, top: REG + 640, fontSize: 21, fontWeight: 600, color: S.suave }}>{total} rodadas registradas</div>

      {/* Gráfico ao vivo (ilustrativo) */}
      <Cartao r={SITE.secaoGrafico} icone="barras" titulo="Gráfico ao vivo (ilustrativo)">
        <Descricao>Gerado a partir das rodadas registradas, no formato do gráfico de anéis do jogo. Serve só para acompanhar.</Descricao>
      </Cartao>
      <GradeAoVivo rodadas={rodadas} />

      {/* Importar tabela por imagem */}
      <Cartao r={ret(X, IMP, W, IMP_FECHADO + EXPANSAO * e)} icone="imagem" titulo="Importar tabela por imagem">
        <Descricao>
          Escolha uma imagem já salva na galeria ou nos arquivos do celular (não precisa tirar foto). O site tenta ler os números e identificar a cor de cada
          bolinha. Confira a prévia antes de adicionar ao histórico.
        </Descricao>
      </Cartao>
      <div style={{ position: "absolute", left: X + PAD, top: IMP + 186, fontSize: 21, fontWeight: 600, color: S.suave }}>Selecionar um print salvo no celular</div>
      <Caixa r={SITE.escolherArquivo} style={{ border: `2px solid ${arquivoEscolhido ? "#3b82ff" : S.borda}`, background: S.escuro, justifyContent: "flex-start", padding: "0 18px", gap: 14 }}>
        <div style={{ padding: "6px 14px", background: "#e9e9ef", color: "#111", border: "2px solid #8a8a99", borderRadius: 4, fontSize: 24, fontWeight: 600, whiteSpace: "nowrap" }}>Escolher ficheiro</div>
        <span style={{ fontSize: 23, fontWeight: 600, whiteSpace: "nowrap", color: arquivoEscolhido ? "#fff" : S.suave }}>
          {arquivoEscolhido ? "Captura de tela 2026-10-22 144430.png" : "Nenhum ficheiro selecionado"}
        </span>
      </Caixa>
      <Botao r={SITE.botaoLerImagem} fundo={S.roxo} apertado={apertado(cliqueLerEm)}>
        {lendo ? <Carregador /> : <Lupa />} Ler imagem e reconhecer resultados
      </Botao>
      {lido ? (
        <div style={{ position: "absolute", left: X + PAD, top: IMP + 420, width: IW, opacity: e }}>
          <div style={{ padding: "14px 18px", borderRadius: 14, border: "2px solid #1d5a3c", background: "#06231a", color: "#b8f5d0", fontSize: 20, fontWeight: 600, lineHeight: 1.35 }}>
            Gráfico lido: 127 bolinhas, na ordem coluna por coluna (de cima para baixo). 15 número(s) não ficaram claros (aparecem como "?", a cor está certa). Confira a
            prévia antes de importar.
          </div>
          <div style={{ marginTop: 16, fontSize: 24, fontWeight: 900 }}>Ordem de leitura no seu print</div>
          <Img src={staticFile("capturas/ordem-de-leitura.png")} style={{ marginTop: 10, width: IW, borderRadius: 10, display: "block" }} />
          <div style={{ marginTop: 18, fontSize: 24, fontWeight: 900 }}>Prévia — 127 resultados (o mais antigo primeiro)</div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, overflow: "hidden", width: IW }}>
            {PREVIA.map((rd, i) => (
              <Ficha key={i} rodada={rd} />
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              height: 76,
              borderRadius: 16,
              background: S.azul,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 26,
            }}
          >
            <span style={{ color: "#ff6fae", marginRight: 10 }}>+</span> Adicionar resultados reconhecidos
          </div>
        </div>
      ) : null}

      {/* Sinal estatístico */}
      <Cartao r={ret(X, sy, W, 620)} icone="alvo" titulo="Sinal estatístico">
        <Descricao>
          O painel procura os padrões cadastrados no final do histórico. Só mostra uma hipótese se houver apoio em resultados anteriores; caso contrário, mantém
          'Buscando padrão...'. É uma leitura simples do histórico, não uma previsão garantida.
        </Descricao>
      </Cartao>
      <StatusSinal y={sy + 215} sinal={sinal} fps={fps} frame={frame} />
      <div style={{ position: "absolute", left: X + PAD, top: sy + 404, width: IW, fontSize: 21, lineHeight: 1.35, fontWeight: 600 }}>
        <b>Placar dos sinais:</b> <span style={{ color: "#34d399" }}>WIN 0</span> · <span style={{ color: "#ff4d5e" }}>LOSS 0</span> ·{" "}
        <span style={{ color: "#ffc828" }}>EMPATE/DEVOLVIDA 0</span> · Total resolvido: 0
      </div>
      <div style={{ position: "absolute", left: X + PAD + 6, top: sy + 478, display: "flex", alignItems: "center", gap: 14, fontSize: 21, fontWeight: 600 }}>
        <div style={{ width: 22, height: 22, borderRadius: 4, background: "#ffc828", color: "#000", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>✓</div>
        Considerar empate como cobertura adicional no sinal
      </div>
      <div style={{ position: "absolute", left: X + PAD, top: sy + 522, width: IW, padding: "14px 18px", borderRadius: 14, border: "2px solid #1d5a3c", background: "#06231a", color: "#b8f5d0", fontSize: 20, fontWeight: 600, boxSizing: "border-box" }}>
        A cobertura de empate está ativada para exibição do sinal; isso não significa que o empate seja provável.
      </div>

      {/* Padrões encontrados */}
      <Cartao r={ret(X, sy + 650, W, 150)} icone="grafico" titulo="Padrões encontrados">
        <Descricao>Adicione resultados para ver estatísticas.</Descricao>
      </Cartao>

      {/* Marcador de nível */}
      <Cartao r={ret(X, sy + 830, W, 360)} icone="escudo" titulo="Marcador de nível">
        <Descricao>Marcador manual de uso pessoal. O site não realiza apostas e não recomenda aumentar valores.</Descricao>
      </Cartao>
      <Botao r={ret(X + PAD, sy + 955, (IW - 16) / 2, 70)} fundo="linear-gradient(90deg, #0b4fd1, #0a3fa8)">
        G0
      </Botao>
      <Botao r={ret(X + PAD + (IW + 16) / 2, sy + 955, (IW - 16) / 2, 70)} fundo={S.escuro} borda>
        G1
      </Botao>
      <Botao r={ret(X + PAD, sy + 1040, IW, 70)} fundo={S.escuro} borda>
        G2
      </Botao>
      <div style={{ position: "absolute", left: X + PAD, top: sy + 1124, width: IW, padding: "12px 18px", borderRadius: 14, border: "2px solid #1d5a3c", background: "#06231a", color: "#b8f5d0", fontSize: 20, fontWeight: 600, boxSizing: "border-box" }}>
        Nível selecionado: G0
      </div>
      <Botao r={ret(X, sy + 1220, (W - 16) / 2, 72)} fundo={S.escuro} borda>
        ⬇ Exportar histórico
      </Botao>
      <Botao r={ret(X + (W + 16) / 2, sy + 1220, (W - 16) / 2, 72)} fundo={S.escuro} borda>
        Limpar tudo
      </Botao>
      <div style={{ position: "absolute", left: X, top: sy + 1320, width: W, textAlign: "center", fontSize: 17, fontWeight: 600, color: "#7d8db0", lineHeight: 1.4 }}>
        VTzin Bac Bo Live · Análise estatística experimental · Resultados aleatórios podem quebrar qualquer padrão observado.
      </div>
    </div>
  );
};

/* ───────────── peças ───────────── */

const Caixa: React.FC<{ r: Retangulo; style?: React.CSSProperties; children?: React.ReactNode }> = ({ r, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: r.x,
      top: r.y,
      width: r.w,
      height: r.h,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

const Botao: React.FC<{ r: Retangulo; fundo: string; cor?: string; borda?: boolean; apertado?: boolean; children: React.ReactNode }> = ({
  r,
  fundo,
  cor = "#fff",
  borda,
  apertado,
  children,
}) => (
  <Caixa
    r={r}
    style={{
      background: fundo,
      border: borda ? `2px solid ${S.borda}` : "none",
      color: cor,
      fontWeight: 900,
      fontSize: 25,
      gap: 10,
      transform: `scale(${apertado ? 0.95 : 1})`,
      filter: apertado ? "brightness(1.35)" : undefined,
      boxShadow: apertado ? "0 0 30px rgba(255,255,255,0.45)" : undefined,
    }}
  >
    {children}
  </Caixa>
);

const Cartao: React.FC<{ r: Retangulo; icone: Icone; titulo: string; children?: React.ReactNode }> = ({ r, icone, titulo, children }) => (
  <div
    style={{
      position: "absolute",
      left: r.x,
      top: r.y,
      width: r.w,
      height: r.h,
      borderRadius: 24,
      border: `2px solid ${S.borda}`,
      background: S.cartao,
      boxSizing: "border-box",
      padding: `${PAD - 2}px ${PAD}px`,
      overflow: "hidden",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 31, fontWeight: 900 }}>
      <IconeSecao tipo={icone} />
      {titulo}
    </div>
    {children}
  </div>
);

const Descricao: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.45, color: S.suave, fontWeight: 600 }}>{children}</div>
);

const Bolinha: React.FC<{ cor: string }> = ({ cor }) => (
  <span style={{ width: 18, height: 18, borderRadius: 9, background: `radial-gradient(circle at 35% 35%, #fff, ${cor})`, display: "inline-block" }} />
);

const Ficha: React.FC<{ rodada: Rodada }> = ({ rodada }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: 23,
        background: corRodada(rodada.r),
        border: "3px solid rgba(255,255,255,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: 20,
        color: "#fff",
      }}
    >
      {rodada.r}
    </div>
    <div style={{ fontSize: 18, fontWeight: 600 }}>{rodada.n}</div>
  </div>
);

const COLS = 24;
const LINHAS = 6;
const GradeAoVivo: React.FC<{ rodadas: Rodada[] }> = ({ rodadas }) => {
  const g = SITE.grade;
  const c = g.w / COLS;
  return (
    <svg style={{ position: "absolute", left: g.x, top: g.y }} width={g.w} height={g.h}>
      <rect width={g.w} height={g.h} fill="#fff" />
      {Array.from({ length: COLS + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i * c} y1={0} x2={i * c} y2={g.h} stroke="#d6dbe6" strokeWidth={1.5} />
      ))}
      {Array.from({ length: LINHAS + 1 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * c} x2={g.w} y2={i * c} stroke="#d6dbe6" strokeWidth={1.5} />
      ))}
      {rodadas.map((rd, i) => {
        const cx = Math.floor(i / LINHAS) * c + c / 2;
        const cy = (i % LINHAS) * c + c / 2;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={c * 0.44} fill={corRodada(rd.r)} />
            <text x={cx} y={cy + 6} textAnchor="middle" fontSize={16} fontWeight={900} fill="#fff" fontFamily="Montserrat">
              {rd.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const StatusSinal: React.FC<{ y: number; sinal: EstadoSite["sinal"]; frame: number; fps: number }> = ({ y, sinal, frame, fps }) => {
  const detectado = sinal?.detectadoEm !== undefined && frame >= sinal.detectadoEm;
  const escaneando = !detectado && sinal?.escaneandoDe !== undefined && frame >= sinal.escaneandoDe;
  const entra = detectado ? spring({ frame: frame - sinal!.detectadoEm!, fps, config: { damping: 10 } }) : 0;
  const pulso = detectado ? 0.6 + 0.4 * Math.abs(Math.sin((frame - sinal!.detectadoEm!) / 9)) : 0;
  const varre = ((frame % 36) / 36) * 120 - 10;
  const destaque = (t: string) => <span style={{ color: cores.neonVerde, whiteSpace: "nowrap", textShadow: `0 0 ${16 * pulso}px ${cores.neonVerde}` }}>{t}</span>;
  return (
    <div
      style={{
        position: "absolute",
        left: X + PAD,
        top: y,
        width: IW,
        height: 170,
        borderRadius: 20,
        border: `2px solid ${detectado ? cores.neonVerde : "#3a3f9e"}`,
        background: detectado ? "linear-gradient(135deg, #062a1d, #081a2e)" : "linear-gradient(135deg, #0b1636, #1a0f3a)",
        boxShadow: detectado ? `0 0 ${40 * pulso}px ${cores.neonVerde}, inset 0 0 ${24 * pulso}px ${cores.neonVerde}44` : "none",
        padding: "20px 24px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: 2, color: S.suave }}>STATUS DO SINAL</div>
      {detectado ? (
        <div style={{ marginTop: 8, fontSize: 36, fontWeight: 900, lineHeight: 1.2, transform: `scale(${0.9 + 0.1 * entra})`, transformOrigin: "left center" }}>
          Padrão que aconteceu {destaque("5 vezes")} com {destaque("60%")} de assertividade
        </div>
      ) : (
        <>
          <div style={{ marginTop: 6, fontSize: 44, fontWeight: 900 }}>Buscando padrão...</div>
          <div style={{ marginTop: 8, fontSize: 21, fontWeight: 600, color: S.suave }}>Registre resultados manualmente ou importe uma tabela.</div>
        </>
      )}
      {escaneando ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${varre}%`,
            width: "12%",
            background: `linear-gradient(90deg, transparent, ${cores.neonAzul}66, transparent)`,
            borderRight: `3px solid ${cores.neonAzul}`,
            boxShadow: `0 0 20px ${cores.neonAzul}`,
          }}
        />
      ) : null}
    </div>
  );
};

type Icone = "dado" | "barras" | "imagem" | "alvo" | "grafico" | "escudo";
const IconeSecao: React.FC<{ tipo: Icone }> = ({ tipo }) => (
  <svg width="34" height="34" viewBox="0 0 24 24">
    {tipo === "dado" ? (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#e9eaf2" />
        {[[8, 8], [16, 8], [12, 12], [8, 16], [16, 16]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="#c0263a" />
        ))}
      </>
    ) : tipo === "barras" ? (
      <>
        <rect x="2" y="2" width="20" height="20" rx="3" fill="#dfe6f5" />
        <rect x="6" y="11" width="3" height="8" fill="#3b82ff" />
        <rect x="10.5" y="7" width="3" height="12" fill="#ff3b55" />
        <rect x="15" y="13" width="3" height="6" fill="#22c55e" />
      </>
    ) : tipo === "imagem" ? (
      <>
        <rect x="2" y="3" width="20" height="18" rx="3" fill="#cfe8ff" />
        <path d="M4 18l5-6 4 4 3-3 4 5z" fill="#2f9e5a" />
        <circle cx="16" cy="8" r="2" fill="#ffc828" />
      </>
    ) : tipo === "alvo" ? (
      <>
        <circle cx="12" cy="12" r="10" fill="#ff3b55" />
        <circle cx="12" cy="12" r="6.5" fill="#fff" />
        <circle cx="12" cy="12" r="3" fill="#ff3b55" />
      </>
    ) : tipo === "escudo" ? (
      <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="#60a5fa" stroke="#bfdbfe" strokeWidth="1.2" />
    ) : (
      <>
        <rect x="2" y="2" width="20" height="20" rx="3" fill="#dfe6f5" />
        <path d="M5 17l4-5 3 3 6-8" stroke="#ff3b55" strokeWidth="2.2" fill="none" />
      </>
    )}
  </svg>
);

const Lupa: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24">
    <circle cx="10" cy="10" r="6" fill="#7dd3fc" stroke="#e0f2fe" strokeWidth="2" />
    <path d="M15 15l5 5" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Carregador: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" style={{ transform: `rotate(${frame * 18}deg)` }}>
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
};

export const IconeCheck: React.FC<{ tamanho: number; cor?: string }> = ({ tamanho, cor = cores.neonVerde }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 10px ${cor})`, flexShrink: 0 }}>
    <circle cx="12" cy="12" r="11" fill={cor} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#00150b" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
