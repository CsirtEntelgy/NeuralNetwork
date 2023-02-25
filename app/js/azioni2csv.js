const fs = require("fs");
const { getBorsa, getAzione, saveAzioneCsv } = require("./tools.js");

function saveBorsaCsv(azione, azienda, sigla) {
    var rows = [];
    Object.keys(azione.dati).sort().forEach(k => {
        var dato = azione.dati[k];
        if (dato.ultimoValore && dato.variazionePercentuale)
            rows.push([azienda, sigla, k, dato.apertura, dato.massimo, dato.minimo, dato.ultimoValore, dato.variazionePercentuale].join(";"));
    });
    console.log("Scrittura azione ", azione.azienda);
    fs.appendFileSync("dati/azioni/borsa.csv", rows.join("\n") + "\n");
}

var listaborsa = getBorsa().lista;
try { fs.unlinkSync("dati/azioni/borsa.csv"); }
catch (error) { }

listaborsa.forEach(azione => {
    saveBorsaCsv(getAzione(azione.filejson), azione.azienda, azione.sigla);
    saveAzioneCsv(getAzione(azione.filejson), azione.filecsv);
});
