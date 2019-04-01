// Importa la libreria file system
const fs = require('fs');

/**
 * Questo è il codice per leggere un file e sistemare l'input prima di
 * cominiciare ad estrarre file
 */
console.time("Letto .csv");
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
const POSSIBLE_NDS = /^([Nn]\.[Dd]\.|\\+|\/+)$/;
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

        estratti[i][j] = cella;
    }

    // Infine elimina il prezzo
    estratti[i].splice(11, 1);
}
estratti[0].splice(11, 1);

// Elimina le righe completamente identiche
let insieme = [...new Set(estratti.map(el => el.join(";")))];

console.log(estratti.length, insieme.length);

// Stampa il file in stile csv
let output = "";
for (let i = 0; i < insieme.length; i++) {
    output += insieme[i] + '\n';
}
fs.writeFileSync("output/sistemati.csv", output);

// Finito
console.timeEnd("Letto .csv");

// ANCHOR Esporta le linee estratte
module.exports = { estratti }