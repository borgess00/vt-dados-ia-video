import { Composition, Still } from "remotion";
import { Cadastro } from "./cadastro/Cadastro";
import { tempoCadastro } from "./cadastro/tempo";
import { PostInstagram } from "./post/PostInstagram";
import { Tutorial } from "./Tutorial";
import { linhaDoTempo } from "./tempo";
import { FPS } from "./tema";

// Duas versões do mesmo vídeo: vertical (Reels/TikTok/Shorts) e horizontal (YouTube).
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Tutorial-Vertical"
        component={Tutorial}
        durationInFrames={linhaDoTempo.total}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ musica: true }}
      />
      <Composition
        id="Tutorial-Horizontal"
        component={Tutorial}
        durationInFrames={linhaDoTempo.total}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ musica: true }}
      />
      {/* "Como se cadastrar": sem narração até a gravação chegar */}
      <Composition
        id="Cadastro-Vertical"
        component={Cadastro}
        durationInFrames={tempoCadastro.total}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ musica: true, narracao: false }}
      />
      <Composition
        id="Cadastro-Horizontal"
        component={Cadastro}
        durationInFrames={tempoCadastro.total}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ musica: true, narracao: false }}
      />
      <Still id="Post-Instagram" component={PostInstagram} width={1080} height={1350} />
    </>
  );
};
