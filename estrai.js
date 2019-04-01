const fs = require('fs');
// Ottieni i valori estratti dal .csv
let estratti = require('./files').estratti;
// Importa le utilities per il lavoro con le stringhe
const { bold } = require('./utils');

const estrai = require('./estrazione').estrai(estratti);
const sostituisci = require('./sostituisci').sostituisci(estratti);
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
console.log(bold("-- SOSTITUZIONE CON ID --"));
const idGeneri = sostituisci("genere", generi);
const idTipologie = sostituisci("tipo", tipologie);
const idLingue = sostituisci("lingua", lingue);
const idEditori = sostituisci("editore", editori);
const idCollane = sostituisci("collana", collane);