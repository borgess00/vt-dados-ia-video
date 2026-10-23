import { AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile } from "remotion";
import { Abertura } from "../cenas/Abertura";
import { AvisoFinal } from "../cenas/Avisos";
import { Encerramento } from "../cenas/Encerramento";
import { Fundo } from "../componentes/Fundo";
import { Legendas } from "../componentes/Legendas";
import { Som } from "../componentes/Som";
import { Transicao, type TipoEntrada } from "../componentes/Transicao";
import { CadPasso1, CadPasso2, CadPasso3, CadPasso4 } from "./Cenas";
import { tempoCadastro } from "./tempo";

const AberturaCadastro: React.FC = () => (
  <Abertura titulo="COMO SE|CADASTRAR NA" destaque="VT DADOS IA" subtitulo="Crie sua conta e assine em minutos" escalaTitulo={0.9} />
);

const CENAS: { id: string; componente: React.FC; entrada: TipoEntrada; semSaida?: boolean }[] = [
  { id: "abertura", componente: AberturaCadastro, entrada: "nenhuma" },
  { id: "passo-1", componente: CadPasso1, entrada: "glitch" },
  { id: "passo-2", componente: CadPasso2, entrada: "slide" },
  { id: "passo-3", componente: CadPasso3, entrada: "zoom" },
  { id: "passo-4", componente: CadPasso4, entrada: "slide" },
  // aviso final: sem efeito de entrada/saída para nunca cobrir o texto
  { id: "aviso-final", componente: AvisoFinal, entrada: "nenhuma", semSaida: true },
  { id: "encerramento", componente: Encerramento, entrada: "zoom" },
];

const MUSICA = "audio/nego-raul.mp3";
const VOLUME_MUSICA = 0.15;
const VOLUME_MUSICA_FALA = 0.05;
const VOLUME_MUSICA_SEM_VOZ = 0.2;

export type PropsCadastro = { musica: boolean; narracao: boolean };

export const Cadastro: React.FC<PropsCadastro> = ({ musica, narracao }) => {
  const { cenas, falas, total, cenaPorId } = tempoCadastro;
  const aviso = cenaPorId("aviso-final");

  const volumeMusica = (frame: number) => {
    let alvo = narracao ? VOLUME_MUSICA : VOLUME_MUSICA_SEM_VOZ;
    if (narracao) {
      // abaixa a música durante a narração
      for (const f of falas) {
        const dentro = interpolate(frame, [f.inicio - 6, f.inicio, f.inicio + f.duracao, f.inicio + f.duracao + 8], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        alvo = Math.min(alvo, VOLUME_MUSICA - (VOLUME_MUSICA - VOLUME_MUSICA_FALA) * dentro);
      }
    }
    if (frame >= aviso.inicio && frame < aviso.inicio + aviso.duracao) alvo *= 0.5;
    const entrada = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
    const saida = interpolate(frame, [total - 75, total - 5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return alvo * entrada * saida;
  };

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

      <Legendas legendas={tempoCadastro.legendas} />

      {narracao &&
        falas.map((f) => (
          <Sequence key={f.id} from={f.inicio} durationInFrames={f.duracao + 15} name={`fala:${f.id}`} layout="none">
            <Html5Audio src={staticFile(`audio/narracao-cadastro/${f.id}.wav`)} volume={1} />
          </Sequence>
        ))}
      {musica ? <Html5Audio src={staticFile(MUSICA)} loop volume={volumeMusica} /> : null}
    </AbsoluteFill>
  );
};
