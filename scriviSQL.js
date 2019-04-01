// Il file system per leggere i file
const fs = require('fs');
const {bold} = require('./utils');

/**
 * File per scrivere i vari valori sul file di output SQL
 */
let output = `--  File SQL generato da bibliotech-sqlgen
--  Leggi il codice su http://github.com/Cicim/bibliotech-sqlgen
--  Realizzato da Claudio Cicimurri.
--  Compiled on ${new Date()}
`;
let path = "output/inserisci-libri-2.sql";
module.exports = {
    // Stampa i valori in una tabella dato un array
    tabella(nomeTabella, colonne, array, inserimento) {
        // Scriviti il tempo
        console.time(" > " + bold(nomeTabella));
        // Stampa il commento iniziale
        output += `\n\n-- ${nomeTabella} -----\n`;
        // Stampa la tabella con gli argomenti
        output += `INSERT INTO ${nomeTabella} VALUES (${colonne})\n`;

        // Inserisci ogni riga
        for (let i = 0; i < array.length; i++) 
            output += `\t(${inserimento(i, array[i], array)}),\n`;
        
        // Cambia l'ultima , in ;
        output = output.replace(/,\n$/, ';');
        
        console.timeEnd(" > " + bold(nomeTabella));
    },

    // Aggiunge del testo all'SQL
    add(text) {
        output += text;
    },

    // Scrive su disco le modifiche effettuate
    update() {
        fs.writeFileSync(path, output);
    }
}