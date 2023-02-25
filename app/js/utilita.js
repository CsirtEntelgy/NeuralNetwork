const fs = require("fs");
const { saveAzioneCsv2, getBorsa, getAzione, saveBorsa } = require("./tools.js");

/*
var listaborsa = getBorsa().lista;

const mappa_borsa_csv = "dati/mappa_borsa2.csv";
try { fs.unlinkSync(mappa_borsa_csv); } catch (error) { };
var i = 0;
listaborsa.forEach(azione => {
    fs.appendFileSync(mappa_borsa_csv, [azione.azienda, azione.dettaglio, azione.sigla,azione.filename, azione.filejson, azione.filecsv, azione.dataAggiornamento, azione.abilitata].join("|") + "\n");
});
*/
var borsa = JSON.parse(fs.readFileSync("dati/backup/mappa.json", "utf8"));
//fs.renameSync("dati/mappa_borsa.csv", "dati/backup/mappa_borsa." + formatFileDate(new Date()) + ".csv");
for (let key in borsa) {
    var azione = borsa[key];
    var riga = [azione.azienda, azione.dettaglio, azione.sigla, azione.filejson, azione.filecsv, azione.dataAggiornamento, azione.abilitata].join("|");
    fs.appendFileSync("dati/mappa_borsa.csv", riga + "\n");
    //console.log(riga);
}
