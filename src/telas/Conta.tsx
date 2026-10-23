import { Img, staticFile, useCurrentFrame } from "remotion";
import type { Retangulo } from "../capturas";
import { fontes } from "../tema";

/**
 * Telas de cadastro recriadas a partir dos prints reais (versão celular, 900px de largura):
 * criar conta / entrar, assinatura semanal e a fatura de pagamento (prints com dados borrados).
 */

const roxo = "#8b5cf6";
const S = {
  fundo: "#040a1a",
  cartao: "linear-gradient(180deg, #0a1530, #070f24)",
  borda: "#1c3366",
  texto: "#e8eefc",
  suave: "#9fb0d0",
  campo: "#0b1a3a",
  gradiente: "linear-gradient(90deg, #7c3aed, #2f7bff)",
  azul: "linear-gradient(90deg, #1f6fff, #0b55e6)",
  escuro: "#0b1d44",
};

const ret = (x: number, y: number, w: number, h: number): Retangulo => ({ x, y, w, h });

const Titulo: React.FC<{ tamanho: number }> = ({ tamanho }) => (
  <div style={{ fontFamily: fontes.texto, fontWeight: 900, fontSize: tamanho, letterSpacing: 1, textAlign: "center" }}>
    <span style={{ color: "#f2f0ff", textShadow: `0 0 18px ${roxo}` }}>VTzin </span>
    <span style={{ color: "#a77bff", textShadow: `0 0 22px ${roxo}, 0 0 40px ${roxo}` }}>BAC BO LIVE</span>
  </div>
);

const Campo: React.FC<{ r: Retangulo; valor: string; placeholder: string; foco?: boolean; senha?: boolean }> = ({ r, valor, placeholder, foco, senha }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: r.x,
        top: r.y,
        width: r.w,
        height: r.h,
        borderRadius: 16,
        border: `2px solid ${foco ? "#6d8dff" : S.borda}`,
        boxShadow: foco ? "0 0 0 4px rgba(109,141,255,0.18)" : undefined,
        background: S.campo,
        display: "flex",
        alignItems: "center",
        padding: "0 22px",
        boxSizing: "border-box",
        fontFamily: fontes.texto,
        fontWeight: 600,
        fontSize: 26,
        color: valor ? "#fff" : "#7f93bb",
        letterSpacing: senha && valor ? 4 : 0,
      }}
    >
      {valor ? (senha ? "•".repeat(valor.length) : valor) : placeholder}
      {foco ? <span style={{ width: 3, height: 32, marginLeft: 3, background: "#fff", opacity: frame % 16 < 8 ? 1 : 0 }} /> : null}
    </div>
  );
};

const Rotulo: React.FC<{ y: number; x: number; children: React.ReactNode }> = ({ x, y, children }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: fontes.texto, fontWeight: 600, fontSize: 22, color: S.texto }}>{children}</div>
);

const Botao: React.FC<{ r: Retangulo; fundo: string; apertado?: boolean; borda?: boolean; tamanho?: number; children: React.ReactNode }> = ({
  r,
  fundo,
  apertado,
  borda,
  tamanho = 26,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: r.x,
      top: r.y,
      width: r.w,
      height: r.h,
      borderRadius: 16,
      background: fundo,
      border: borda ? `2px solid ${S.borda}` : "none",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: fontes.texto,
      fontWeight: 900,
      fontSize: tamanho,
      color: "#fff",
      boxShadow: apertado ? "0 0 34px rgba(255,255,255,0.45)" : fundo === S.gradiente ? "0 10px 28px rgba(124,58,237,0.35)" : undefined,
      transform: `scale(${apertado ? 0.95 : 1})`,
      filter: apertado ? "brightness(1.3)" : undefined,
    }}
  >
    {children}
  </div>
);

/* ───────────── Criar conta / Entrar ───────────── */

const CX = 60;
const CW = 780;
const CY = 110;
const P = 44;
const IW = CW - P * 2;

export const ENTRADA = {
  abaEntrar: ret(CX + P, CY + 170, (IW - 16) / 2, 76),
  abaCriar: ret(CX + P + (IW + 16) / 2, CY + 170, (IW - 16) / 2, 76),
  email: ret(CX + P, CY + 306, IW, 84),
  senha: ret(CX + P, CY + 442, IW, 84),
  confirmar: ret(CX + P, CY + 578, IW, 84),
  botaoCriar: ret(CX + P, CY + 690, IW, 84),
  botaoEntrar: ret(CX + P, CY + 554, IW, 84),
};

export type EstadoEntrada = {
  aba: "entrar" | "criar";
  email?: string;
  senha?: string;
  confirmar?: string;
  foco?: "email" | "senha" | "confirmar" | null;
  apertado?: boolean;
};

export const TelaEntrada: React.FC<EstadoEntrada> = ({ aba, email = "", senha = "", confirmar = "", foco = null, apertado }) => {
  const criar = aba === "criar";
  const altura = criar ? 830 : 700;
  return (
    <div style={{ position: "relative", width: 900, height: 1036, background: `radial-gradient(ellipse at 50% 0%, #17306a 0%, ${S.fundo} 60%)`, color: S.texto }}>
      <div
        style={{
          position: "absolute",
          left: CX,
          top: CY,
          width: CW,
          height: altura,
          borderRadius: 30,
          border: "2px solid #3b2a7a",
          background: "linear-gradient(180deg, rgba(12,20,48,0.95), rgba(6,12,32,0.95))",
          boxShadow: "0 0 40px rgba(124,58,237,0.18)",
        }}
      />
      <div style={{ position: "absolute", left: CX, width: CW, top: CY + 40 }}>
        <Titulo tamanho={50} />
        <div style={{ marginTop: 10, textAlign: "center", fontFamily: fontes.texto, fontWeight: 600, fontSize: 18, letterSpacing: 5, color: S.suave }}>ANÁLISE DE PADRÕES</div>
      </div>
      <Botao r={ENTRADA.abaEntrar} fundo={criar ? S.fundo : S.gradiente} borda={criar}>
        Entrar
      </Botao>
      <Botao r={ENTRADA.abaCriar} fundo={criar ? S.gradiente : S.fundo} borda={!criar}>
        Criar conta
      </Botao>
      <Rotulo x={CX + P} y={ENTRADA.email.y - 32}>
        E-mail
      </Rotulo>
      <Campo r={ENTRADA.email} valor={email} placeholder="Seu e-mail" foco={foco === "email"} />
      <Rotulo x={CX + P} y={ENTRADA.senha.y - 32}>
        {criar ? "Criar senha" : "Senha"}
      </Rotulo>
      <Campo r={ENTRADA.senha} valor={senha} placeholder={criar ? "Mínimo de 8 caracteres" : "Sua senha"} foco={foco === "senha"} senha />
      {criar ? (
        <>
          <Rotulo x={CX + P} y={ENTRADA.confirmar.y - 32}>
            Confirmar senha
          </Rotulo>
          <Campo r={ENTRADA.confirmar} valor={confirmar} placeholder="Digite a senha novamente" foco={foco === "confirmar"} senha />
          <Botao r={ENTRADA.botaoCriar} fundo={S.gradiente} apertado={apertado}>
            CRIAR MINHA CONTA
          </Botao>
        </>
      ) : (
        <Botao r={ENTRADA.botaoEntrar} fundo={S.gradiente} apertado={apertado}>
          ENTRAR
        </Botao>
      )}
    </div>
  );
};

/* ───────────── Assinatura semanal ───────────── */

const X = 24;
const W = 852;
const AP = 28;
const AIW = W - AP * 2;
const AY = 280;

export const ASSINATURA = {
  nome: ret(X + AP, AY + 196, AIW, 76),
  cpf: ret(X + AP, AY + 326, AIW, 76),
  botao: ret(X + AP, AY + 426, AIW, 80),
};

export const TelaAssinatura: React.FC<{ nome?: string; cpf?: string; foco?: "nome" | "cpf" | null; apertado?: boolean }> = ({
  nome = "",
  cpf = "",
  foco = null,
  apertado,
}) => (
  <div style={{ position: "relative", width: 900, height: 1036, background: `radial-gradient(ellipse at 50% 0%, #0d1f4a 0%, ${S.fundo} 45%)`, fontFamily: fontes.texto, color: S.texto }}>
    <div style={{ position: "absolute", top: 22, width: "100%" }}>
      <Titulo tamanho={66} />
    </div>
    <div style={{ position: "absolute", top: 124, width: "100%", textAlign: "center", fontSize: 20, fontWeight: 600, letterSpacing: 6, color: S.suave }}>BAC BO · ANÁLISE DE PADRÕES</div>
    <div style={{ position: "absolute", top: 172, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "12px 22px", borderRadius: 14, border: `2px solid ${S.borda}`, background: S.escuro, fontWeight: 900, fontSize: 22 }}>Sair da conta</div>
    </div>
    <div style={{ position: "absolute", left: X, width: W, top: 250, height: 2, background: S.borda }} />

    <div style={{ position: "absolute", left: X, top: AY, width: W, height: 540, borderRadius: 24, border: `2px solid ${S.borda}`, background: S.cartao, boxSizing: "border-box", padding: `26px ${AP}px` }}>
      <div style={{ fontSize: 31, fontWeight: 900 }}>Assinatura semanal</div>
      <div style={{ marginTop: 12, fontSize: 21, lineHeight: 1.45, fontWeight: 600, color: "#c3d0f0" }}>
        Acesso à análise estatística por 7 dias: R$ 18,99 por semana. A análise não prevê resultados e não garante ganhos.
      </div>
    </div>
    <Rotulo x={X + AP} y={ASSINATURA.nome.y - 32}>
      Nome completo
    </Rotulo>
    <Campo r={ASSINATURA.nome} valor={nome} placeholder="Seu nome completo" foco={foco === "nome"} />
    <Rotulo x={X + AP} y={ASSINATURA.cpf.y - 32}>
      CPF ou CNPJ (só números)
    </Rotulo>
    <Campo r={ASSINATURA.cpf} valor={cpf} placeholder="Somente números" foco={foco === "cpf"} />
    <Botao r={ASSINATURA.botao} fundo={S.azul} apertado={apertado}>
      Assinar
    </Botao>

    <div style={{ position: "absolute", left: X, top: AY + 580, width: W, textAlign: "center", fontSize: 18, fontWeight: 600, color: "#7d8db0", lineHeight: 1.5 }}>
      VTzin Bac Bo Live · Análise estatística experimental · Resultados aleatórios podem quebrar qualquer padrão observado.
    </div>
    <div style={{ position: "absolute", left: X, top: AY + 680, width: W, textAlign: "center", fontSize: 20, fontWeight: 600, color: S.texto }}>▸ Termos de Uso e Política de Privacidade</div>
  </div>
);

/* ───────────── Fatura (prints reais, dados do comprador borrados) ───────────── */

/** escala do print da fatura (1124px de largura) para a página de 900px */
const E = 900 / 1124;
const PIX_Y = (655 - 26) * E;

export const FATURA = {
  valor: ret(28 * E, 121 * E, 255 * E, 134 * E),
  formas: ret(27 * E, 692 * E, 740 * E, 40 * E),
  botaoPix: ret(235 * E, 692 * E, 95 * E, 40 * E),
  qrCode: ret(618 * E - 25 * E, PIX_Y + 185 * E, 162 * E, 160 * E),
  copiarCodigo: ret(925 * E - 25 * E, PIX_Y + 452 * E, 180 * E, 40 * E),
  alturaPagina: PIX_Y + 535 * E,
};

export const TelaFatura: React.FC<{ pix: boolean }> = ({ pix }) => (
  <div style={{ position: "relative", width: 900, height: 1500, background: "#fbfbfc", overflow: "hidden" }}>
    <Img src={staticFile("capturas/fatura.png")} style={{ position: "absolute", left: 0, top: 0, width: 900 }} />
    {pix ? (
      <>
        <div style={{ position: "absolute", left: 0, top: 495, width: 900, height: 600, background: "#fbfbfc" }} />
        <Img src={staticFile("capturas/pix.png")} style={{ position: "absolute", left: -25 * E, top: PIX_Y, width: 1204 * E }} />
      </>
    ) : null}
  </div>
);
