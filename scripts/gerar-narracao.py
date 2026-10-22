"""Gera a narração (uma faixa por frase) a partir de src/roteiro.json usando Piper TTS.

Uso:
  python3 scripts/gerar-narracao.py --modelo /caminho/pt-br-edresson-low.onnx

Saídas:
  public/audio/narracao/<id>.wav   (silêncio do início/fim removido)
  src/narracao.json                (duração de cada frase, em segundos)
"""

import argparse
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
ROTEIRO = RAIZ / "src" / "roteiro.json"
SAIDA_AUDIO = RAIZ / "public" / "audio" / "narracao"
SAIDA_JSON = RAIZ / "src" / "narracao.json"


def ler_wav(caminho: Path):
    with wave.open(str(caminho), "rb") as w:
        taxa = w.getframerate()
        dados = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    return taxa, dados


def salvar_wav(caminho: Path, taxa: int, dados: np.ndarray):
    with wave.open(str(caminho), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(taxa)
        w.writeframes(dados.astype(np.int16).tobytes())


def cortar_silencio(taxa: int, dados: np.ndarray, limiar=500, folga=0.04):
    alto = np.where(np.abs(dados) > limiar)[0]
    if len(alto) == 0:
        return dados
    margem = int(taxa * folga)
    return dados[max(0, alto[0] - margem) : min(len(dados), alto[-1] + margem)]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--modelo", required=True, help="arquivo .onnx da voz Piper")
    parser.add_argument("--velocidade", type=float, default=0.9, help="< 1 fala mais rápido")
    args = parser.parse_args()

    roteiro = json.loads(ROTEIRO.read_text(encoding="utf-8"))
    SAIDA_AUDIO.mkdir(parents=True, exist_ok=True)
    duracoes = {}

    for cena in roteiro["cenas"]:
        for frase in cena["frases"]:
            with tempfile.TemporaryDirectory() as tmp:
                bruto = Path(tmp) / "bruto.wav"
                subprocess.run(
                    [
                        sys.executable, "-m", "piper",
                        "-m", args.modelo,
                        "-f", str(bruto),
                        "--length-scale", str(args.velocidade),
                        "--sentence-silence", "0.25",
                    ],
                    input=frase["fala"].encode("utf-8"),
                    check=True,
                    stderr=subprocess.DEVNULL,
                )
                taxa, dados = ler_wav(bruto)
            dados = cortar_silencio(taxa, dados)
            salvar_wav(SAIDA_AUDIO / f"{frase['id']}.wav", taxa, dados)
            duracoes[frase["id"]] = round(len(dados) / taxa, 3)
            print(f"{frase['id']:>16}  {duracoes[frase['id']]:5.2f}s  {frase['fala']}")

    SAIDA_JSON.write_text(json.dumps(duracoes, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\nTotal de fala: {sum(duracoes.values()):.1f}s -> {SAIDA_JSON.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
