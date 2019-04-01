const { bold } = require('./utils');

/**
 * Funzioni per estrarre tutti i valori in appositi array
 */
module.exports = {
    // Funzione principale
    sostituisci(estratti) {
        // Prende in input la lista di valori estratti
        const PRIMA_RIGA = estratti[0].map(el => el.toLowerCase().trim());

        // Riporta la sottofunzione
        return function(colonna, lista) {
            // Trova l'indice del valore inserito nella prima riga
            const indice = PRIMA_RIGA.indexOf(colonna);
            // Crea la lista di indici da riportare
            let ids = [];

            // Inizia a sostituire i generi nella lista estratta 
            // con gli indici nella lista fornita
            console.time(" > " + bold(colonna));
            // Per ogni elemento della lista estratta
            for (let i = 1; i < estratti.length; i++) {
                // Ottieni il valore dell'elemento attuale
                let elemento = estratti[i][indice];
                // Adattalo come fatto in estrazione.js
                elemento = elemento.toLowerCase().trim();
                // Cercalo nella lista fornita
                const id = lista.indexOf(elemento);
                // Se l'id è -1
                if (id === -1) return errore(colonna, elemento);
                // Pushalo nella lista degli id
                ids.push(id);
            }
            console.timeEnd(" > " + bold(colonna));
            return ids;
        }
    }
}

// Funzione da chiamare in caso di errore
function errore(colonna, msg) {
    console.log(`\x1b[31mId di ${colonna} ${msg} non trovato\x1b[0m`);
    return [];
}