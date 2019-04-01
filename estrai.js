const fs = require('fs');

// Ottieni i valori estratti dal .csv
const valori = require('./files').estratti;

// Output da scrivere nel file SQL
let output = "";

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
generi.unshift("n/d");
generi.forEach((genere, id) => {
    if (genere === 'n/d') genere = 'N/D';
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
// Rimuovi l'N/D
collane.splice(collane.indexOf("n/d"), 1);
// Inserisci l'N/D
collane.unshift("n/d");
output += "\n\n-- Collane -----\nINSERT INTO Collane (idCollana, Nome) VALUES\n";
collane.forEach((collana, id) => {
    if (collana === 'n/d') collana = 'N/D';
    output += `\t(${id}, "${collana.capitalizeAll()}")`;
    if (id < collane.length - 1) output += ',\n';
    else output += ';';
});
console.log("Collane salvate:", collane.length);

// Inserisci tutte le lingue
output += "\n\n-- Lingue -----\nINSERT INTO Lingue (idLingua, Descrizione, Abbreviazione) VALUES\n";
lingue.unshift("N/D");
lingue.forEach((lingua, id) => {
    output += `\t(${id}, "${lingua.capitalize()}", "${
        lingua === 'N/D' ? 'ND' : lingua.substr(0, 2).toUpperCase()}")`;
    if (id < lingue.length - 1) output += ',\n';
    else output += ';';
});
console.log("Lingue salvate:", lingue.length);

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

// Inserisci gli enti
output += '\n\n-- Enti -----\nINSERT INTO Enti (idEnte, NomeEnte) VALUES\n';
output += '\t(1, "I.S. Rosselli Aprilia");';

// Inserisci le biblioteche
output += '\n\n-- Biblioteche -----\nINSERT INTO Biblioteche (idBiblioteca, Email, TelefonoFisso, Principale, ViaPzz, NumeroCivico, Citta, SitoWeb, NomeBiblioteca, EnteAppartenente) VALUES\n';
output += '\t(1, "ltis004008@istruzione.it", "0692063631", 1, "Via Carroceto", NULL, 173, "http://isrosselliaprilia.gov.it", "Biblioteca Rosselli", 1);';

// Inserisci gli edifici
output += '\n\n-- Edifici -----\nINSERT INTO Edifici (idEdificio, Descrizione, idBiblioteca) VALUES\n';
output += '\t(1, "Sede Est", 1);';
console.log("Enti, Biblioteche ed Edifici salvati");

// Inserisci i piani
output += '\n\n-- Piani -----\nINSERT INTO Piani (idPiano, Numero, idEdificio) VALUES\n';
output += '\t(1, 1, 1);';

// Inserisci una sezione
output += '\n\n-- Sezioni -----\nINSERT INTO Sezioni (idSezione, Descrizione, idPiano) VALUES\n';
output += '\t(1, "Libri del Rosselli", 1);'

console.log("Piani e Sezioni salvati");


/**
 * Ricava i dati dei libri
 */
// Inizio dell'SQL
output += "\n\n-- Libri -----\nINSERT INTO Libri (ISBN, Titolo, Descrizione, AnnoPubblicazione,"
output += " DataAggiunta, idGenere, idTipo, idEditore, idCollana, idLingua) VALUES\n";

// Ottieni la data odierna in formato SQL
const data = new Date();
const DataAggiunta = data.getFullYear()
    + '-' + data.getMonth()
    + '-' + data.getDate();

// Tieni conto degli ISBN cambiati
let codici = [undefined];
let fillers = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

// Tieni conto anche di scaffali e ripiani
let ripiani = [];

let libriInseriti = 0;
for (let i = 1; i < valori.length - 1; i++) {
    // Elimina i duplicati
    let ISBN = valori[i][0];
    // Se tra i prossimi valori trovi un libro con lo stesso ISBN, cancellalo
    for (let j = i + 1; j < valori.length - 1; j++) {
        if (ISBN.length === 13 && valori[j][0] === ISBN)
            valori.splice(j, 1);
    }

    let Titolo = valori[i][1];
    let AnnoPubblicazione = valori[i][2];
    let Genere = valori[i][4];
    console.log(Genere);
    let Tipologia = valori[i][5];
    let Autori = valori[i][6];
    let Editore = valori[i][7];
    let Collana = valori[i][8];
    let Lingua = valori[i][9];
    let Armadio = valori[i][12];
    let Ripiano = valori[i][13];

    // Salva il ripiano
    ripiani.push(Armadio + '_' + Ripiano);

    // Ottieni il codice, ISBN o meno
    const codice = ISBN === 'N/D' ? '' : ISBN;
    if (!ISBN.match(/^\d{13}$/) && ISBN.length < 13) {
        // Calcola lo spazio da riempire
        const spazio = 12 - codice.length;

        // Incrementa corretto nell'array dei codici
        const filler = (fillers[spazio]++).toString();

        // Se lo spazio supera i caratteri consentiti
        if (fillers[spazio].toString().length > spazio)
            fillers[spazio] = 0;

        // Scrivi il filler con 0 a riempimento
        ISBN = filler + codice;
        while (ISBN.length < 12)
            ISBN = '0' + ISBN;
        // Aggiungi una N all'inizio del codice
        ISBN = 'N' + ISBN;

        if (ISBN.length === 14)
            ISBN = ISBN[0] + ISBN.substr(2);
        if (ISBN.length === 15)
            ISBN = ISBN[0] + ISBN.substr(3);
    }
    // Aggiungi il codice alla lista di codici
    codici.push(ISBN);

    // Elimina le "" nel titolo
    Titolo = Titolo.split("\"").join("");
    // Capitolizza il titolo
    Titolo = Titolo.capitalize();

    // Sistema l'anno di pubblicazione
    if (AnnoPubblicazione === 'N/D') AnnoPubblicazione = 'NULL';

    // Ottieni l'id del genere
    let idGenere = generi.indexOf(Genere.toLowerCase());
    if (idGenere < 0) idGenere = 0;

    // Ottieni l'id del tipo
    let idTipologia = tipologie.indexOf(Tipologia.toLowerCase());
    if (idTipologia < 0) idTipologia = 0;

    // Ottieni l'id dell'editore
    let idEditore = editori.indexOf(Editore.toLowerCase());
    if (idEditore < 0) idEditore = 0;

    // Ottieni l'id della collana
    let idCollana = collane.indexOf(Collana.toLowerCase());
    if (idCollana < 0) idCollana = 0;

    // Ottieni l'id della lingua
    let idLingua = lingue.indexOf(Lingua.toLowerCase());
    if (idLingua < 0) idLingua = 0;


    // Inserisci la riga
    output += `\t('${ISBN}', "${Titolo}", NULL, ${AnnoPubblicazione}, `;
    output += `'${DataAggiunta}', ${idGenere}, ${idTipologia}, ${idEditore}, `;
    output += `${idCollana}, ${idLingua}),\n`;

    libriInseriti++;
}
console.log("Libri salvati:", libriInseriti);

// Cambia l'ultima , in ;
output = output.replace(/,\n$/, ';');

// Elimina i duplicati nei ripiani
ripiani = [...new Set(ripiani)];

// Ottieni solo gli armadi
let armadi = ripiani.map(e => /\d/.exec(e)[0]);
armadi = [...new Set(armadi)];
// Inserisci gli armadi
output += '\n\n-- Armadi -----\nINSERT INTO Armadi (idArmadio, Descrizione, idSezione) VALUES\n';
armadi.forEach((armadio, i) => {
    output += `\t(${armadio}, "Armadio ${armadio}", 1)`;
    if (i < armadi.length - 1) output += ',\n';
    else output += ';';
});
console.log("Armadi salvati:", armadi.length);

// Inserisci i ripiani
output += '\n\n-- Ripiani -----\nINSERT INTO Ripiani (idRipiano, NumeroRipiano, idArmadio) VALUES\n';
ripiani.forEach((ripiano, id) => {
    const regex = /(\d+)_(\d+)?/.exec(ripiano);
    ripiano = regex[2] | 0;
    let armadio = regex[1];
    
    output += `\t(${id + 1}, ${ripiano}, ${armadio})`;
    if (id < ripiani.length - 1) output += ',\n';
    else output += ';';
});
console.log("Ripiani salvati:", ripiani.length);

// Inserisci le copie
output += '\n\n-- Copie -----\nINSERT INTO Copie (idCopia, ISBN, Prestato, idRipiano) VALUES\n';
// Per ogni libro
let copieInserite = 0;
for (let i = 1; i < valori.length - 1; i++) {
    // Ottieni il codice
    let Codice = codici[i];
    let NumeroCopie = valori[i][10];
    let Armadio = valori[i][12];
    let Ripiano = valori[i][13];

    // Ottieni l'indice del ripiano
    let idRipiano = ripiani.indexOf(Armadio + '_' + Ripiano) + 1;

    // Per ogni copia
    for (let j = 0; j < NumeroCopie; j++) {
        // Per ogni copia
        copieInserite++;
        output += `\t(${copieInserite}, '${Codice}', 0, ${idRipiano}),\n`;
    }
}
console.log("Copie salvate:", copieInserite);

// Cambia l'ultima , in ;
output = output.replace(/,\n$/, ';');







fs.writeFileSync("output/inserisci-libri2.sql", output);