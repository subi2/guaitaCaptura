# NOTICE · guaitaCaptura

**guaitaCaptura** · SBS BIM Consulting 2026
Copyright © 2026 Jordi Subirós · Llicència **GNU AGPL v3.0** (`AGPL-3.0-only`), vegeu el fitxer [`LICENSE`](LICENSE).

Versió del programa: **0.2.0** (preliminar, **no és Release Candidate**) · Versió del NOTICE: **1**

---

## Autoria i ús d'IA

La idea, el disseny funcional, la direcció, la revisió i les proves són de **Jordi Subirós**. Una part important del codi s'ha generat amb assistència d'intel·ligència artificial (**Claude**, d'Anthropic) sota direcció humana («vibecoding»), i l'autor la revisa, la prova i se'n responsabilitza com a titular del projecte.

## Authorship and AI use

The idea, functional design, direction, review and testing are by **Jordi Subirós**. A significant part of the code was generated with the assistance of artificial intelligence (**Claude**, by Anthropic) under human direction (“vibecoding”), and is reviewed and tested by the author, who is responsible for it as the project owner.

---

## Eina experimental i educativa · Experimental and educational tool

guaitaCaptura és una **versió preliminar** i s'ofereix **sense cap garantia**: l'autor no assumeix cap responsabilitat pels danys, pèrdues de dades o decisions derivades del seu ús. Exporta l'arxiu (.zip) sovint i verifica sempre els resultats abans d'usar-los.

guaitaCaptura is a **preview version** and is offered **without any warranty**: the author accepts no liability for damages, data loss or decisions arising from its use. Export the archive (.zip) often and always check the results before using them.

---

## Components de tercers · Third-party components

guaitaCaptura no incrusta cap biblioteca de tercers. La captura, el retall, l'editor, el .zip i la generació de PDF són codi propi (JavaScript sense dependències). Només s'hi incrusten tipografies:

| Component | Ús | Llicència | Fitxer |
|---|---|---|---|
| IBM Plex Sans i IBM Plex Mono (subconjunts WOFF2, extrets de guaitaPDF Edit) | Tipografia de la interfície | SIL OFL 1.1 | `pagesCAT/guaitaCaptura.html`, `pagesENG/guaitaCaptura.html` |

> *Pendent:* confirmar la versió exacta de IBM Plex incrustada.

Les proves (`tests/`) usen [jsdom](https://github.com/jsdom/jsdom) (MIT) només en desenvolupament; no es distribueix amb l'app.

---

## Contacte · Contact

- Errors i suggeriments: [GitHub Issues](https://github.com/subi2/guaitaCaptura/issues)
- Correu: guaitaapps@gmail.com
