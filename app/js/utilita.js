const fs = require("fs");
const { getDatiAzione, saveAzioneCsv2, getBorsa, getAzione, saveBorsa } = require("./tools.js");

var borsa = getBorsa().lista;
for (let key in borsa) {
    var azione = getDatiAzione(borsa[key].azienda);
    console.log(azione);
}