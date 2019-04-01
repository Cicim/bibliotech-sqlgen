/**
 * Funzioni per estrarre tutti i valori in appositi array
 */
module.exports = {
    // Funzione principale
    estrai(valori) {
        // Prende in input la lista di valori estratti
        const PRIMA_RIGA = valori[0].map(el => el.toLowerCase());
        
        return function (valore) {
            // Trova l'indice del valore inserito nella prima riga
            const indice = PRIMA_RIGA.indexOf(valore);

            console.time("Estrazione \x1b[1m" + valore + "\x1b[0m");
            console.timeEnd("Estrazione \x1b[1m" + valore + "\x1b[0m");

        }
    }
}