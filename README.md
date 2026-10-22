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
- `src/telas/` tem as telas **ilustrativas** do Bac Bo e do site.
- `src/capturas.ts` serve para trocar as telas ilustrativas pelas capturas reais (veja abaixo).
- `public/audio/` guarda a narração, a música e os efeitos (todos gerados pelos scripts em `scripts/`).

## Trocar pelas telas reais

1. Tire um print da tela do Bac Bo e um print da página inteira do site (rolagem completa).
2. Salve os prints em `public/capturas/`.
3. Em `src/capturas.ts`, preencha `bacbo` e `site` com o nome do arquivo e as posições das áreas destacadas. As posições são em pixels, considerando a imagem com 900 px de largura.
4. Mude `mostrarSeloIlustrativo` para `false`.
5. Se tiver o logo em PNG, preencha `logo`.

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
