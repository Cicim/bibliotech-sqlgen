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
// Finito
console.timeEnd("Letto .csv");

// ANCHOR Esporta le linee estratte
module.exports = { estratti }