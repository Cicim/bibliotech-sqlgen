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

// Assicurati che tutte le righe abbiano la stessa lunghezza
const CELL_NUMBER = estratti[0].length;
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

const POSSIBLE_NDS = /[Nn]\.[Dd]\.|\\\\|\/\//;
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

// Finito
console.timeEnd("Letto .csv");

// ANCHOR Esporta le linee estratte
module.exports = { estratti }