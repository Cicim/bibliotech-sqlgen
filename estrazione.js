const { bold } = require('./utils');

/**
 * Funzioni per estrarre tutti i valori in appositi array
 */
module.exports = {
    // Funzione principale
    estrai(valori) {
        // Prende in input la lista di valori estratti
        const PRIMA_RIGA = valori[0].map(el => el.toLowerCase().trim());

        return function (colonna) {
            // Trova l'indice del valore inserito nella prima riga
            const indice = PRIMA_RIGA.indexOf(colonna);

            // Se l'indice riporta -1
            if (indice === -1) return errore(colonna);

            console.time(" > " + bold(colonna));
            // Crea una lista per contenere tutti i valori
            const righe = [];

            // Scorri tutta la lista
            for (let i = 1; i < valori.length; i++)
                // Pusha il valore all'indice giusto nell'array
                righe.push(valori[i][indice].toLowerCase());

            // Elimina i duplicati
            let senzaDuplicati = [...new Set(righe)];

            // Metti n/d in cima
            const res = senzaDuplicati.splice(senzaDuplicati.indexOf("n/d"), 1);
            // Non rimetterlo se non lo hai trovato prima
            if (res) senzaDuplicati.unshift("n/d");

            console.timeEnd(" > " + bold(colonna));

            // Riporta l'array senza duplicati
            return senzaDuplicati;
        }
    },
    // Funzione per dividere gli elementi (autori) che vanno estratti
    // due volte, perché divisi nelle celle con le ,
    ridividi(lista) {
        // Crea una nuova lista
        let nuova = [];

        // Per ogni elemento in quella vecchi
        lista.forEach(el => {
            // Splitta gli elementi
            const split = el.split(",").map(el => el.trim());
            // Aggiungi l'elemento splittato alla nuova lista
            nuova = nuova.concat(split);
        });

        // Riporta la nuova lista senza duplicati
        return [...new Set(nuova)];
    }
}

// Funzione da chiamare in caso di errore
function errore(colonna) {
    console.log(`\x1b[31mErrore durante l'estrazione di ${colonna}\x1b[0m`);
    return [];
}