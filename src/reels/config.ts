/**
 * VÍDEO REELS / TIKTOK (60s, 1080x1920)
 *
 * Tudo que você pode querer trocar está aqui: cores, textos das legendas e tempos.
 * Nas legendas, [J], [B] e [E] viram bolinhas azul, vermelha e amarela.
 */

export const FPS = 30;
export const DURACAO = 60 * FPS;

export const CORES = {
  fundoTopo: "#050A17",
  fundoBase: "#1A0E3A",
  jogador: "#168CFF",
  banca: "#FF354D",
  empate: "#FFC928",
  roxo: "#8B40FF",
  verde: "#10C887",
  texto: "#FFFFFF",
  textoSuave: "#B9B4D6",
};

/** Legendas: [início, fim] em segundos e o texto (no máximo 2 linhas), sincronizadas com a narração. */
export const LEGENDAS: { de: number; ate: number; texto: string }[] = [
  { de: 0, ate: 2.8, texto: "Você acompanha o gráfico do Bac Bo?" },
  { de: 2.8, ate: 7, texto: "No Bac Bo, Jogador [J] e Banca [B] jogam dois dados cada." },
  { de: 7, ate: 9.6, texto: "Ganha a maior soma." },
  { de: 9.6, ate: 12.5, texto: "Somas iguais = Empate [E]" },
  { de: 12.5, ate: 17, texto: "No empate, o pagamento varia conforme a soma dos dados." },
  { de: 17, ate: 19.8, texto: "Cada rodada vira uma bolinha no gráfico." },
  { de: 19.8, ate: 22.7, texto: "O empate aparece como um risco amarelo [E] na bolinha." },
  { de: 22.7, ate: 27.5, texto: "Com o tempo, aparecem desenhos: sequências, xadrez, rampas..." },
  { de: 27.5, ate: 31, texto: "Acompanhar isso na mão cansa e confunde." },
  { de: 31, ate: 37.5, texto: "Com a VT Dados, você manda o print do gráfico..." },
  { de: 37.5, ate: 41.2, texto: "...a IA lê coluna por coluna, organiza o histórico" },
  { de: 41.2, ate: 45.5, texto: "e mostra as estatísticas de cada padrão." },
  { de: 45.5, ate: 49.5, texto: "Tudo num painel só, atualizado a cada rodada." },
  { de: 49.5, ate: 51.8, texto: "VT Dados · Link na bio" },
  { de: 51.8, ate: 55, texto: "VT Dados é desenvolvida pela PredyX IAs" },
  { de: 55, ate: 60, texto: "+18 · Análise estatística. Não garante resultados." },
];

/** Narração: arquivo em public/audio/narracao-reels/, o segundo em que começa e a duração. */
export const NARRACAO: { arquivo: string; inicio: number; duracao: number }[] = [
  { arquivo: "r01", inicio: 0.3, duracao: 2.02 },
  { arquivo: "r02", inicio: 3.1, duracao: 3.61 },
  { arquivo: "r03", inicio: 7.2, duracao: 1.58 },
  { arquivo: "r04", inicio: 9.7, duracao: 1.77 },
  { arquivo: "r05", inicio: 12.7, duracao: 3.58 },
  { arquivo: "r06", inicio: 17.2, duracao: 2.43 },
  { arquivo: "r07", inicio: 19.9, duracao: 2.83 },
  { arquivo: "r08", inicio: 22.8, duracao: 4.63 },
  { arquivo: "r09", inicio: 27.7, duracao: 2.68 },
  { arquivo: "r10", inicio: 31.2, duracao: 3.05 },
  { arquivo: "r11", inicio: 37.7, duracao: 3.33 },
  { arquivo: "r12", inicio: 41.3, duracao: 2.48 },
  { arquivo: "r13", inicio: 45.6, duracao: 2.99 },
  { arquivo: "r14", inicio: 49.7, duracao: 2.02 },
  { arquivo: "r15", inicio: 51.85, duracao: 3.22 },
  { arquivo: "r16", inicio: 55.05, duracao: 4.95 },
];

/** Textos fixos das cenas. */
export const TEXTOS = {
  rotulosPadroes: { sequencia: "sequência", xadrez: "xadrez", rampa: "rampa" },
  empate: "EMPATE",
  /** pagamentos da mesa (print da mesa do Bac Bo) */
  tabelaEmpate: {
    titulo: "EMPATE",
    colunas: ["SOMA", "PAGA"],
    linhas: [
      ["2 ou 12", "88:1"],
      ["3 ou 11", "25:1"],
      ["4 ou 10", "10:1"],
      ["5 ou 9", "6:1"],
      ["6, 7 ou 8", "4:1"],
    ],
    jogadorBanca: "Jogador e Banca pagam 1:1",
  },
  cartoes: [
    { rotulo: "JOGADOR", antes: 46, depois: 45 },
    { rotulo: "BANCA", antes: 44, depois: 45 },
    { rotulo: "EMPATE", antes: 10, depois: 10 },
  ],
  padroesTitulo: "Padrões encontrados",
  padroes: {
    historico: "Padrão no histórico: Xadrez",
    rodadasAntes: 67,
    rodadasDepois: 68,
    sequenciaAntes: "Sequência atual: Banca × 2",
    sequenciaDepois: "Sequência atual: Banca × 3",
  },
  botao: "Link na bio",
  aviso: "Análise estatística. Não garante resultados.",
  /** selo da desenvolvedora (canto superior direito e cena final) */
  desenvolvedoraCanto: "Desenvolvido por",
  desenvolvedoraFinal: "Desenvolvida pela",
};

/** Início de cada cena, em segundos (acompanhando a narração). */
export const CENAS = {
  gancho: 0,
  dados: 2.8,
  empate: 12.5,
  grafico: 17,
  caderno: 27.5,
  envio: 31,
  leitura: 37.5,
  painel: 45.5,
  final: 49.5,
};

/** Trilha: se existir public/trilha.mp3 ela toca neste volume (0 a 1); abaixa durante a narração. */
export const VOLUME_TRILHA = 0.18;
export const VOLUME_TRILHA_COM_FALA = 0.05;
