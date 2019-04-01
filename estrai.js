// Ottieni i valori estratti dal .csv
let estratti = require('./files').estratti;
// Importa le utilities per il lavoro con le stringhe
const { bold, cap, capAll } = require('./utils');

const estrai = require('./estrazione').estrai(estratti);
const sostituisci = require('./sostituisci').sostituisci(estratti);
const ridividi = require('./estrazione').ridividi;
// Importa tutte le librerie per esportare il file sql
const {
    tabella: scriviTabella,
    update: scriviSuDisco } = require('./scriviSQL');

// ANCHOR Estrai tutti i valori, uno ad uno
console.log(bold("-- ESTRAZIONE DATI --"));
let generi = estrai("genere");
let tipologie = estrai("tipo");
let lingue = estrai("lingua");
let editori = estrai("editore");
let collane = estrai("collana");
// Estrai gli autori
let autori = ridividi(estrai("autore/i"));

// ANCHOR Sostituisci ogni valore in valori con il suo id
console.log(bold("-- SOSTITUZIONE CON ID --"));
const idGeneri = sostituisci("genere", generi);
const idTipologie = sostituisci("tipo", tipologie);
const idLingue = sostituisci("lingua", lingue);
const idEditori = sostituisci("editore", editori);
const idCollane = sostituisci("collana", collane);
// Sostituisci gli autori
const idAutori = sostituisci("autore/i", autori, true);

// ANCHOR Risistema i nomi di ogni lista
console.log(bold("-- RISISTEMAZIONE TESTI --"));
console.time(" > " + bold("tutti"));
generi = generi.map(cap);
tipologie = tipologie.map(cap);
lingue = lingue.map(cap);
editori = editori.map(capAll);
collane = collane.map(cap);
console.timeEnd(" > " + bold("tutti"));

// ANCHOR Inserisci nell'SQL i valori estratti
console.log(bold("-- SCRITTURA SU FILE --"));
scriviTabella("Generi", "idGenere, Descrizione", generi,
    (i, val) => `${i}, '${val}'`);
scriviTabella("Tipologie", "idTipologia, Descrizione", tipologie,
    (i, val) => `${i}, '${val}'`);
scriviTabella("Lingue", "idLingua, Descrizione, Abbreviazione", lingue,
    (i, val) => `${i}, '${val}', '${val.replace('/', '').substring(0, 2).toUpperCase()}'`);
scriviTabella("Editori", "idEditore, Nome, Descrizione", editori,
    (i, val) => `${i}, "${val}", NULL`);
scriviTabella("Collane", "idCollana, Nome", collane,
    (i, val) => `${i}, "${val}"`);
scriviTabella("Autori", "idAutore, NomeAutore, CognomeAutore, DataNascita, idNazionalita, idCittaNascita", autori,
    (i, val) => `${i}`);

scriviSuDisco();