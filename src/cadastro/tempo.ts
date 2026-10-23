import { criarLinhaDoTempo, type Roteiro } from "../tempo";
import roteiro from "./roteiro.json";
import narracao from "./narracao.json";

// vídeo "Como se cadastrar na VT Dados IA"
export const tempoCadastro = criarLinhaDoTempo(roteiro as Roteiro, narracao as Record<string, number>);
