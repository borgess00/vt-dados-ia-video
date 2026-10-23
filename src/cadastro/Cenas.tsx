import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Retangulo } from "../capturas";
import { CaixaBrilho, CursorClique, SetaAnimada } from "../componentes/Destaques";
import { Instrucao, PassoBadge } from "../componentes/Textos";
import { Som } from "../componentes/Som";
import { Tela } from "../componentes/Tela";
import { ASSINATURA, ENTRADA, FATURA, TelaAssinatura, TelaEntrada, TelaFatura } from "../telas/Conta";
import { ENDERECO_SITE, PaginaSite } from "../telas/Site";
import { cores } from "../tema";
import { tempoCadastro } from "./tempo";

const { marca, fimFrase } = tempoCadastro;

const centro = (r: Retangulo) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
const suave = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;

/** Texto digitado aos poucos entre `inicio` e `inicio + duracao`. */
const digitar = (texto: string, frame: number, inicio: number, duracao: number) =>
  texto.slice(0, Math.round(interpolate(frame, [inicio, inicio + duracao], [0, texto.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));

const EMAIL = "seuemail@gmail.com";
const SENHA = "senha1234";

/* ───────────────────────── PASSO 1 – Criar conta ───────────────────────── */
export const CadPasso1: React.FC = () => {
  const frame = useCurrentFrame();
  const C = "passo-1";
  const m1 = marca(C, "c1-1");
  const m2 = marca(C, "c1-2");
  const m3 = marca(C, "c1-3");
  const cliqueAba = m1 + 36;
  const emailIni = m2 + 6;
  const senhaIni = m2 + 46;
  const confIni = m3 + 4;
  const cliqueCriar = fimFrase(C, "c1-3") - 6;

  const criar = frame >= cliqueAba;
  const foco = frame >= confIni ? "confirmar" : frame >= senhaIni ? "senha" : frame >= emailIni ? "email" : null;
  const camposRegiao = { x: ENTRADA.email.x, y: ENTRADA.email.y, w: ENTRADA.email.w, h: ENTRADA.senha.y + ENTRADA.senha.h - ENTRADA.email.y };

  return (
    <AbsoluteFill>
      <Som nome="clique" em={cliqueAba} />
      <Som nome="clique" em={cliqueCriar} volume={0.55} />
      <Som nome="pop" em={cliqueCriar + 4} volume={0.35} />
      <Tela endereco={ENDERECO_SITE} corBorda={cores.roxo}>
        <TelaEntrada
          aba={criar ? "criar" : "entrar"}
          email={digitar(EMAIL, frame, emailIni, 30)}
          senha={digitar(SENHA, frame, senhaIni, 24)}
          confirmar={digitar(SENHA, frame, confIni, 24)}
          foco={frame < cliqueCriar ? foco : null}
          apertado={frame >= cliqueCriar && frame < cliqueCriar + 6}
        />
        <SetaAnimada x={centro(ENTRADA.abaCriar).x} y={ENTRADA.abaCriar.y - 14} inicio={m1 + 4} fim={cliqueAba + 14} cor={cores.neonVerde} />
        <CursorClique de={{ x: 760, y: 900 }} para={{ x: centro(ENTRADA.abaCriar).x + 60, y: centro(ENTRADA.abaCriar).y + 8 }} inicio={m1 + 8} clique={cliqueAba} fim={cliqueAba + 20} />
        <CaixaBrilho r={camposRegiao} inicio={m2 + 2} fim={m3} cor={cores.neonAzul} />
        <SetaAnimada x={centro(ENTRADA.botaoCriar).x} y={ENTRADA.botaoCriar.y - 14} inicio={m3 + 10} fim={cliqueCriar + 16} cor={cores.neonVerde} />
        <CaixaBrilho r={ENTRADA.botaoCriar} inicio={m3 + 14} fim={cliqueCriar + 24} cor={cores.neonVerde} />
        <CursorClique
          de={{ x: 700, y: ENTRADA.confirmar.y + 40 }}
          para={{ x: centro(ENTRADA.botaoCriar).x + 180, y: centro(ENTRADA.botaoCriar).y + 10 }}
          inicio={m3 + 20}
          clique={cliqueCriar}
        />
      </Tela>
      <PassoBadge numero={1} />
      <Instrucao
        itens={[
          { de: m1, texto: "Toque em ‘Criar conta’" },
          { de: m2, texto: "Digite seu e-mail e crie uma senha" },
          { de: m3, texto: "Toque em ‘Criar minha conta’" },
        ]}
      />
    </AbsoluteFill>
  );
};

/* ───────────────────────── PASSO 2 – Assinatura ───────────────────────── */
export const CadPasso2: React.FC = () => {
  const frame = useCurrentFrame();
  const C = "passo-2";
  const m1 = marca(C, "c2-1");
  const m2 = marca(C, "c2-2");
  const nomeIni = m1 + 18;
  const cpfIni = m1 + 62;
  const cliqueAssinar = m2 + 34;
  const foco = frame >= cpfIni ? "cpf" : frame >= nomeIni ? "nome" : null;
  const campos = { x: ASSINATURA.nome.x, y: ASSINATURA.nome.y - 40, w: ASSINATURA.nome.w, h: ASSINATURA.cpf.y + ASSINATURA.cpf.h - ASSINATURA.nome.y + 40 };

  return (
    <AbsoluteFill>
      <Som nome="clique" em={cliqueAssinar} volume={0.55} />
      <Som nome="pop" em={cliqueAssinar + 4} volume={0.35} />
      <Tela endereco={ENDERECO_SITE} corBorda={cores.roxo}>
        <TelaAssinatura
          nome={digitar("João da Silva", frame, nomeIni, 26)}
          cpf={digitar("12345678900", frame, cpfIni, 24)}
          foco={frame < cliqueAssinar ? foco : null}
          apertado={frame >= cliqueAssinar && frame < cliqueAssinar + 6}
        />
        <CaixaBrilho r={campos} inicio={m1 + 6} fim={m2} cor={cores.neonAzul} />
        <SetaAnimada x={centro(ASSINATURA.botao).x} y={ASSINATURA.botao.y - 14} inicio={m2} fim={cliqueAssinar + 16} cor={cores.neonVerde} />
        <CaixaBrilho r={ASSINATURA.botao} inicio={m2 + 4} fim={cliqueAssinar + 26} cor={cores.neonVerde} />
        <CursorClique
          de={{ x: 720, y: ASSINATURA.cpf.y + 40 }}
          para={{ x: centro(ASSINATURA.botao).x + 160, y: centro(ASSINATURA.botao).y + 10 }}
          inicio={m2 + 8}
          clique={cliqueAssinar}
        />
      </Tela>
      <PassoBadge numero={2} />
      <Instrucao
        itens={[
          { de: m1, texto: "Preencha nome completo e CPF" },
          { de: m2, texto: "Toque em ‘Assinar’" },
        ]}
      />
    </AbsoluteFill>
  );
};

/* ───────────────────────── PASSO 3 – Pagamento ───────────────────────── */

/** Câmera: coloca o ponto (cx, cy) da página no centro da tela, com zoom z. */
const Camera: React.FC<{ cx: number; cy: number; z: number; children: React.ReactNode }> = ({ cx, cy, z, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 1036, transformOrigin: "0 0", transform: `scale(${z}) translate(${-cx + 450 / z}px, ${-cy + 518 / z}px)` }}>
    {children}
  </div>
);

export const CadPasso3: React.FC = () => {
  const frame = useCurrentFrame();
  const C = "passo-3";
  const m1 = marca(C, "c3-1");
  const m2 = marca(C, "c3-2");
  const cliquePix = m2 + 14;

  // visão geral -> formas de pagamento -> área do Pix
  const quadros = [
    { f: 0, cx: 450, cy: 518, z: 1 },
    { f: m1 + 40, cx: 450, cy: 518, z: 1 },
    { f: m1 + 66, cx: 400, cy: FATURA.formas.y + 40, z: 1.45 },
    { f: cliquePix + 8, cx: 400, cy: FATURA.formas.y + 40, z: 1.45 },
    { f: cliquePix + 34, cx: 640, cy: FATURA.qrCode.y + 100, z: 1.55 },
  ];
  const ts = quadros.map((q) => q.f);
  const cam = (k: "cx" | "cy" | "z") => interpolate(frame, ts, quadros.map((q) => q[k]), suave);

  return (
    <AbsoluteFill>
      <Som nome="whoosh" em={m1 + 40} volume={0.15} />
      <Som nome="clique" em={cliquePix} volume={0.55} />
      <Som nome="whoosh" em={cliquePix + 8} volume={0.15} />
      <Tela endereco="pagamento seguro" corBorda={cores.roxo}>
        <Camera cx={cam("cx")} cy={cam("cy")} z={cam("z")}>
          <TelaFatura pix={frame >= cliquePix + 2} />
          <CaixaBrilho r={FATURA.valor} inicio={m1 + 6} fim={m1 + 44} cor={cores.roxo} />
          <CaixaBrilho r={FATURA.formas} inicio={m1 + 66} fim={cliquePix + 6} cor={cores.roxo} />
          <CursorClique
            de={{ x: FATURA.botaoPix.x + 160, y: FATURA.botaoPix.y + 120 }}
            para={{ x: centro(FATURA.botaoPix).x + 10, y: centro(FATURA.botaoPix).y + 4 }}
            inicio={m2 - 6}
            clique={cliquePix}
            fim={cliquePix + 20}
          />
          <CaixaBrilho r={FATURA.qrCode} inicio={cliquePix + 36} cor={cores.roxo} />
          <CaixaBrilho r={FATURA.copiarCodigo} inicio={cliquePix + 64} cor={cores.roxo} />
        </Camera>
      </Tela>
      <PassoBadge numero={3} />
      <Instrucao
        itens={[
          { de: m1, texto: "Escolha a forma de pagamento" },
          { de: m2, texto: "Pix: leia o QR Code ou copie o código" },
        ]}
      />
    </AbsoluteFill>
  );
};

/* ───────────────────────── PASSO 4 – Acessar ───────────────────────── */
export const CadPasso4: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const C = "passo-4";
  const m1 = marca(C, "c4-1");
  const emailIni = m1 + 8;
  const senhaIni = m1 + 40;
  const cliqueEntrar = m1 + 72;
  const troca = cliqueEntrar + 12;
  const slide = interpolate(frame, [troca, troca + 12], [0, 1], suave);
  const foco = frame >= senhaIni ? "senha" : frame >= emailIni ? "email" : null;

  return (
    <AbsoluteFill>
      <Som nome="clique" em={cliqueEntrar} volume={0.55} />
      <Som nome="whoosh" em={troca} volume={0.25} />
      {frame < troca + 12 ? (
        <AbsoluteFill style={{ transform: `translateX(${-slide * width}px)` }}>
          <Tela endereco={ENDERECO_SITE} corBorda={cores.roxo}>
            <TelaEntrada
              aba="entrar"
              email={digitar(EMAIL, frame, emailIni, 26)}
              senha={digitar(SENHA, frame, senhaIni, 20)}
              foco={frame < cliqueEntrar ? foco : null}
              apertado={frame >= cliqueEntrar && frame < cliqueEntrar + 6}
            />
            <CursorClique
              de={{ x: 700, y: ENTRADA.senha.y + 40 }}
              para={{ x: centro(ENTRADA.botaoEntrar).x + 160, y: centro(ENTRADA.botaoEntrar).y + 10 }}
              inicio={m1 + 40}
              clique={cliqueEntrar}
            />
          </Tela>
        </AbsoluteFill>
      ) : null}
      {frame >= troca ? (
        <AbsoluteFill style={{ transform: `translateX(${(1 - slide) * width}px)` }}>
          <Tela endereco={ENDERECO_SITE} corBorda={cores.neonVerde}>
            <PaginaSite />
          </Tela>
        </AbsoluteFill>
      ) : null}
      <PassoBadge numero={4} />
      <Instrucao itens={[{ de: m1, texto: "Entre com seu e-mail e senha" }]} />
    </AbsoluteFill>
  );
};
