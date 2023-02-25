const fs = require("fs");
function check(azione) {
    var dati = getAzione(azione.filejson);
    Object.keys(dati.dati).sort().forEach(k => {
        let dato = dati.dati[k];
        if (isNaN(dato.ultimoValore)) console.log(dato);
        if (isNaN(dato.variazionePercentuale)) console.log(dato);
    })
}

const { getAzione, getBorsa } = require("./tools.js");
var { lista, mappa } = getBorsa();
lista.forEach(azione => {
    //console.log(azione.azienda, azione.filejson);
    check(azione);
})

Object.keys(mappa).sort().forEach(k => {
    var azione = mappa[k];
    check(azione);
})