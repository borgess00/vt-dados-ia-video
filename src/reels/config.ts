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
  { de: 11, ate: 15, texto: "Somas iguais = Empate [E]" },
  { de: 15, ate: 20, texto: "Cada rodada vira uma bolinha no gráfico." },
  { de: 20, ate: 25, texto: "Com o tempo, aparecem desenhos: sequências, xadrez, rampas..." },
  { de: 25, ate: 32, texto: "Acompanhar isso na mão cansa e confunde." },
  { de: 32, ate: 40, texto: "Com a VT Dados, você manda o print do gráfico..." },
  { de: 40, ate: 45, texto: "...a IA lê coluna por coluna, organiza o histórico" },
  { de: 45, ate: 50, texto: "e mostra as estatísticas de cada padrão." },
  { de: 50, ate: 55, texto: "Tudo num painel só, atualizado a cada rodada." },
  { de: 55, ate: 60, texto: "VT Dados · Link na bio" },
];

/** Textos fixos das cenas. */
export const TEXTOS = {
  rotulosPadroes: { sequencia: "sequência", xadrez: "xadrez", rampa: "rampa" },
  empate: "EMPATE",
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
};

/** Início de cada cena, em segundos. */
export const CENAS = {
  gancho: 0,
  dados: 3,
  grafico: 15,
  caderno: 25,
  envio: 32,
  leitura: 40,
  painel: 50,
  final: 55,
};

/** Trilha opcional: coloque public/trilha.mp3 e mude para true. */
export const USAR_TRILHA = false;
export const VOLUME_TRILHA = 0.25;
