# Nossa História ❤️

Site estático, sem framework. **Primeiro carregamento: 12,2 KB** (HTML + CSS + JS, tudo inline,
uma única requisição). As fotos entram depois, sob demanda.

## Rodar

```bash
npm install          # só o sharp, usado para otimizar as fotos
npm run all          # otimiza as imagens + monta o dist/
npm run serve        # sobe o dist/ e mostra o IP pra abrir no celular
```

- `npm run images` — regera `dist/images/` a partir de `originals/` (só precisa rodar quando trocar fotos)
- `npm run build` — regera `dist/index.html`
- `npm run dev` — build + servidor

## Estrutura

```
originals/                 fotos originais (29,5 MB) — NÃO vão pro ar
src/page.html              template: HTML + CSS + JS da página inteira
src/data/storyData.js      os textos da linha do tempo
scripts/optimize-images.mjs  gera AVIF + WebP e extrai a cor dominante
scripts/serve.mjs          servidor estático com gzip
build.mjs                  junta template + textos + imagens -> dist/index.html
image-manifest.json        dimensões e cor de cada foto (gerado)
dist/                      >>> é isso que vai pro ar <<<
legacy-react/              versão React antiga, guardada só por precaução
```

## Editar

- **Textos e ordem dos momentos:** `src/data/storyData.js` → `npm run build`
- **Layout, cores, animações:** `src/page.html` → `npm run build`
- **Trocar/adicionar foto:** joga o arquivo em `originals/`, aponta o campo `image` no
  `storyData.js` para ele e roda `npm run all`

## Publicar

Suba **só a pasta `dist/`** (Vercel, Netlify, GitHub Pages, Cloudflare Pages — qualquer um serve).
Não precisa de build no servidor.

Para o carregamento ficar realmente em ~12 KB, o servidor precisa entregar o HTML com
**gzip ou brotli** — todas as hospedagens citadas fazem isso sozinhas.

## Decisões de performance

| | |
|---|---|
| Sem React / GSAP / Tailwind / react-icons | eram ~85 KB gzip só de JS; tudo virou CSS + ~2 KB de JS |
| Sem Google Fonts | eliminava 2 preconnects, 1 CSS e ~60 KB de fontes bloqueando o render |
| CSS e JS inline | uma requisição só: a página pinta no primeiro round-trip |
| AVIF + WebP, lado maior 1200px | 29,5 MB → ~1,0 MB (−95%) |
| `loading="lazy"` + `aspect-ratio` | só baixa a foto que você vai ver, e sem layout shift |
| Cor dominante como fundo da moldura | a foto "aparece" dentro de um quadro colorido em vez de um buraco preto |
| Rolagem nativa com `scroll-snap` | sem JS de scroll: fluido de verdade no celular |
