# Tutorial VT Dados IA (Remotion)

Vídeo "Como usar a VT Dados IA" em duas versões:

| Composição            | Formato          | Uso                    |
| --------------------- | ---------------- | ---------------------- |
| `Tutorial-Vertical`   | 1080×1920 (9:16) | Reels / TikTok / Shorts |
| `Tutorial-Horizontal` | 1920×1080 (16:9) | YouTube                |

## Comandos

```bash
npm run dev                 # abre o Remotion Studio (pré-visualização ao vivo)
npm run render:vertical     # gera out/vt-dados-ia-tutorial-9x16.mp4
npm run render:horizontal   # gera out/vt-dados-ia-tutorial-16x9.mp4
```

## Estrutura

- `src/roteiro.json` define a ordem das cenas, o texto falado (`fala`) e as legendas (`legenda`; palavras entre `*` ficam em destaque). A duração de cada cena é calculada a partir da duração real da narração.
- `src/cenas/` tem a abertura, os avisos, os passos 1 a 5 e o encerramento.
- `src/telas/` tem a tela do Bac Bo e o site recriado.
- `src/capturas.ts` define os prints reais e o logo.
- `public/audio/` guarda a narração, a música e os efeitos (todos gerados pelos scripts em `scripts/`).

## Telas

- O **site** é recriado em `src/telas/Site.tsx` a partir dos prints reais, com os mesmos textos, botões e seções na mesma ordem.
- O **gráfico do Bac Bo** (`public/capturas/bacbo-grafico.png`) e a **ordem de leitura** (`public/capturas/ordem-de-leitura.png`) são prints reais.
- O resto da tela do Bac Bo é ilustrativo e aparece com o selo "TELA ILUSTRATIVA". Para usar um print da tela inteira, preencha `bacbo` em `src/capturas.ts`, ou desligue o selo em `mostrarSeloIlustrativo`.
- Para usar o logo oficial, salve o PNG em `public/capturas/` e preencha `logo` em `src/capturas.ts`.

## Narração

A narração provisória é gerada com Piper TTS (voz `pt-br-edresson-low`):

```bash
pip install piper-tts numpy
npm run narracao -- /caminho/pt-br-edresson-low.onnx
```

Para usar uma voz gravada ou de outro serviço, salve um arquivo por frase em
`public/audio/narracao/<id>.wav` (os ids estão em `src/roteiro.json`) e atualize as durações em
`src/narracao.json`. As legendas e o tempo das cenas se ajustam sozinhos.

## Música e efeitos

`npm run sons` sintetiza a trilha (loop de 120 BPM) e os efeitos (whoosh, impacto, clique, glitch,
notificação, scan). Não há arquivos de terceiros, então não há problema de direitos autorais.
