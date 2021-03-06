// Importa la libreria file system
const fs = require('fs');
const { bold } = require('./utils');

/**
 * Questo è il codice per leggere un file e sistemare l'input prima di
 * cominiciare ad estrarre file
 */
console.time(bold("Letto .csv"));
// ANCHOR Leggi il file della biblioteca
const file = fs.readFileSync("input/Biblioteca2.csv", "latin1");

// ANCHOR Dividi il file per linea
let linee = file.split("\n");
// Elimina il ; iniziale per ogni riga
linee = linee.map(l => l.replace(/^;/, ''));
// Elimina il ;\r finale per ogni riga
linee = linee.map(l => l.replace(/;\r$/, ''));

// ANCHOR Dividi ogni linea per ;
let estratti = linee.map(e => e.split(";"));
// Elimina qualsiasi elemento non abbia un titolo
estratti = estratti.filter(el => el[0] !== '');
// Ottieni il numero di campi da estrarre
const CELL_NUMBER = estratti[0].length;

// Assicurati che tutte le righe abbiano la stessa lunghezza
// Scorri tutte le righe
for (let i = 1; i < estratti.length; i++) {
    // Se una non contiene CELL_NUMBER elementi
    if (estratti[i].length !== CELL_NUMBER) {
        // Se ne manca solo 1, inserisci N/D per l'ISBN
        if (estratti[i].length === CELL_NUMBER - 1)
            estratti[i].unshift("N/D");
        // Altrimenti, cancella e manda indietro il contatore
        else estratti.splice(i--, 1);
    }
}

// ANCHOR Sistema tutto il sistemabile
const POSSIBLE_NDS = /^([Nn]\.[Dd]\.|\\+|\/+|[nN]on [pP]ervenuto)$/;
const REAL_ND = "N/D";
// Cambia tutti gli N.D. e gli // in N/D
for (let i = 0; i < estratti.length; i++) {
    // Per ogni cella
    for (let j = 0; j < CELL_NUMBER; j++) {
        // Se il suo contenuto è riportabile ad un N/D
        if (estratti[i][j].match(POSSIBLE_NDS))
            // Sostituisci
            estratti[i][j] = REAL_ND;
    }
}

// Per ogni elemento
for (let i = 1; i < estratti.length; i++) {
    // Per ogni cella
    for (let j = 0; j < CELL_NUMBER; j++) {
        let cella = estratti[i][j]
        // Se la stringa esiste, elimina gli spazi agli estremi
        if (cella) cella = estratti[i][j].trim();
        // Altrimenti creala con un N/D
        else cella = REAL_ND;

        // Sostituisci tutti i caratteri errati con le loro controparti giuste
        cella = cella.replace("", "'");
        cella = cella.replace("", "«");
        cella = cella.replace("", "»");
        cella = cella.replace("", "—");
        cella = cella.replace("", "€");
        // E sostituisci anche i caratteri inseriti male
        cella = cella.replace("<<", "«");
        cella = cella.replace(">>", "»");
        // Togli gli spazi inutili tra le virgole
        cella = cella.replace(/\s*,\s*/, ', ');
        // Sostituisci ogni & con " & "
        cella = cella.replace(/\s+&\s+/, ' & ');

        // Elimina eventuali errori di battitura che incontri
        cella = cella.replace(/^itraliano$/, "italiano");
        cella = cella.replace(/^[Ii]tal$/, "italiano");
        cella = cella.replace(/^[Ii]talaino$/, "italiano");

        estratti[i][j] = cella;
    }

    // Infine elimina il prezzo
    estratti[i].splice(11, 1);
}
estratti[0].splice(11, 1);

// Elimina le righe completamente identiche
let insieme = [...new Set(estratti.map(el => el.join(";")))];

// Stampa il numero di elementi estratti
console.log("\x1b[1mLetti\x1b[0m:", estratti.length,
    "\x1b[1mScritti\x1b[0m:", insieme.length,
    "\x1b[1mDuplicati\x1b[0m:", estratti.length - insieme.length);



// Ridividi gli elementi unici per ; e passali
estratti = insieme.map(el => el.split(";"));
// Salva la lunghezza iniziale
const inizio = estratti.length;

// ANCHOR Elimina gli ISBN duplicati
for (let i = 1; i < estratti.length; i++) {
    // Elimina i -
    estratti[i][0] = estratti[i][0].replace(/-/g, "");
    // Trova l'ISBN
    const isbn = estratti[i][0];

    // Se l'ISBN è N/D o non è valido, salta
    if (isbn.length !== 13 && !isbn.match(/\d{13}/)) continue;

    // Altrimenti cerca un eventuale doppione
    for (let j = i + 1; j < estratti.length; j++) {
        // Se l'ISBN è uguale
        if (isbn === estratti[j][0].replace(/-/g, "")) {
            // Elimina il secondo
            estratti.splice(j--, 1);
        }
    }
}

console.log("\x1b[1mIniziali\x1b[0m:", inizio,
    "\x1b[1mScritti\x1b[0m:", estratti.length,
    "\x1b[1mISBN duplicati\x1b[0m:", inizio - estratti.length);





// ANCHOR Stampa il file in stile csv
let output = "";
for (let i = 0; i < estratti.length; i++) {
    output += estratti[i].join(";") + '\n';
}
fs.writeFileSync("output/sistemati.csv", output);
// Finito
console.timeEnd(bold("Letto .csv"));




// ANCHOR Esporta le linee estratte
module.exports = { estratti }