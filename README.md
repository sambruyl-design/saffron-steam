# Saffron & Steam: landingspagina

Landingspagina voor **Saffron & Steam**, een fictief theemerk, gemaakt voor het schoolproject Creative Automation. De pagina is gebouwd met Claude Code en staat online via GitHub Pages.

**Live:** https://sambruyl-design.github.io/saffron-steam/

## Inhoud (versie 2)
- **Hero:** "Een kop voor elk moment", met de campagnevideo en een live badge die zegt welke smaak bij het moment van nu past
- **Vier smaken, vier momenten:** een smakenverkenner met tabs per moment: foto op de Instagram-achtergrond in de kleur van de smaak, soort, ingrediënten, "Zo zet je hem" en "Past bij"
- **Quiz "Welk moment ben jij?":** drie vragen, met als uitkomst de smaak die bij je past
- **Ons verhaal:** over het merk
- **Nieuwsbrief:** ingesloten MailerLite-formulier (voornaam, achternaam, e-mail, opt-in, double opt-in), met een kleine uitklapbare privacy-uitleg (GDPR)
- **Achtergrond:** crème, met de lijn-icoontjes van de Instagram-achtergronden (citroengras, gember, bosvruchten, kamille, stoom) in een donkerdere crème

## Bestanden
| Bestand | Wat |
|---|---|
| `index.html` | De pagina (de icoontjes staan bovenaan als SVG-symbolen) |
| `assets/style.css` | Opmaak van de pagina en van het formulier |
| `assets/app.js` | Interactie: smakenverkenner, badge "nu", quiz, privacy openklappen, animaties bij scrollen |
| `assets/brand-tokens.css` | Kleuren en fonts van de huisstijl (Playfair Display, Lato, bordeaux #8A384D) |
| `assets/patroon.svg` | Het achtergrondpatroon |
| `assets/achtergrond_*.jpg` | De Instagram-achtergronden per kleur |
| `assets/*.jpg`, `assets/video_elk-moment.mp4` | Beelden en video (AI-gegenereerd, zie het logboek van het project) |
| `_script_patroon.py` | Maakt `patroon.svg` en de icoontjes uit het script van de Instagram-achtergronden |

Animaties staan uit als iemand "minder beweging" heeft ingesteld op zijn toestel.

## AI-transparantie
De code en de teksten zijn geschreven met Claude (Claude Code) en nagelezen door Sam. De beelden zijn gemaakt met Figma Weave (Nano Banana Pro) op basis van eigen productfoto's. De video is een montage van die beelden (Python en ffmpeg).
