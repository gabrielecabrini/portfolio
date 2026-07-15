Questo portfolio non ha CMS, non ha database, non ha backend. Eppure home, about, experience, projects, CV e il PDF scaricabile del CV dicono tutti la stessa cosa senza mai disallinearsi. Il trucco è una cartella sola: `src/app/core/data`.

## Un array, non tre copie

Tutto il contenuto testuale vive in pochi array TypeScript tipizzati: `experience.ts`, `projects.ts`, `social-links.ts`, `blog.registry.ts` (sì, anche questo articolo è un'entry lì dentro). Ognuno tipizzato da un modello in `core/models/`. I componenti — `home`, `about`, `experience`, `cv`, il blog — li importano direttamente e li renderizzano. Zero layer intermedio. Per cambiare cosa dice il sito modifico un file di dati, non un template.

## La convenzione `...Key`

In `experience.ts` la maggior parte dei campi non è testo ma qualcosa tipo `roleKey: 'experience.work.sandrini.role'`. Sono chiavi i18n risolte con `| translate`, testo vero in `it.json`/`en.json`. Così un solo array serve entrambe le lingue senza duplicare la struttura.

Eccezioni volute: `company`, `name`, `institution` (un nome proprio non si traduce) e titolo/excerpt del blog, che restano letterali perché il bilinguismo qui lo gestisce il Markdown, non l'i18n.

Nota dolente: nessun controllo a build-time sulle chiavi mancanti. Se sbaglio una chiave, vedo la stringa grezza invece del testo — silenzioso, non rompe niente, ma va scovato a occhio.

## Stesso dato, viste diverse

`WORK_EXPERIENCES` è un unico array, ma `/experience` lo mostra as-is mentre `/cv` lo riordina per data di fine rapporto prima di renderizzarlo. Aggiungo un lavoro e compare ordinato correttamente in entrambe le pagine, senza toccare nulla oltre l'array.

## Il blog fa eccezione (in parte)

`blog.registry.ts` contiene solo metadati — slug, data, tag, titolo, excerpt. Il corpo (questo testo) è Markdown separato per lingua in `public/assets/blog/<slug>/<lang>.md`, fetchato via HTTP e renderizzato client-side. Un array TS va bene per due righe, è scomodo per un articolo intero con blocchi di codice — meglio scrivere in Markdown e tenere i metadati prerenderizzati (title, SEO) disponibili subito.

## E il PDF?

Il pulsante "scarica PDF" in `/cv` non rilegge `core/data`: cattura via screenshot (jsPDF + html2canvas) il DOM già popolato da Angular con quegli stessi dati. Non è una fonte parallela, è solo un altro output a valle.

## Il conto

Niente CMS da mantenere, niente sync tra sorgenti. Il costo è l'assenza di validazione automatica sulle chiavi i18n. Funziona bene con un solo autore; con più persone servirebbe probabilmente un CMS headless vero.
