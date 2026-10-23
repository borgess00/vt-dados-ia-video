import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile } from "remotion";
import { Abertura } from "./cenas/Abertura";
import { AvisoFinal, AvisoInicial } from "./cenas/Avisos";
import { Encerramento } from "./cenas/Encerramento";
import { Passo1, Passo2, Passo3, Passo4, Passo5 } from "./cenas/Passos";
import { Fundo } from "./componentes/Fundo";
import { Legendas } from "./componentes/Legendas";
import { Som } from "./componentes/Som";
import { Transicao, type TipoEntrada } from "./componentes/Transicao";
import { cenaPorId, linhaDoTempo } from "./tempo";

const CENAS: { id: string; componente: React.FC; entrada: TipoEntrada; semSaida?: boolean }[] = [
  { id: "abertura", componente: Abertura, entrada: "nenhuma" },
  { id: "aviso-inicial", componente: AvisoInicial, entrada: "glitch" },
  { id: "passo-1", componente: Passo1, entrada: "zoom" },
  { id: "passo-2", componente: Passo2, entrada: "slide" },
  { id: "passo-3", componente: Passo3, entrada: "glitch" },
  { id: "passo-4", componente: Passo4, entrada: "slide" },
  { id: "passo-5", componente: Passo5, entrada: "zoom" },
  // aviso final: sem efeito de entrada/saída para nunca cobrir o texto
  { id: "aviso-final", componente: AvisoFinal, entrada: "nenhuma", semSaida: true },
  { id: "encerramento", componente: Encerramento, entrada: "zoom" },
];

/**
 * Música de fundo. Para usar outra música, coloque o arquivo em public/audio/
 * (ex.: public/audio/minha-musica.mp3) e troque o caminho abaixo.
 */
// "Nego Raul" (trecho de 0:00 a 1:30), com as frequências da voz atenuadas para a narração ficar clara.
// A trilha sintetizada original continua em "audio/musica.wav".
const MUSICA = "audio/nego-raul.mp3";

// volumes bem baixos para não atrapalhar a narração
const VOLUME_MUSICA = 0.15;
const VOLUME_MUSICA_FALA = 0.05;
const VOLUME_MUSICA_AVISO = 0.035;

const volumeMusica = (frame: number) => {
  const { falas, total } = linhaDoTempo;
  const aviso = cenaPorId("aviso-final");
  // abaixa a música durante a narração (com rampas suaves de 6 frames)
  let alvo = VOLUME_MUSICA;
  for (const f of falas) {
    const dentro = interpolate(frame, [f.inicio - 6, f.inicio, f.inicio + f.duracao, f.inicio + f.duracao + 8], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    alvo = Math.min(alvo, VOLUME_MUSICA - (VOLUME_MUSICA - VOLUME_MUSICA_FALA) * dentro);
  }
  if (frame >= aviso.inicio && frame < aviso.inicio + aviso.duracao) alvo = Math.min(alvo, VOLUME_MUSICA_AVISO);
  const entrada = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const saida = interpolate(frame, [total - 75, total - 5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return alvo * entrada * saida;
};

export type PropsTutorial = { musica: boolean; narracao?: boolean };

export const Tutorial: React.FC<PropsTutorial> = ({ musica, narracao = true }) => {
  const { cenas, falas } = linhaDoTempo;
  return (
    <AbsoluteFill style={{ backgroundColor: "#07051a" }}>
      <Fundo />
      {CENAS.map(({ id, componente: Componente, entrada, semSaida }) => {
        const c = cenas.find((x) => x.id === id)!;
        return (
          <Sequence key={id} from={c.inicio} durationInFrames={c.duracao} name={id}>
            <Transicao entrada={entrada} semSaida={semSaida}>
              <Componente />
            </Transicao>
            {entrada !== "nenhuma" ? <Som nome="whoosh" em={0} volume={0.3} /> : null}
            {entrada === "glitch" ? <Som nome="glitch" em={0} /> : null}
          </Sequence>
        );
      })}

      <Legendas />

      {narracao && falas.map((f) => (
        <Sequence key={f.id} from={f.inicio} durationInFrames={f.duracao + 15} name={`fala:${f.id}`} layout="none">
          <Html5Audio src={staticFile(`audio/narracao/${f.id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {musica ? <Html5Audio src={staticFile(MUSICA)} loop volume={volumeMusica} /> : null}
    </AbsoluteFill>
  );
};
