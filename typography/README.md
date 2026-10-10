# FELS Therapeutics — Typography Explorer

Pagina indipendente in `typography/index.html`, basata sull'interfaccia e sulle tre slide approvate del Palette Explorer. Nessuna modifica ai file di `palette/`.

## Uso

- Famiglie indipendenti per titoli e testi: Nunito Sans, Manrope, Plus Jakarta Sans, DM Sans, Outfit, IBM Plex Sans e Sora.
- Valori iniziali: **Manrope 700 + Nunito Sans 400**, dimensioni al **100%**.
- Pesi selezionabili in passi di 100 entro gli intervalli variabili supportati dalla famiglia. Un peso non disponibile viene sostituito da quello supportato più vicino.
- Dimensioni relative dall'80% al 120%. Nessun adattamento automatico del testo per nascondere gli ingombri.
- Reset ripristina la coppia e tutti i parametri iniziali.
- Il link conserva i sei parametri nel frammento URL: `headings`, `texts`, `headingWeight`, `textWeight`, `headingSize`, `textSize`. Parametri mancanti o non validi usano i default.

Esempio di URL di pubblicazione:

```text
https://andreacianni.github.io/fels-therapeutics/typography/#headings=manrope&texts=nunito-sans&headingWeight=700&textWeight=400&headingSize=100&textSize=100
```

## Struttura e scelte tecniche

- `index.html`: interfaccia a due colonne; in mobile diventa una colonna.
- `app.js`: configurazione font, validazione, controlli, Reset e condivisione.
- `slides.js`: copia selettiva dei renderer SVG di palette, con gli stessi contenuti scientifici, coordinate, curve, diagrammi e formato 1200 × 675. Famiglie, pesi e scale si applicano via CSS senza ricostruire le slide o cambiare la geometria.
- `scss/styles.scss`: stili indipendenti che riprendono il linguaggio visivo esistente.
- `styles.css` e `styles.css.map`: output Dart Sass expanded e relativa source map.
- Loghi: riferimenti relativi a `../palette/assets/`; gli asset grafici restano invariati. Il lettering THERAPEUTICS è un tracciato del logo (Nunito), non un testo modificabile.

La palette rimane fissa: navy `#001431`, corpo `#26384A`, secondari `#667789`, accent `#0075D5`, primary blue `#124F95`, teal `#2992B1`, light cyan `#73BFD3`, off white `#F7F9FB`, gray 100 `#E8EDF2`, gray 300 `#C5CED8`, white `#FFFFFF`. Non ci sono controlli colore, confronto palette o download.

### Adattamento dei parametri PowerPoint

Le dimensioni SVG iniziali sono quelle delle slide approvate (titoli slide 35, cover 55, sottotitoli 19, testi e didascalie secondo la gerarchia esistente), non una conversione letterale da punti PowerPoint. La gerarchia iniziale è 700 per headline/numeri, 600 per titoli slide/sottotitoli, 400 per testi/didascalie e 600 per enfasi nel corpo. Il peso titoli regola i titoli slide/sottotitoli a un livello inferiore, se disponibile; il peso testi mantiene l'enfasi a due livelli superiori, entro i limiti della famiglia.

I rapporti di interlinea 1.10 / 1.15 / 1.20 / 1.30 / 1.25 / 1.00 sono dichiarati per i rispettivi ruoli. Nei testi SVG su righe separate vengono mantenute le baseline delle slide originali: non c'è reflow che sposti grafici o illustrazioni. Aumentare le dimensioni può mostrare ingombri: il simulatore non riduce automaticamente il testo.

Su mobile (fino a 600 px), le slide mantengono un canvas 16:9 di almeno 960 px e si possono scorrere orizzontalmente nell'anteprima, anche tramite tastiera. È un compromesso esplicito per mantenere leggibili le etichette scientifiche, senza overflow orizzontale della pagina. Desktop e tablet mantengono le slide a tutta larghezza.

### Caricamento font

Le sette famiglie sono caricate da Google Fonts tramite CSS API, con intervalli variabili `wght` e `display=swap`. Nunito Sans usa la famiglia Google Fonts `Nunito Sans`, che fornisce il font variabile. L'app verifica il caricamento tramite `document.fonts.load()`. In assenza di rete viene mostrato un messaggio e usato Arial come fallback, senza interrompere i controlli.

Google Fonts è l'unico servizio esterno della nuova pagina. Non sono aggiunte dipendenze npm runtime, analytics, credenziali o storage locale. Per confrontare i font reali serve accesso a `fonts.googleapis.com` e `fonts.gstatic.com`.

Newsreader, IBM Plex Serif e Source Serif 4 restano riferimenti documentali per eventuali usi editoriali futuri: non sono caricati né inclusi nei selettori.

## Build e verifica locale

Dalla radice del repository:

```bash
npm ci
npm run build:css
npm run watch:css
```

Build e watch compilano entrambe le pagine con `--style=expanded --source-map --no-error-css`. Nessun cambiamento alle dipendenze o al lockfile.

Per servire le pagine localmente, ad esempio:

```bash
python -m http.server 8080
```

Aprire `http://localhost:8080/typography/`. Il CSS compilato è già incluso: non è richiesta una build per la consultazione. La condivisione via clipboard richiede HTTPS o localhost; se gli appunti non sono disponibili viene mostrato il link da copiare manualmente.

La pagina è pronta per GitHub Pages dal branch `main`. Non sono state modificate le impostazioni di pubblicazione né aggiunti workflow.
