const fs = require("fs");
const {saveAzioneCsv2, getBorsa, getAzione } = require("./tools.js");

var listaborsa = getBorsa().lista;

console.log(listaborsa);
const androidPath = "/mnt/d/Il mio Drive/NeuralNetwork/assets/";
const mappa_borsa_csv = "BorsaNeurale/app/src/main/assets/mappa_borsa.csv";
try { fs.unlinkSync(mappa_borsa_csv); } catch (error) { };
var i = 0;
listaborsa.forEach(azione => {
    //azione.filejson = "dati/azioni/json/" + Normalize(k).toLowerCase() + ".json";
    azione.filecsv = androidPath + azione.filename + ".csv";
    i++;
    var filename = "file_" + i;
    fs.appendFileSync(mappa_borsa_csv, [azione.azienda, azione.dettaglio, azione.sigla, filename, azione.dataAggiornamento, azione.abilitata].join(";") + "\n");
    saveAzioneCsv2(getAzione(azione.filejson), androidPath + filename + ".csv");
});

