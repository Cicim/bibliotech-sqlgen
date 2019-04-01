/**
 * Utilities
 */
// Funzione per capitalizzare una parola
String.prototype.capitalize = function () {
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