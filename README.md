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

A narração é a gravação do VT Dados, cortada em uma faixa por frase em `public/audio/narracao/<id>.wav`
(os ids estão em `src/roteiro.json`). As durações ficam em `src/narracao.json`, e as legendas e o tempo
das cenas se ajustam a elas.

Para trocar uma frase, substitua o arquivo `.wav` dela e atualize a duração em `src/narracao.json`.

A voz sintética antiga (Piper TTS) ainda pode ser gerada com
`npm run narracao -- /caminho/pt-br-edresson-low.onnx`, mas isso sobrescreve a gravação.

## Música e efeitos

`npm run sons` sintetiza os efeitos (whoosh, impacto, clique, glitch, notificação, scan) e uma trilha
alternativa (`public/audio/musica.wav`).

A música de fundo é "Nego Raul" (`public/audio/nego-raul.mp3`, trecho de 0:00 a 1:30). Ela **não fica no git**,
porque é protegida por direitos autorais: coloque o arquivo nesse caminho antes de renderizar. A música e os
volumes ficam no começo de `src/Tutorial.tsx`, e o volume dos efeitos fica em `src/componentes/Som.tsx`.
