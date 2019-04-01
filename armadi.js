const {
    tabella: scriviTabella,
    add: scriviSQL } = require('./scriviSQL');

const { bold } = require('./utils');

module.exports = {
    genera(estratti) {
        console.time(" > Calcolo elementi");
        let arm_rip = [];
        let armadi = [];
        let idRipiani = [];

        for (let i = 1; i < estratti.length; i++) {
            let arm = estratti[i][11];
            let rip = estratti[i][12];

            if (arm === 'N/D') rip = 1;
            if (rip === 'N/D') rip = 1;

            // Salva
            arm_rip.push(arm + '_' + rip);
            armadi.push(arm);
        }
        // Elimina i duplicati
        arm_rip = [...new Set(arm_rip)];
        armadi = [...new Set(armadi)];
        console.timeEnd(" > Calcolo elementi");

        console.time(" > Calcolo id ripiani");
        for (let i = 1; i < estratti.length; i++) {
            let arm = estratti[i][11];
            let rip = estratti[i][12];

            if (arm === 'N/D') rip = 1;
            if (rip === 'N/D') rip = 1;

            // Ottieni l'indice
            const id = arm_rip.indexOf(arm + '_' + rip);
            // Aggiungilo alla lista
            idRipiani.push(id);
        }
        console.timeEnd(" > Calcolo id ripiani");


        // Riordina gli armadi
        armadi = armadi.sort((a, b) => a - b);
        // Scrivili sul file sql
        scriviTabella("Armadi", "idArmadio, Descrizione, idSezione", armadi,
            (_, val) => `${val}, "Armadio ${val}", 1`);

        // Aggiungi i ripiani agli id
        scriviTabella("Ripiani", "idRipiano, NumeroRipiano, idArmadio", arm_rip,
            (i, val) => {
                // Ottieni l'id dell'armadio
                const id_arm = val.split("_")[0];
                // Ottieni il numero del ripiano
                const numero = val.split("_")[1];

                return `${i + 1}, "${numero}", ${id_arm}`;
            });



        return idRipiani;
    }
}