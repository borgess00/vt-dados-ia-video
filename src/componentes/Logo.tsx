import { Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { capturas } from "../capturas";
import { brilho, cores, fontes } from "../tema";

/** Logo da VT Dados IA com efeito neon "acendendo" (piscadas iniciais). */
export const LogoNeon: React.FC<{ tamanho?: number; inicio?: number }> = ({ tamanho = 1, inicio = 0 }) => {
  const frame = useCurrentFrame() - inicio;
  if (frame < 0) return null;
  // piscadas de neon ligando
  const piscadas = [0, 1, 0, 0, 1, 1, 0, 1];
  const ligado = frame < piscadas.length * 2 ? piscadas[Math.floor(frame / 2)] : 1;
  const respiracao = 0.85 + 0.15 * Math.sin(frame / 12);
  const forca = ligado ? respiracao : 0.08;

  if (capturas.logo) {
    return (
      <Img
        src={staticFile(capturas.logo)}
        style={{ height: 440 * tamanho, opacity: ligado ? 1 : 0.25, filter: `drop-shadow(0 0 ${18 * forca}px ${cores.roxo}) drop-shadow(0 0 ${40 * forca}px ${cores.roxo}aa)` }}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 * tamanho }}>
      <div
        style={{
          width: 230 * tamanho,
          height: 230 * tamanho,
          borderRadius: 48 * tamanho,
          border: `${8 * tamanho}px solid ${cores.neonAzul}`,
          boxShadow: ligado ? `${brilho(cores.neonAzul, forca * tamanho)}, inset 0 0 ${40 * tamanho}px ${cores.neonAzul}66` : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(5,20,40,0.6)",
          position: "relative",
        }}
      >
        <span
          style={{
            fontFamily: fontes.titulo,
            fontWeight: 900,
            fontSize: 118 * tamanho,
            color: ligado ? "#eaffff" : "#24435a",
            textShadow: ligado ? brilho(cores.neonVerde, forca * tamanho) : "none",
            letterSpacing: -4 * tamanho,
          }}
        >
          VT
        </span>
        {/* pontinhos de "dados" */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 26 * tamanho,
              left: (80 + i * 30) * tamanho,
              width: 14 * tamanho,
              height: 14 * tamanho,
              borderRadius: "50%",
              background: [cores.player, cores.banker, cores.empate][i],
              opacity: ligado ? 1 : 0.2,
              boxShadow: `0 0 ${10 * tamanho}px ${[cores.player, cores.banker, cores.empate][i]}`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          fontFamily: fontes.titulo,
          fontWeight: 900,
          fontSize: 64 * tamanho,
          letterSpacing: 8 * tamanho,
          color: ligado ? "#fff" : "#1d3346",
          textShadow: ligado ? brilho(cores.neonAzul, forca * 0.8 * tamanho) : "none",
          whiteSpace: "nowrap",
        }}
      >
        DADOS <span style={{ color: ligado ? cores.neonVerde : "#1d3346", textShadow: ligado ? brilho(cores.neonVerde, forca * tamanho) : "none" }}>IA</span>
      </div>
    </div>
  );
};

/** Partículas que convergem para o centro (formação do logo). */
export const ParticulasConvergindo: React.FC<{ cx: number; cy: number; inicio: number; duracao: number; raio: number }> = ({
  cx,
  cy,
  inicio,
  duracao,
  raio,
}) => {
  const frame = useCurrentFrame() - inicio;
  if (frame < 0 || frame > duracao + 20) return null;
  return (
    <>
      {Array.from({ length: 70 }, (_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const dist = raio * (0.6 + random(`d${i}`) * 0.8);
        const atraso = random(`t${i}`) * 8;
        const t = interpolate(frame - atraso, [0, duracao], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const e = 1 - Math.pow(1 - t, 3);
        const x = cx + Math.cos(ang) * dist * (1 - e);
        const y = cy + Math.sin(ang) * dist * (1 - e);
        const cor = i % 3 === 0 ? cores.neonVerde : cores.neonAzul;
        const op = interpolate(frame, [duracao, duracao + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const s = 3 + random(`s${i}`) * 5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - s,
              top: y - s,
              width: s * 2,
              height: s * 2,
              borderRadius: "50%",
              background: cor,
              boxShadow: `0 0 ${s * 4}px ${cor}`,
              opacity: op,
            }}
          />
        );
      })}
    </>
  );
};

/** Explosão de partículas para fora (no impacto do logo). */
export const ExplosaoParticulas: React.FC<{ cx: number; cy: number; inicio: number }> = ({ cx, cy, inicio }) => {
  const frame = useCurrentFrame() - inicio;
  if (frame < 0 || frame > 40) return null;
  return (
    <>
      {Array.from({ length: 40 }, (_, i) => {
        const ang = random(`ea${i}`) * Math.PI * 2;
        const vel = 8 + random(`ev${i}`) * 22;
        const d = vel * frame * (1 - frame / 80);
        const cor = i % 2 ? cores.neonVerde : cores.neonAzul;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + Math.cos(ang) * d,
              top: cy + Math.sin(ang) * d,
              width: 6,
              height: 6,
              borderRadius: 3,
              background: cor,
              boxShadow: `0 0 12px ${cor}`,
              opacity: 1 - frame / 40,
            }}
          />
        );
      })}
    </>
  );
};
