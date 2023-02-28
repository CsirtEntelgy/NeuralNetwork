var html = require("./src/html");
const env = require("./src/env");
const fs = require('fs');
const os = require('os');
const path = require('path');

const { re } = require("mathjs");
var exec = require('child_process').exec;
const sqlite = require('sqlite3');

console.log(__dirname);

const htmlDir = "html/";
console.log(__dirname, htmlDir);
html.start(env.port, __dirname, htmlDir, "/main.html");
const rispondi = html.rispondi;
const LogFormat = html.LogFormat;

function leggiMappa(tabella = "abilitate", cb) {
    query = "select * from " + tabella + " order by azienda";
    const db = new sqlite.Database('./db/borsa.db');
    db.all(query, (err, res) => cb(err, res));
    db.close();
}

const query1 = "select * from mappa where id_azienda=?";
const query2 = "select * from dati where id_azienda=? order by data"

function leggiAzione(id_azienda, cb) {
    const db = new sqlite.Database('./db/borsa.db', { verbose: console.log });
    db.all(query1, [eval(id_azienda)], (err, azioni) => {
        if (err) cb(err, null);
        else {
            var azione = azioni[0];
            db.all(query2, [eval(id_azienda)], (err, dati) => {
                azione.trend = dati;
                cb(err, azione);
            });
        }
    });
    db.close();
}

html.get("/azione", (dati, request, response) => {
    console.log("azione", dati);
    if (dati.id)
        leggiAzione(dati.id, (err, azione) => {
            rispondi(response, err, azione);
        })
    else
        rispondi(response, "Id non definito", null);
});
function dettaglio(dati, response) {
    if (dati.id) {
        leggiAzione(dati.id, (err, azione) => {
            rispondi(response, err, azione);
        })
    } else
        rispondi(response, "Id non definito", null);
}

html.get("/datiHtml", (dati, request, response) => {
    console.log("datiHtml", dati);
    dettaglio(dati, response)
});
html.post("/datiHtml", (dati, request, response) => {
    console.log("datiHtml", dati);
    dettaglio(dati, response)
});
html.post("/grafico", (dati, request, response) => {
    console.log("/grafico", dati.chiave);
    graficoGnuplot(dati, (err, svg) => rispondi(response, err, svg));
});
html.get("/trainingHtml", (dati, request, response) => {
    console.log("trainingHtml", dati);
    graficoGnuplot(dati, (err, svg) => rispondi(response, err, svg));
});
html.get("/graphHtml", (dati, request, response) => {
    console.log("graphHtml", dati);
    if (dati.id) {
        leggiAzione(dati.id, (err, azione) => {
            rispondi(response, err, azione);
        })
    } else
        rispondi(response, "Id non definito", null);
});

html.post("/azioni", (dati, request, response) => {
    leggiMappa("mappa", (err, azioni) => {
        rispondi(response, err, azioni);
    })
});
html.post("/azioniLimited", (dati, request, response) => {
    leggiMappa("abilitate", (err, azioni) => {
        rispondi(response, err, azioni);
    })
});
function run(cmd) { return require('child_process').execSync(cmd).toString(); }
function graficoGnuplot(dati, cb) {
    var svg = plot(dati.set, dati.chiave);
    cb(null, svg);
}


function plot(dati, chiave) {
    var tmpfile = path.join(os.tmpdir(), "foo." + chiave + "." + Math.round(Math.random() * 100));
    var buffer = fs.readFileSync("gnuplot/plot_" + chiave + ".plt");
    if (dati && dati.length > 2) {
        dati.forEach(e => {
            buffer += `${e[0]},${e[1]}\n`;
        });
        buffer += "e";
        fs.writeFileSync(tmpfile, buffer);
        return run("gnuplot " + tmpfile);
    } else return "";
}
function plot2(dati, chiave) {
    var tmpfile = path.join(os.tmpdir(), "foo." + chiave + "." + Math.round(Math.random() * 100));
    var buffer = fs.readFileSync("gnuplot/plot_Errori.plt");
    if (dati && dati.length > 2) {
        dati.forEach(e => {
            buffer += `${e.iter},${e.error}` + "\n";
        });
        buffer += "e";
        fs.writeFileSync(tmpfile, buffer);
        return run("gnuplot " + tmpfile);
    } else return "";
}
function generaHtml(azione) {
    var tbl = "<tr><td>Data</td><td>UltimoValore</td><td>variazione %</td></tr>\n<tr>" +
        Object.keys(azione.dati).sort().
            map(k => { return ["<td>", azione.dati[k].data, "</td><td>", azione.dati[k].ultimoValore, "</td><td>", azione.dati[k].variazionePercentuale, "</td>"].join("") })
            .join("</tr>\n<tr>") + "</tr>\n";
    var uv = Object.keys(azione.dati).sort().map(k => { return { x: k, y: azione.dati[k].ultimoValore }; });
    var vp = Object.keys(azione.dati).sort().map(k => { return { x: k, y: azione.dati[k].variazionePercentuale }; });
    var nv = {}, ne = {};
    if (azione.training) {
        Object.keys(azione.training).forEach(chiave => {
            let dato = azione.training[chiave];
            nv[chiave] = [];
            ne[chiave] = dato.errori || [];
            if (dato && dato.x && dato.y) {
                for (var i = 0; i < dato.x.length; i++) {
                    nv[chiave].push({ x: dato.x[i], y: dato.y[i] });
                }
            }
        });
    }
    var gplot1, gplot2;
    try { gplot1 = plot(uv, "ultimoValore") } catch (err) { gplot1 = "" }
    try { gplot2 = plot(uv, "variazionePercentuale") } catch (err) { gplot2 = "" }
    var res = [
        "<html>",
        `  <script src="../tools.js"></script>`,
        '  <body>',
        `    <h1 id="azienda" style="text-align:center;">${azione.azienda}</h1>`,
        `    <a href="main.html">home</a>`,
        `    <table id="storico" style="font-size:small;float:left"  border="1">`,
        tbl,
        `    </table>`,
        `    <div  style="font-size:small;float:right">`,
        `    <div  style="font-size:small">`,
        // Grafico di gnuplot
        plot2(ne.ultimoValore, "Errori"),
        "<br>",
        plot2(ne.variazionePercentuale, "Errori"),
        "<br>",
        gplot1,
        "<br>",
        gplot2,
        "<br>",
        plot(nv.ultimoValore, "TrainingUV"),
        "<br>",
        plot(nv.variazionePercentuale, "TrainingVP"),
        "<br>",
        `    </div>`,
        `    </div>`,
        `  </body>`,
        "</html>"
    ].join("\n");
    return res;
}





