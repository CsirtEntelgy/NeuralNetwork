const fs = require("fs")
function Normalize(txt) {
    var v = txt.replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "")
        .replace(".", "_").replace(".", "_").replace(".", "_")
        .replace(".", "_").replace("'", "_").replace("&", "_").replace(",", "_")
        .replace("%", "_").replace("%", "_")
        .replace("-", "_").replace("-", "_");
    return v;
}
function formatFileDate(d) {
    return "" +
        d.getFullYear() +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        ("0" + d.getDate()).slice(-2) +
        ("0" + d.getHours()).slice(-2) +
        ("0" + d.getMinutes()).slice(-2) +
        ("0" + d.getSeconds()).slice(-2);
}

function formatDate(d) {
    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
        + ":" + ("0" + d.getSeconds()).slice(-2);
    return datestring;
}
function formatDateShort(d) {
    var datestring =
        d.getFullYear() + "-" +
        ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        ("0" + d.getDate()).slice(-2);
    return datestring;
}
function formatOra(txt) {
    var hh = txt.split(".");
    if (hh.length < 3) {
        hh[0] = "00";
        hh[1] = "00";
        hh[2] = "00";
    }
    return ("0" + hh[0]).slice(-2) + ":" + ("0" + hh[1]).slice(-2) + ":" + ("0" + hh[2]).slice(-2);
}
const jsonPath = "dati/azioni/json/";
const csvPath = "dati/azioni/csv/";
const fileMappa = "dati/mappa.json"

function getBorsa() {
    var lista = [];
    var mappa = {};
    var buffer = fs.readFileSync("dati/mappa_borsa.csv", "utf8");
    var rows = buffer.split(/\r?\n/);
    rows.forEach(row => {
        var entry = row.split('|');
        if (entry[0] && entry[0] != '') {
            var bufferAzione = fs.readFileSync(entry[5], "utf8").split(/\r?\n/);
            var azione = {
                azienda: entry[0],
                dettaglio: entry[1],
                sigla: entry[2],
                filename: entry[3],
                filejson: entry[4],
                filecsv: entry[5],
                dataAggiornamento: entry[6],
                abilitata: entry[7],
                records: bufferAzione.length
            };
            lista.push(azione);
            mappa[entry[0]] = azione;
        }
    })
    return { mappa: mappa, lista: lista }
}

function saveBorsa(lista) {
    fs.unlinkSync("dati/mappa_borsa.csv");
    for (let key in lista) {
        var azione = lista[key];
        var riga = [azione.azienda, azione.dettaglio, azione.sigla, azione.filejson, azione.filecsv, azione.dataAggiornamento, azione.abilitata].join("|");
        fs.appendFileSync("dati/mappa_borsa.csv", riga + "\n");
    }
}


function Riepilogo() {
    var mappa = {}
    try {
        mappa = JSON.parse(fs.readFileSync("dati/riepilogo.json", "utf8"));
    } catch (error) {
        mappa = {}
    }
    return mappa;
}

fs.mkdirSync(jsonPath, { recursive: true });
fs.mkdirSync(csvPath, { recursive: true });

function getDatiAzione(nome) {
    var borsa = getBorsa().mappa;
    var azione = {};
    if (borsa[nome] && borsa[nome].filecsv) {
        var azionebuffer = fs.readFileSync(borsa[nome].filecsv, "utf8").split(/\r?\n/);
        azionebuffer.forEach(row => {
            var item = row.split(",");
            var dato = {
                "data": item[0],
                "apertura": eval(item[1]),
                "massimo": eval(item[2]),
                "minimo": eval(item[3]),
                "ultimoValore": eval(item[4]),
                "variazionePercentuale": eval(item[5])
            }
            azione[item[0]] = dato;
        })
    }
    return azione;
}

function getAzione(jsonfile) {
    var azione;
    try {
        azione = JSON.parse(fs.readFileSync(jsonfile, "utf8"));
        Object.keys(azione.dati).sort().forEach(k => {
            var dato = azione.dati[k];
            if (!(dato.ultimoValore && dato.variazionePercentuale))
                delete azione.dati[k];
        });
    } catch (error) {
        azione = {};
        console.log("Azione da file", jsonfile, "NON trovata");
    }
    return azione;
}
function saveAzione(azione, jsonfile) {
    delete azione.displayName;
    delete azione.dettaglio;
    delete azione.aggiornamento;
    Object.keys(azione.dati).sort().forEach(k => {
        var dato = azione.dati[k];
        if (!(dato.ultimoValore && dato.variazionePercentuale))
            delete azione.dati[k];
    });
    fs.writeFileSync(jsonfile, JSON.stringify(azione, null, " "));
}
function saveAzioneCsv(azione, csvfile) {
    var rows = [];
    Object.keys(azione.dati).sort().forEach(k => {
        var dato = azione.dati[k];
        if (dato.ultimoValore && dato.variazionePercentuale)
            rows.push([k, dato.apertura, dato.massimo, dato.minimo, dato.ultimoValore, dato.variazionePercentuale].join(";"));
    });
    console.log("Scrittura", csvfile);
    fs.writeFileSync(csvfile, rows.join("\n") + "\n");
}
function saveAzioneCsv2(azione, csvfile) {
    var rows = [];
    Object.keys(azione.dati).sort().forEach(k => {
        var dato = azione.dati[k];
        if (dato.ultimoValore && dato.variazionePercentuale)
            rows.push([k, dato.ultimoValore, dato.variazionePercentuale].join(";"));
    });
    console.log("Scrittura per android", csvfile);
    fs.writeFileSync(csvfile, rows.join("\n") + "\n");
}
module.exports = {
    saveAzioneCsv,
    saveAzioneCsv2,
    getAzione: getAzione,
    getDatiAzione: getDatiAzione,
    saveAzione: saveAzione,
    getBorsa: getBorsa,
    saveBorsa,
    csvPath: csvPath,
    jsonPath: jsonPath,
    Normalize: Normalize,
    formatDate: formatDate,
    formatDateShort: formatDateShort,
    formatOra: formatOra,
    Riepilogo
};

