import roteiro from "./roteiro.json";
import narracao from "./narracao.json";
import { FPS } from "./tema";

const duracoes = narracao as Record<string, number>;

export type Palavra = {
  texto: string;
  destaque: boolean;
  inicio: number; // frame absoluto no vídeo
};

export type PaginaLegenda = {
  palavras: Palavra[];
  inicio: number;
  fim: number;
};

export type Frase = {
  id: string;
  inicio: number; // frame relativo ao começo da cena
  duracao: number; // frames
};

export type Cena = {
  id: string;
  inicio: number; // frame absoluto
  duracao: number;
  frases: Frase[];
};

const f = (seg: number) => Math.round(seg * FPS);

const MAX_PALAVRAS = 4;
const MAX_LETRAS = 24;

const quebrarEmPalavras = (legenda: string, inicio: number, duracao: number): Palavra[] => {
  let dentroDestaque = false;
  // separa só em espaços comuns: o espaço inquebrável (U+00A0) mantém palavras juntas na mesma tela
  const brutas = legenda.split(/[ \t\n]+/).filter(Boolean).map((token) => {
    const abre = token.startsWith("*");
    const fecha = token.replace(/[.,!?:;’']+$/, "").endsWith("*");
    if (abre) dentroDestaque = true;
    const destaque = dentroDestaque;
    if (fecha) dentroDestaque = false;
    return { texto: token.replace(/\*/g, ""), destaque };
  });
  // peso de cada palavra ~ tempo para falar (letras + pausa da pontuação)
  const pesos = brutas.map((p) => p.texto.replace(/[^\p{L}\p{N}]/gu, "").length + 2 + (/[.,!?:]$/.test(p.texto) ? 4 : 0));
  const total = pesos.reduce((a, b) => a + b, 0);
  let acumulado = 0;
  return brutas.map((p, i) => {
    const palavra = { ...p, inicio: inicio + Math.round((acumulado / total) * duracao) };
    acumulado += pesos[i];
    return palavra;
  });
};

const paginar = (palavras: Palavra[], fimFrase: number): PaginaLegenda[] => {
  const paginas: Palavra[][] = [];
  let atual: Palavra[] = [];
  for (const p of palavras) {
    const letras = atual.reduce((a, w) => a + w.texto.length + 1, 0) + p.texto.length;
    if (atual.length && (atual.length >= MAX_PALAVRAS || letras > MAX_LETRAS)) {
      paginas.push(atual);
      atual = [];
    }
    atual.push(p);
    if (/[.,!?:]$/.test(p.texto) && atual.length >= 2) {
      paginas.push(atual);
      atual = [];
    }
  }
  if (atual.length) paginas.push(atual);
  return paginas.map((ps, i) => ({
    palavras: ps,
    inicio: ps[0].inicio,
    fim: i < paginas.length - 1 ? paginas[i + 1][0].inicio : fimFrase + 8,
  }));
};

const montar = () => {
  let cursor = 0;
  const cenas: Cena[] = [];
  const legendas: PaginaLegenda[] = [];
  const falas: { id: string; inicio: number; duracao: number }[] = [];

  for (const cena of roteiro.cenas) {
    let t = cena.inicioFala;
    const frases: Frase[] = [];
    cena.frases.forEach((frase, i) => {
      const dur = duracoes[frase.id];
      if (dur === undefined) throw new Error(`Falta narração para "${frase.id}". Rode: npm run narracao`);
      if (i > 0) t += ("pausaAntes" in frase ? (frase.pausaAntes as number) : 0) + 0.15;
      frases.push({ id: frase.id, inicio: f(t), duracao: f(dur) });
      falas.push({ id: frase.id, inicio: cursor + f(t), duracao: f(dur) });
      if (!("semLegenda" in frase && frase.semLegenda) && frase.legenda) {
        const palavras = quebrarEmPalavras(frase.legenda, cursor + f(t), f(dur));
        legendas.push(...paginar(palavras, cursor + f(t) + f(dur)));
      }
      t += dur;
    });
    const fim = "finalDepoisDaFala" in cena ? (cena.finalDepoisDaFala as number) : 0.6;
    const duracao = f(Math.max(cena.duracaoMinima, t + fim));
    cenas.push({ id: cena.id, inicio: cursor, duracao, frases });
    cursor += duracao;
  }
  return { cenas, legendas, falas, total: cursor };
};

export const linhaDoTempo = montar();

export const cenaPorId = (id: string) => {
  const c = linhaDoTempo.cenas.find((x) => x.id === id);
  if (!c) throw new Error(`Cena desconhecida: ${id}`);
  return c;
};

/** Frame (relativo à cena) em que a frase começa. */
export const marca = (cena: string, frase: string, deslocamentoSeg = 0) => {
  const fr = cenaPorId(cena).frases.find((x) => x.id === frase);
  if (!fr) throw new Error(`Frase desconhecida: ${frase}`);
  return fr.inicio + f(deslocamentoSeg);
};

export const fimFrase = (cena: string, frase: string) => {
  const fr = cenaPorId(cena).frases.find((x) => x.id === frase)!;
  return fr.inicio + fr.duracao;
};
