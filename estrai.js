const fs = require('fs');
// Ottieni i valori estratti dal .csv
const valori = require('./files').estratti;
// Importa le utilities per il lavoro con le stringhe
require('./utils');
// Output da scrivere nel file SQL
let output = "";

// Comincia ad estrarre gli elementi uno ad uno
const estrai = require('./estrazione').estrai(valori);

const generi = estrai("generi");


