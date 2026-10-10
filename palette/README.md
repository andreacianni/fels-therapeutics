# Palette Explorer — colours

Accents are centralised in `BRAND_COLORS` at the top of `app.js`:

- Amber: `#F2A65A`
- Molecular Orange: `#FF9400`
- Custom: the default is read from the JavaScript configuration (currently `#44E49F`).

The FELS core colours appear above the accent selection. The four equally sized cards are Amber, Molecular Orange, Custom and Customise Custom. The grid uses four columns on desktop, two on tablet and one on mobile.

The three shared renderers produce the Scientific chart, Diagram and Dark cover: three options × three previews = nine combinations. Comparison mode shows all nine variants.

The colour picker and HEX field share the same Custom value. The field accepts exactly six HEX digits, with or without `#`, and normalises them to `#RRGGBB`. Partial or invalid drafts do not change the last applied value. A valid colour selects Custom and updates the previews and comparison. Reset restores the configured default and synchronises the controls, previews, status and URL. The redundant Custom output swatch has been removed.

Links always preserve Custom, even when another palette is selected:

```text
https://andreacianni.github.io/fels-therapeutics/palette/#palette=custom&custom=44E49F
```

`view=compare` preserves comparison mode. Legacy `palette=orange` links select Molecular Orange; `palette=yellow` now selects Custom. Invalid HEX values in links fall back to the configured default. No local storage, external services or credentials are used.

Run `npm run build:css` from the repository root after editing `scss/styles.scss`. Update the expanded CSS and source map together with the source.
