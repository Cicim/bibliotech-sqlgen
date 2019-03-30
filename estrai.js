const fs = require('fs');
const file = fs.readFileSync("Biblioteca.csv", "latin1");

// Dividi il file per linea
const linee = file.split("\n");
// Dividi ogni linea per ;
const valori = linee.map(e => e.split(";"));

// Output da scrivere nel file SQL
let output = "";


// Stampa la lista dei dati nella tabella
console.log(valori[0].join("\n"));

/**
 * Individuazione delle tabelle
 */
//#region 
console.log("-----------");
// Trova tutti gli autori
let autori = [];
for (let i = 1; i < valori.length; i++) {
    const autore = valori[i][6];
    if (typeof autore !== "string")
        continue;

    // Può essere tre cose
    // > aavv o aa vv
    if (/aa\.?\s?vv\.?/.exec(autore))
        autori.push("AA.VV.");
    // > autore uno,autore due,autore tre
    else if (autore.indexOf(",") !== -1) {
        let autDiv = autore.split(/,\s?/g);
        autDiv = autDiv.map(e => e.toLowerCase().trim());
        autori = autori.concat(autDiv);
    }
    // > autore singolo
    else
        autori.push(autore.toLowerCase().trim());
}
// Rimuovi i duplicati
autori = [...new Set(autori)];
console.log("Autori estratti:", autori.length);

// Trova tutti gli editori
let editori = [];
for (let i = 1; i < valori.length; i++)
    if (valori[i][7])
        editori.push(valori[i][7].toLowerCase().trim());
// Rimuovi i duplicati
editori = [...new Set(editori)];
console.log("Editori estratti:", editori.length);

// Trova tutti i generi
let generi = [];
for (let i = 1; i < valori.length; i++)
    if (valori[i][4])
        generi.push(valori[i][4].toLowerCase().trim());
// Rimuovi i duplicati
generi = [...new Set(generi)];
console.log("Generi estratti:", generi.length);


// Trova tutte le tipologie
let tipologie = [];
for (let i = 1; i < valori.length; i++)
    if (valori[i][5])
        tipologie.push(valori[i][5].toLowerCase().trim());
tipologie = [...new Set(tipologie)];
console.log("Tipologie estratte:", tipologie.length);

// Trova tutte le collane
let collane = [];
for (let i = 1; i < valori.length; i++)
    if (valori[i][8])
        collane.push(valori[i][8].toLowerCase().trim());
collane = [...new Set(collane)];
console.log("Collane estratte:", collane.length);

// Trova tutte le lingue
let lingue = [];
for (let i = 1; i < valori.length; i++)
    if (valori[i][9])
        lingue.push(valori[i][9].toLowerCase().trim());
lingue = [...new Set(lingue)];
console.log("Lingue estratte:", lingue.length);
//#endregion

/**
 * Utilities
 */
//#region
String.prototype.capitalize = function () {
    if (this.length === 0) return '';
    else if (this.length === 1) return this.toUpperCase();
    else return this[0].toUpperCase() + this.substr(1);
}
String.prototype.capitalizeAll = function () {
    let stringParts = this.split(/[^\wàèìou.'&\/]/g);
    stringParts = stringParts.map(e => e.capitalize());
    return stringParts.join(" ");

}
console.log("-----------");
//#endregion


/**
 * Inserisci i dati necessari 
 * per far funzionare tutto
 */
//#region 
// Inserisci la tabella delle nazionalità
output += '-- Nazionalità -----\nINSERT INTO Nazionalita (idNazionalita, Descrizione) VALUES\n';
output += '\t(0, "Sconosciuta"),\n';
output += '\t(1, "Italiana"),\n';
output += '\t(2, "Inglese");';
console.log("Nazionalità salvate: 3")
//#endregion

/**
 * Comincia ad inserire tutto nel file di output
 */
//#region 
// Inserisci tutti i generi
output += "\n\n-- Generi -----\nINSERT INTO Generi (idGenere, Descrizione) VALUES\n";
// Rimuovi l'N/D
generi.splice(generi.indexOf("n/d"), 1);
// Inserisci l'N/D
generi.unshift("N/D");
generi.forEach((genere, id) => {
    output += `\t(${id}, "${genere.capitalize()}")`;
    if (id < generi.length - 1) output += ',\n';
    else output += ';';
});
console.log("Generi salvati:", generi.length);

// Inserisci tutte le tipologie
output += "\n\n-- Tipologie -----\nINSERT INTO Tipologie (idTipologia, Descrizione) VALUES\n";
tipologie.forEach((tipologia, id) => {
    if (tipologia === 'n/d') tipologia = 'N/D';
    output += `\t(${id}, "${tipologia.capitalize()}")`;
    if (id < tipologie.length - 1) output += ',\n';
    else output += ';';
});
console.log("Tipologie salvate:", tipologie.length);

// Inserisci tutti gli editori
output += "\n\n-- Editori -----\nINSERT INTO Editori (idEditore, Nome, Descrizione) VALUES\n";
editori.forEach((editore, id) => {
    if (editore === 'n/d') editore = 'N/D';
    output += `\t(${id}, "${editore.capitalizeAll()}", NULL)`;
    if (id < editori.length - 1) output += ',\n';
    else output += ';';
});
console.log("Editori salvati:", editori.length);

// Inserisci tutte le collane
output += "\n\n-- Collane -----\nINSERT INTO Collane (idCollana, Nome) VALUES\n";
collane.forEach((collana, id) => {
    output += `\t(${id}, "${collana.capitalizeAll()}")`;
    if (id < collane.length - 1) output += ',\n';
    else output += ';';
});
console.log("Collane salvate:", collane.length);

// Inserisci tutti gli autori
output += "\n\n-- Autori -----\nINSERT INTO Autori (idAutore, NomeAutore, CognomeAutore, DataNascita, idNazionalita, idCittaNascita) VALUES\n";
// Rimuovi gli autori vari
autori.splice(autori.indexOf("AA.VV."), 1);
autori.splice(autori.indexOf("N/D"), 1);
// Riaggiungili
autori.unshift("AA.VV.");
autori.unshift("N/D");
autori.forEach((nomeCompleto, id) => {
    // Ottieni nome e cognome
    let nome = "", cognome = "", nazionalità = 0;
    let anagrafica = nomeCompleto.split(/\s+/);

    // Se c'è un cognome con de, raggruppa
    if (anagrafica[0] === 'de')
        anagrafica = [anagrafica[0] + anagrafica[1]];

    // Poi se non c'è un nome
    if (anagrafica.length === 1)
        cognome = anagrafica[0];
    // Se c'è un nome
    else if (anagrafica.length === 2) {
        cognome = anagrafica[0];
        nome = anagrafica[1];
    }
    // Se ci sono più di un cognome
    else if (anagrafica.length > 2) {
        cognome = anagrafica[0] + ' ' + anagrafica[1];
        nome = anagrafica[2];
    }

    // Metti tutti maiuscoli
    cognome = cognome.trim().capitalizeAll();
    nome = nome.trim().capitalize();

    // Se il cognome è N/D o AA.VV.
    // Metti nazionalità sconosciuta
    if (cognome === 'N/D' || cognome == 'AA.VV.')
        nazionalità = 0;
    // Se il cognome finisce con una vocal
    else if (cognome.match(/[aeiou.]$/))
        // Probabilmente è italiano
        nazionalità = 1;
    // Se finisce con una consonante è probabile che sia ingles
    // Il resto si sistema
    else nazionalità = 2;

    // Inserisci tutto
    output += `\t(${id}, "${nome}", "${cognome}", '2000-01-01', ${nazionalità}, 1)`;
    if (id < autori.length - 1) output += ',\n';
    else output += ';';
});
console.log("Autori salvati:", autori.length);
//#endregion


/**
 * Ricava i dati dei libri
 */
for (let i = 1; i < valori.length - 1; i++) {
    const ISBN = valori[i][0];
    const Titolo = valori[i][1];
    const AnnoPubblicazione = valori[i][2];
    const DataAggiunta = valori[i][3];
    const Genere = valori[i][4];
    const Tipologia = valori[i][5];
    const Autori = valori[i][6];
    const Editore = valori[i][7];
    const Collana = valori[i][8];
    const Lingua = valori[i][9];
    const NumeroCopie = valori[i][10];
    // const Prezzo = valori[i][11];
    const Scaffale = valori[i][12];
    const Ripiano = valori[i][13];


    console.log(NumeroCopie, Titolo);
}
fs.writeFileSync("inserisci-libri.sql", output);