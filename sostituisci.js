const { bold, SEPARA_AUTORI } = require('./utils');

/**
 * Funzioni per estrarre tutti i valori in appositi array
 */
module.exports = {
    // Funzione principale
    sostituisci(estratti) {
        // Prende in input la lista di valori estratti
        const PRIMA_RIGA = estratti[0].map(el => el.toLowerCase().trim());

        // Riporta la sottofunzione
        return function (colonna, lista, riportaArray) {
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
                let el = estratti[i][indice];

                // Se l'elemento non ha virgole al suo interno
                if (!riportaArray) {
                    // Adattalo come fatto in estrazione.js
                    el = el.toLowerCase().trim();
                    // Cercalo nella lista fornita
                    const id = lista.indexOf(el);
                    // Se l'id è -1
                    if (id === -1) return errore(colonna, el);
                    // Pushalo nella lista degli id
                    ids.push(id);
                }
                // Altrimenti, se è una lista di autori
                else {
                    // Crea una lista interna
                    let nuova = [];
                    // Esegui la stessa formattazione di estrazione.js
                    const split = el.split(SEPARA_AUTORI).map(el => el.toLowerCase().trim())
                        .filter(el => el !== '');

                    // Aggiungi l'elemento splittato alla nuova lista
                    nuova = nuova.concat(split);

                    // Per ogni autore nella nuova lista
                    for (let j = 0; j < nuova.length; j++) {
                        // Cercalo nella lista fornita
                        const id = lista.indexOf(nuova[j]);

                        // Se l'id è -1
                        if (id === -1) return errore(colonna, nuova[j]);
                        // Altrimenti, sostuiscilo
                        nuova[j] = id;
                    }
                    ids.push(nuova);
                }
            }
            console.timeEnd(" > " + bold(colonna));

            if (ids.length !== estratti.length - 1)
                console.log(`\x1b[31mErrore: qualche riga è stata persa\x1b[0m`)

            return ids;
        }
    }
}

// Funzione da chiamare in caso di errore
function errore(colonna, msg) {
    console.log(`\x1b[31mId di ${colonna} ${msg} non trovato\x1b[0m`);
    console.timeEnd(" > " + bold(colonna));
    return [];
}