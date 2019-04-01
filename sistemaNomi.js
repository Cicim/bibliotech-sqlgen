/**
 * File per sistemare i nomi e dividerli bene in
 * cognomi e nomi
 */
module.exports = {
    // Dato il singolo nome, riporta il nome e il cognome
    sistemaNomi(input) {
        // Dividi nome e cognome
        let nome = "", cognome = "";

        // Comincia dividendo l'input per spazio
        input = input.split(" ");
        // Elimina ogni elemento vuoto
        input = input.filter(el => el !== '');

        // Se c'è un solo valore
        if (input.length === 1) 
            // Riporta solo il cognome
            cognome = input[0];
        // Se ci sono meno di 3 valori
        else if (input.length <= 3)
            // Ottieni il nome e il cognome
            nome = input.shift(),
            cognome = input.join(" ");
        else nome = input.join(" ");

        return {
            nome, cognome
        }
    }
}