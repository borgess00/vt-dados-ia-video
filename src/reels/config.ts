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

/** Legendas: [início, fim] em segundos e o texto (no máximo 2 linhas). */
export const LEGENDAS: { de: number; ate: number; texto: string }[] = [
  { de: 0, ate: 3, texto: "Você acompanha o gráfico do Bac Bo?" },
  { de: 3, ate: 7, texto: "No Bac Bo, Jogador [J] e Banca [B] jogam dois dados cada." },
  { de: 7, ate: 11, texto: "Ganha a maior soma." },
  { de: 11, ate: 14, texto: "Somas iguais = Empate [E]" },
  { de: 14, ate: 19, texto: "No empate, o pagamento varia conforme a soma dos dados." },
  { de: 19, ate: 22, texto: "Cada rodada vira uma bolinha no gráfico." },
  { de: 22, ate: 25, texto: "O empate aparece como um risco amarelo [E] na bolinha." },
  { de: 25, ate: 28, texto: "Com o tempo, aparecem desenhos: sequências, xadrez, rampas..." },
  { de: 28, ate: 32, texto: "Acompanhar isso na mão cansa e confunde." },
  { de: 32, ate: 39, texto: "Com a VT Dados, você manda o print do gráfico..." },
  { de: 39, ate: 43.5, texto: "...a IA lê coluna por coluna, organiza o histórico" },
  { de: 43.5, ate: 48, texto: "e mostra as estatísticas de cada padrão." },
  { de: 48, ate: 53, texto: "Tudo num painel só, atualizado a cada rodada." },
  { de: 53, ate: 56.5, texto: "VT Dados · Link na bio" },
  { de: 56.5, ate: 60, texto: "VT Dados é desenvolvida pela PredyX IAs" },
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

/** Início de cada cena, em segundos. */
export const CENAS = {
  gancho: 0,
  dados: 3,
  empate: 14,
  grafico: 19,
  caderno: 28,
  envio: 32,
  leitura: 39,
  painel: 48,
  final: 53,
};

/** Trilha: se existir public/trilha.mp3 ela toca neste volume (0 a 1). */
export const VOLUME_TRILHA = 0.55;
