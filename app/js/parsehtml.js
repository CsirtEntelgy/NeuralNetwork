const fs = require("fs");
const cheerio = require("cheerio");
const path = require("path");
const { exit } = require("process");
var $;
const { getAzione, saveAzione, csvPath, jsonPath, getBorsa, saveBorsa, formatOra, Normalize, formatDate, formatDateShort } = require("./tools.js");


function loadHtml(filename, n) {
    var htmlString = fs.readFileSync(filename + "." + n + ".html", "utf8");
    $ = cheerio.load(htmlString);
    var tabs = $("table");
    //    console.log(tabs[0]);
    var tab = tabs[0];
    var records = $(tab).find("tr");
    for (var i = 0; i < records.length; i++) {
        var cells = $(records[i]).find("td");
        var id = $($(cells[0]).find("strong")[0]).text()
        if (id) {
            rawdata[id] = {};
            for (var j = 0; j < cells.length; j++) {
                store(id, j, cells[j]);
            }
        }
    }

}
//   localStorage["$l.$pg"]=JSON.stringify(rawdata,null," ");

function store(id, j, arg) {
    var nome;
    switch (j) {
        case 0:
            nome = $($(arg).find("strong")[0]).text().trim();
            rawdata[id].azienda = nome;
            rawdata[id].dettaglio = $($(arg).find("span")[0]).text().trim();
            break;
        case 1:
            rawdata[id].ultimo = $($(arg).find("span")[0]).text().trim();
            break;
        case 2:
            rawdata[id].perc = $($(arg).find("span")[0]).text().trim();
            break;
        case 3:
            rawdata[id].ora = $($(arg).find("span")[0]).text().trim();
            break;
        case 4:
            rawdata[id].minimo = $($(arg).find("span")[0]).text().trim();
            break;
        case 5:
            rawdata[id].massimo = $($(arg).find("span")[0]).text().trim();
            break;
        case 6:
            rawdata[id].apertura = $($(arg).find("span")[0]).text().trim();
            break;
    }
}

/// INIZIO Attività
var dataOdierna = formatDateShort(new Date());
var rawdata = {}
// Lettura HTML
loadHtml(process.argv[2], 1);
loadHtml(process.argv[2], 2);
loadHtml(process.argv[2], 3);
var dati = [];
// analisi rawdata per successivo salvataggio in file
Object.keys(rawdata).forEach(k => {
    var entry = rawdata[k];
    // console.log("Aggiunta azione", k, `ora -${entry.ora}- %-${entry.perc}- dato-{entry.ultimo}-`);
    console.log("Aggiunta azione", k);
    if (entry && entry.perc && entry.perc !== "") {
        var dato = {};
        dato.data = dataOdierna;
        //    dato.dataUTC = new Date();
        dato.azienda = entry.azienda;
        dato.ultimo = eval(entry.ultimo.replace(",", "."));
        dato.perc = eval(entry.perc.replace(",", "."));
        //dato.ora = formatOra(entry.ora);
        dato.minimo = eval(entry.minimo.replace(",", "."));
        dato.massimo = eval(entry.massimo.replace(",", "."));
        dato.apertura = eval(entry.apertura.replace(",", "."));
        dati.push(dato);
    }
})
// Lettura file globale
var mappa_borsa = getBorsa().mappa;

// Iterazione sui dati buoni 
dati.forEach(el => {
    console.log("Aggiunta azione", el.azienda, "a borsa")
    if (!mappa_borsa[el.azienda]) {
        mappa_borsa[el.azienda] = { "abilitata": true };
    }
    Object.assign(mappa_borsa[el.azienda], {
        "dettaglio": el.azienda,
        "azienda": el.azienda,
        "dataAggiornamento": formatDate(new Date()),
        "filename": Normalize(el.azienda).toLowerCase(),
        "filecsv": `${csvPath}${Normalize(el.azienda).toLowerCase()}.csv`,
        "filejson": `${jsonPath}${Normalize(el.azienda).toLowerCase()}.json`
    })
    try {
        var azione = getAzione(mappa_borsa[el.azienda].filejson);
        if (!(azione && azione.dati)) azione = { azienda: el.azienda, dati: {} };
        azione.dati[el.data] = { data: el.data, apertura: el.apertura, variazionePercentuale: el.perc, ultimoValore: el.ultimo, minimo: el.minimo, massimo: el.massimo }
        saveAzione(azione, mappa_borsa[el.azienda].filejson);
    } catch (error) {
        console.log(error);
    }
});
saveBorsa(mappa_borsa)
