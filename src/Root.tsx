import { Composition, Still } from "remotion";
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
      <Still id="Post-Instagram" component={PostInstagram} width={1080} height={1350} />
    </>
  );
};
