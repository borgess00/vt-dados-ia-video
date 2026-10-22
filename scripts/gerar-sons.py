"""Sintetiza a trilha e os efeitos sonoros do vídeo (sem samples externos, sem direitos autorais).

Uso:
  python3 scripts/gerar-sons.py

Saídas em public/audio/:
  musica.wav (loop de 16s, 120 BPM), whoosh.wav, impacto.wav, clique.wav,
  glitch.wav, pop.wav, notificacao.wav, scan.wav
"""

import wave
from pathlib import Path

import numpy as np

TAXA = 44100
SAIDA = Path(__file__).resolve().parent.parent / "public" / "audio"
rng = np.random.default_rng(7)


def t(seg):
    return np.arange(int(seg * TAXA)) / TAXA


def salvar(nome, x, pico=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * pico
    with wave.open(str(SAIDA / nome), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(TAXA)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def passa_baixa(x, corte):
    """Filtro de um polo com corte variável (corte pode ser escalar ou array em Hz)."""
    corte = np.broadcast_to(corte, x.shape)
    a = 1 - np.exp(-2 * np.pi * corte / TAXA)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def passa_alta(x, corte):
    return x - passa_baixa(x, corte)


def envelope(n, ataque, queda):
    tt = np.arange(n) / TAXA
    return np.minimum(1, tt / max(ataque, 1e-4)) * np.exp(-tt / queda)


def eco(x, atraso=0.11, ganho=0.35, repeticoes=4):
    y = np.concatenate([x, np.zeros(int(atraso * TAXA * repeticoes))])
    for k in range(1, repeticoes + 1):
        d = int(atraso * TAXA * k)
        y[d : d + len(x)] += x * ganho**k
    return y


def whoosh():
    tt = t(0.7)
    ruido = rng.standard_normal(len(tt))
    forma = np.sin(np.pi * tt / tt[-1]) ** 2
    corte = 300 + 5200 * np.sin(np.pi * np.clip(tt / 0.55, 0, 1)) ** 2
    return passa_alta(passa_baixa(ruido, corte), 150) * forma


def impacto():
    tt = t(1.4)
    freq = 38 + 50 * np.exp(-tt * 18)
    grave = np.sin(2 * np.pi * np.cumsum(freq) / TAXA) * np.exp(-tt * 3.2)
    estalo = passa_baixa(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 30)
    return eco(grave * 1.0 + estalo * 0.6, 0.09, 0.25, 3)


def clique():
    tt = t(0.07)
    return (np.sin(2 * np.pi * 2400 * tt) * 0.6 + rng.standard_normal(len(tt)) * 0.4) * np.exp(-tt * 140)


def glitch():
    partes = []
    for _ in range(7):
        dur = rng.uniform(0.015, 0.045)
        tt = t(dur)
        f = rng.uniform(200, 3000)
        s = np.sign(np.sin(2 * np.pi * f * tt)) * 0.5 + rng.standard_normal(len(tt)) * 0.5
        s = np.round(s * 4) / 4  # bitcrush
        partes.append(s * rng.uniform(0.3, 1))
        partes.append(np.zeros(int(rng.uniform(0.003, 0.02) * TAXA)))
    return passa_alta(np.concatenate(partes), 300)


def pop():
    tt = t(0.14)
    f = 500 + 1400 * (tt / tt[-1])
    return np.sin(2 * np.pi * np.cumsum(f) / TAXA) * envelope(len(tt), 0.004, 0.05)


def notificacao():
    def tom(f, dur):
        tt = t(dur)
        return (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)) * envelope(len(tt), 0.005, 0.25)

    a = tom(988, 0.5)
    b = tom(1480, 0.9)
    y = np.zeros(int(1.2 * TAXA))
    y[: len(a)] += a
    d = int(0.13 * TAXA)
    y[d : d + len(b)] += b
    return eco(y, 0.12, 0.25, 3)


def scan():
    y = np.zeros(int(2.6 * TAXA))
    passo = int(0.075 * TAXA)
    for i, p in enumerate(range(0, len(y) - passo, passo)):
        f = [1200, 1800, 1500, 2200, 1300, 2600][i % 6]
        tt = t(0.04)
        y[p : p + len(tt)] += np.sin(2 * np.pi * f * tt) * envelope(len(tt), 0.002, 0.012) * 0.5
    tt = t(2.6)
    zumbido = np.sin(2 * np.pi * (90 + 30 * tt) * tt) * 0.15
    return y + zumbido


def musica():
    bpm = 120
    batida = 60 / bpm
    compassos = 8
    total = int(compassos * 4 * batida * TAXA)
    y = np.zeros(total)
    # Lá menor - Fá - Dó - Sol (2 compassos cada)
    raizes = [55.0, 43.65, 65.41, 49.0]
    arpejos = [[220, 261.63, 329.63, 440], [174.61, 220, 261.63, 349.23],
               [261.63, 329.63, 392, 523.25], [196, 246.94, 293.66, 392]]

    for b in range(compassos * 4):
        ini = int(b * batida * TAXA)
        tt = t(0.35)
        f = 45 + 90 * np.exp(-tt * 30)
        kick = np.sin(2 * np.pi * np.cumsum(f) / TAXA) * np.exp(-tt * 9)
        y[ini : ini + len(kick)] += kick * 0.9
        # chimbal no contratempo
        meio = ini + int(batida / 2 * TAXA)
        th = t(0.06)
        hat = rng.standard_normal(len(th)) * np.exp(-th * 70)
        y[meio : meio + len(hat)] += np.diff(hat, prepend=0) * 0.35

    for c in range(compassos * 8):  # colcheias
        ini = int(c * batida / 2 * TAXA)
        acorde = (c // 16) % 4
        tt = t(batida / 2)
        # baixo pulsante com "sidechain" do bumbo
        f = raizes[acorde]
        baixo = (2 * ((f * tt) % 1) - 1) * envelope(len(tt), 0.01, 0.12)
        y[ini : ini + len(baixo)] += passa_baixa(baixo, 400) * 0.55
        # arpejo plucado
        nota = arpejos[acorde][[0, 2, 1, 3, 2, 1, 3, 2][c % 8]]
        saw = (2 * ((nota * tt) % 1) - 1) + 0.5 * np.sin(2 * np.pi * nota * 2 * tt)
        y[ini : ini + len(saw)] += passa_baixa(saw * envelope(len(tt), 0.003, 0.09), 2200) * 0.22

    # pad suave
    tt = np.arange(total) / TAXA
    pad = np.zeros(total)
    for i, notas in enumerate(arpejos):
        seg = slice(int(i * 2 * 4 * batida * TAXA), int((i + 1) * 2 * 4 * batida * TAXA))
        for n in notas[:3]:
            pad[seg] += np.sin(2 * np.pi * n / 2 * tt[seg]) + 0.4 * np.sin(2 * np.pi * n * 1.003 * tt[seg])
    y += passa_baixa(pad, 900) * 0.05
    return y


if __name__ == "__main__":
    SAIDA.mkdir(parents=True, exist_ok=True)
    salvar("whoosh.wav", whoosh(), 0.8)
    salvar("impacto.wav", impacto())
    salvar("clique.wav", clique(), 0.7)
    salvar("glitch.wav", glitch(), 0.5)
    salvar("pop.wav", pop(), 0.6)
    salvar("notificacao.wav", notificacao(), 0.8)
    salvar("scan.wav", scan(), 0.6)
    salvar("musica.wav", musica(), 0.85)
    print("Sons gerados em", SAIDA)
