const fs = require("fs");
const { round } = require("mathjs");
const { getAzione, getBorsa, saveBorsa, Normalize, jsonPath, csvPath, formatDate, saveAzione } = require("./tools.js");

var mappaborsa = getBorsa().mappa;
function addAzioni(sigla, nome) {
    console.log("Dato storico per ", sigla, "-->", nome)
    var dati = fs.readFileSync("storici/" + sigla + ".csv", "utf8");
    var i = 0;
    var linee = dati.split(/\r?\n/);
    var f = Normalize(nome).toLowerCase();
    if (!mappaborsa[nome]) mappaborsa[nome] = {};
    Object.assign(mappaborsa[nome], {
        sigla: sigla,
        filename: f,
        filejson: jsonPath + f + ".json",
        filecsv: csvPath + f + ".csv",
        dataAggiornamento: formatDate(new Date()),
    })
    var azione = getAzione(mappaborsa[nome].filejson);
    if (!(azione && azione.dati)) azione = { azienda: nome, dati: {} };

    for (var i = 1; i < linee.length; i++) {
        var line = linee[i];
        var f = line.split(",");
        var apertura = eval(f[1]);
        var ultimo = eval(f[4]);
        var vp = round((apertura - ultimo) / (apertura), 2);
        var qtz = { data: f[0], apertura: apertura, massimo: eval(f[2]), minimo: eval(f[3]), ultimoValore: ultimo, variazionePercentuale: vp }
        azione.dati[f[0]] = qtz;
    }
    saveAzione(azione, mappaborsa[nome].filejson);
}

const allContents = fs.readFileSync('lista.csv', "utf-8");

function normalize(txt) {
    if (txt)
        return txt.replace(/\x00/g, "").trim()
    return ""
}
console.log(typeof allContents);
var righe = allContents.split(/\r?\n/);

var records = righe.slice(1).map(profile => {
    const [azienda, sigla] = profile.split('\t');
    return { azienda: normalize(azienda), sigla: normalize(sigla) };
});
var borsa = {}

records.forEach(val => {
    if (val.sigla != "") addAzioni(val.sigla, val.azienda);
})

saveBorsa(mappaborsa);
