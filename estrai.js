// Ottieni i valori estratti dal .csv
let estratti = require('./files').estratti;
// Importa le utilities per il lavoro con le stringhe
const { bold, cap, capAll, inc1 } = require('./utils');

const estrai = require('./estrazione').estrai(estratti);
const sostituisci = require('./sostituisci').sostituisci(estratti);
const ridividi = require('./estrazione').ridividi;
const sistemaNomi = require('./sistemaNomi').sistemaNomi;
const generaArmadi = require('./armadi').genera;
const generaCodice = require('./isbn').genera;
// Importa tutte le librerie per esportare il file sql
const {
    tabella: scriviTabella,
    tabellaMul: scriviRipeti,
    add: scriviSQL,
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
const idGeneri = inc1(sostituisci("genere", generi));
const idTipologie = inc1(sostituisci("tipo", tipologie));
const idLingue = inc1(sostituisci("lingua", lingue));
const idEditori = inc1(sostituisci("editore", editori));
const idCollane = inc1(sostituisci("collana", collane));
// Sostituisci gli autori
const idAutori = inc1(sostituisci("autore/i", autori, true));

// ANCHOR Risistema i nomi di ogni lista
console.log(bold("-- RISISTEMAZIONE TESTI --"));
console.time(" > " + bold("tutti"));
generi = generi.map(cap);
tipologie = tipologie.map(cap);
lingue = lingue.map(cap);
editori = editori.map(capAll);
collane = collane.map(cap);
autori = autori.map(capAll);
console.timeEnd(" > " + bold("tutti"));

// ANCHOR Inserisci nell'SQL i valori estratti
console.log(bold("-- SCRITTURA SU FILE --"));
scriviTabella("Generi", "idGenere, Descrizione", generi,
    (i, val) => `${i + 1}, '${val}'`);
scriviTabella("Tipologie", "idTipologia, Descrizione", tipologie,
    (i, val) => `${i + 1}, '${val}'`);
scriviTabella("Lingue", "idLingua, Descrizione, Abbreviazione", lingue,
    (i, val) => `${i + 1}, '${val}', '${val.replace('/', '').substring(0, 2).toUpperCase()}'`);
scriviTabella("Editori", "idEditore, Nome, Descrizione", editori,
    (i, val) => `${i + 1}, "${val}", NULL`);
scriviTabella("Collane", "idCollana, Nome", collane,
    (i, val) => `${i + 1}, "${val}"`);
scriviTabella("Nazionalita", "idNazionalita, Descrizione",
    ["N/D", "italiana", "inglese", "polacca"],
    (i, val) => `${i + 1}, "${val}"`);
scriviTabella("Autori", "idAutore, NomeAutore, CognomeAutore, DataNascita, idNazionalita, idCittaNascita", autori,
    (i, val) => {
        const { nome, cognome } = sistemaNomi(val);
        return `${i}, "${nome}", "${cognome}", "0000-00-00", 1, 1`;
    });

// ANCHOR Inserisci i valori costanti nell'SQL
scriviSQL(`\n\n-- Enti -----
INSERT INTO Enti (idEnte, NomeEnte) VALUES
	(1, "I.S. Rosselli Aprilia");\n
-- Biblioteche -----
INSERT INTO Biblioteche (idBiblioteca, Email, TelefonoFisso, Principale, ViaPzz, NumeroCivico, Citta, SitoWeb, NomeBiblioteca, EnteAppartenente) VALUES
	(1, "ltis004008@istruzione.it", "0692063631", 1, "Via Carroceto", NULL, 173, "http://isrosselliaprilia.gov.it", "Biblioteca Rosselli", 1);\n
-- Edifici -----
INSERT INTO Edifici (idEdificio, Descrizione, idBiblioteca) VALUES
	(1, "Sede Est", 1);\n
-- Piani -----
INSERT INTO Piani (idPiano, Numero, idEdificio) VALUES
	(1, 1, 1);\n
-- Sezioni -----
INSERT INTO Sezioni (idSezione, Descrizione, idPiano) VALUES
    (1, "Libri del Rosselli", 1);`);
console.log(" > Riempite tabelle fino a " + bold("Piani"))

// ANCHOR Crea armadi e ripiani
console.log(bold("-- OTTIENI LISTA ARMADI E RIPIANI --"))
const idRipiani = inc1(generaArmadi(estratti));

// ANCHOR Crea i libri
console.log(bold("-- INSERISCI LIBRI --"));
const dataAggiunta = '2019-04-01';
scriviTabella("Libri", "ISBN, Titolo, Descrizione, AnnoPubblicazione, DataAggiunta, idGenere, idTipo, idEditore, idCollana, idLingua", estratti.slice(1),
    (i, val) => {
        const titolo = val[1].capitalizeAll().trim().replace('"', '\\"');
        const anno = val[2];
        return `'${generaCodice(val[0])}', "${titolo}", ${anno}, '${dataAggiunta}', ${idGeneri[i]}, ${idTipologie[i]}, ${idEditori[i]}, ${idCollane[i]}, ${idLingue[i]}`;
    });
// Resetta il conto per poter inserire le copie
require('./isbn').resetta();
scriviRipeti("Copie", "Prestato, ISBN, idRipiano", estratti.slice(1),
    (i, val) => {
        return {
            values: `0, '${generaCodice(val[0])}', ${idRipiani[i]}`,
            // Riporta il numero delle copie
            copies: val[10]
        }
    });

// ANCHOR Inserisci in Autori_has_Libri

console.time(bold("Scritto .csv"));
scriviSuDisco();
console.timeEnd(bold("Scritto .csv"));