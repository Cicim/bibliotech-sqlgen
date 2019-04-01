/**
 * Utilities
 */
// Funzione per capitalizzare una parola
String.prototype.capitalize = function () {
    if (this.toLowerCase() == 'n/d') return 'N/D';
    if (this.length === 0) return '';
    else if (this.length === 1) return this.toUpperCase();
    else return this[0].toUpperCase() + this.substr(1);
}
// Funzione per capitalizzare più parole in una stringa
String.prototype.capitalizeAll = function () {
    let stringParts = this.split(/[^\wàèìou.'&\/]/g);
    stringParts = stringParts.map(e => e.capitalize());
    return stringParts.join(" ");
}

module.exports = {
    // Per scrivere il testo bold
    bold(e) {
        return `\x1b[1m${e}\x1b[0m`;
    },
    cap(e) {
        return e.capitalize();
    },
    capAll(e) {
        return e.capitalizeAll();
    },
    // Incrementa ogni numero in questo array e nei sottoarray di 1
    inc1(arr) {
        return arr.map(el => {
            if (typeof el === 'number') return el + 1;
            else return el.map(el => el + 1);
        });
    },
    SEPARA_AUTORI: /, | [eE] | & | \/ | [eE][tT]/
}