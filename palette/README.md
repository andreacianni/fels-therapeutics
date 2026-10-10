# Palette Explorer — colori

Gli accent sono centralizzati in `BRAND_COLORS`, all'inizio di `app.js`:

- Amber: `#F2A65A`
- Molecular Orange: `#FF9400`
- Custom: default `#F00059`

I tre renderer condivisi producono Grafico, Diagramma e Copertina scura: tre opzioni × tre anteprime = nove combinazioni. Il confronto mostra tutte le nove varianti.

Picker, campo HEX e campione usano lo stesso valore Custom. Il campo accetta esattamente sei cifre HEX, con o senza `#`, e normalizza in `#RRGGBB`. Le bozze parziali o non valide non cambiano l'ultimo valore applicato. Un colore valido seleziona Custom e aggiorna le anteprime e il confronto.

Il link conserva sempre Custom, anche quando è selezionata un'altra palette:

```text
https://andreacianni.github.io/fels-therapeutics/palette/#palette=custom&custom=F00059
```

`view=compare` conserva il confronto. I vecchi link `palette=orange` sono compatibili con Molecular Orange; `palette=yellow` ora seleziona Custom. HEX non validi nei link usano il default. Non sono usati storage locale, servizi esterni o credenziali.

Dalla radice del repository, eseguire `npm run build:css` dopo aver modificato `scss/styles.scss`. Il CSS expanded e la source map devono essere aggiornati insieme al sorgente.
