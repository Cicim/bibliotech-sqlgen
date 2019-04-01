let conto = 0;

module.exports = {
    genera(isbn) {
        // Se l'ISBN è valido
        if (isbn.length === 13 && isbn.match(/\d{13}/)) return isbn;

        // Se non è valido
        // Riporta il codice progressivo
        let codice = (++conto).toString();

        // Finché il codice non è lungo 12, prepend uno 0
        while (codice.length < 12) 
            codice = '0' + codice;

        // Infine riporta N + codice
        return "N" + codice;
    }
}