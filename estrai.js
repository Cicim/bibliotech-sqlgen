const fs = require('fs');
// Ottieni i valori estratti dal .csv
const estratti = require('./files').estratti;
// Importa le utilities per il lavoro con le stringhe
const { bold } = require('./utils');

const estrai = require('./estrazione').estrai(estratti);
const ridividi = require('./estrazione').ridividi;

// ANCHOR Estrai tutti i valori, uno ad uno
console.log(bold("-- ESTRAZIONE DATI --"));
const generi = estrai("genere");
const tipologie = estrai("tipo");
const lingue = estrai("lingua");
const editori = estrai("editore");
const collane = estrai("collana");
// Estrai gli autori
const autori = ridividi(estrai("autore/i"));


// Output da scrivere nel file SQL
let output = "";

// Sostituisci ogni valore in valori con il suo id