# FELS Therapeutics

Repository per le simulazioni interattive FELS Therapeutics. I deliverable ufficiali sono le presentazioni PowerPoint e i PDF, gestiti separatamente e non inclusi in questo repository.

## Palette Explorer

La simulazione in `palette/index.html` mostra sempre Grafico, Diagramma e Copertina scura, in verticale. I tre controlli colore aggiornano tutte le anteprime (3 palette × 3 contenuti = 9 combinazioni); il confronto mostra tutte le varianti per ciascun contenuto. La scelta e la modalità confronto si condividono tramite URL. I dati dei grafici sono simulati, non risultati sperimentali.

Aprire `palette/index.html` nel browser: il CSS compilato è incluso e non servono dipendenze runtime esterne. Tutti gli asset necessari sono locali.

## Typography Explorer

La nuova pagina `typography/index.html` confronta sette famiglie sans-serif sulle stesse tre slide, con selezione indipendente di famiglie, pesi e dimensioni per titoli e testi. La coppia iniziale è Manrope + Nunito Sans. La palette è fissa e il logo non cambia.

Configurazioni condivisibili tramite URL, Reset e fallback dei font sono descritti in [`typography/README.md`](typography/README.md). Google Fonts richiede una connessione Internet; non ci sono nuove dipendenze npm.

## Sviluppo degli stili

Con Node.js e npm installati:

```bash
npm ci
npm run build:css
npm run watch:css
```

Modificare `palette/scss/styles.scss` o `typography/scss/styles.scss`, non il CSS generato. Dart Sass (dipendenza di sviluppo) genera `styles.css` expanded, non minificato, e `styles.css.map` per entrambe le sezioni. Entrambi gli script usano `--style=expanded --source-map --no-error-css`; il comando watch resta attivo fino a Ctrl+C.

Sorgente SCSS, CSS e source map vanno versionati insieme. DevTools risolve la sorgente relativa `scss/styles.scss` dalla mappa. `node_modules/` è esclusa da Git.

## Pubblicazione

URL delle sezioni su GitHub Pages (branch `main`):
- https://andreacianni.github.io/fels-therapeutics/palette/
- https://andreacianni.github.io/fels-therapeutics/typography/ (dopo la pubblicazione delle nuove modifiche)

Le simulazioni supportano la valutazione visiva e non sostituiscono i deliverable ufficiali.
