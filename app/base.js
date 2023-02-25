var html = require("./src/html");
const env = require("./src/env");
const fs = require('fs');
const os = require('os');
const path = require('path');
const { getAzione, Riepilogo, getBorsa, formatOra, Normalize, formatDate, formatDateShort } = require("./js/tools.js");
var exec = require('child_process').exec;

console.log(__dirname);
const riepilogo = Riepilogo();
var id = 1;
var borsa = {};
Object.keys(riepilogo).sort().forEach(k => {
    let azione = riepilogo[k];
    var entry = getAzione(azione.filejson);
    console.log(entry.azienda, Object.keys(entry.dati).length);
    azione.dati = entry.dati;
    azione.id = id;
    borsa[id] = azione;
    id++;
});
const htmlDir = "html/";
console.log(__dirname, htmlDir);
html.start(env.port, __dirname, htmlDir, "/main.html");
const rispondi = html.rispondi;
const LogFormat = html.LogFormat;
html.get("/azione", (dati, request, response) => {
    console.log("azione", dati);
    if (dati.id)
        rispondi(response, null, borsa[dati.id]);
    else
        rispondi(response, "Id non definito", null);
});

html.get("/datiHtml", (dati, request, response) => {
    console.log("datiHtml", dati);
    if (dati.id) {
        response.send(generaHtml(borsa[dati.id]));
    } else
        rispondi(response, "Id non definito", null);
});
html.get("/trainingHtml", (dati, request, response) => {
    console.log("trainingHtml", dati);
    if (dati.id) {
        response.send(generaHtml(borsa[dati.id]));
    } else
        rispondi(response, "Id non definito", null);
});
html.get("/graphHtml", (dati, request, response) => {
    console.log("graphHtml", dati);
    if (dati.id) {
        response.send(generaHtml(borsa[dati.id]));
    } else
        rispondi(response, "Id non definito", null);
});

html.post("/azioni", (dati, request, response) => {
    var lista = Object.keys(riepilogo).sort().map(k => {
        return {
            id: riepilogo[k].id,
            sigla: riepilogo[k].sigla,
            azienda: riepilogo[k].azienda,
            abilitata: riepilogo[k].abilitata,
            training1: riepilogo[k].training && riepilogo[k].training.ultimoValore && riepilogo[k].training.ultimoValore.errore,
            training2: riepilogo[k].training && riepilogo[k].training.variazionePercentuale && riepilogo[k].training.variazionePercentuale.errore
        };
    });
    rispondi(response, null, lista);
});
html.post("/azioniLimited", (dati, request, response) => {
    var lista = Object.keys(riepilogo).sort().map(k => {
        if (riepilogo[k].training.ultimoValore && riepilogo[k].training.ultimoValore.errore < dati.soglia)
            return {
                id: riepilogo[k].id,
                sigla: riepilogo[k].sigla,
                azienda: riepilogo[k].azienda,
                abilitata: riepilogo[k].abilitata,
                training1: riepilogo[k].training && riepilogo[k].training.ultimoValore && riepilogo[k].training.ultimoValore.errore,
                training2: riepilogo[k].training && riepilogo[k].training.variazionePercentuale && riepilogo[k].training.variazionePercentuale.errore
            };
    });
    rispondi(response, null, lista);
});
function run(cmd) { return require('child_process').execSync(cmd).toString(); }


function plot(dati, chiave) {
    var tmpfile = path.join(os.tmpdir(), "foo." + chiave + "." + Math.round(Math.random() * 100));
    var buffer = fs.readFileSync("gnuplot/plot_" + chiave + ".plt");
    if (dati && dati.length > 2) {
        dati.forEach(e => {
            buffer += `${e.x},${e.y}\n`;
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
            map(k => { return ["<td>", k, "</td><td>", azione.dati[k].ultimoValore, "</td><td>", azione.dati[k].variazionePercentuale, "</td>"].join("") })
            .join("</tr>\n<tr>") + "</tr>\n";
    var uv = Object.keys(azione.dati).sort().map(k => { return { x: k, y: azione.dati[k].ultimoValore }; });
    var vp = Object.keys(azione.dati).sort().map(k => { return { x: k, y: azione.dati[k].variazionePercentuale }; });
    var nv = {}, ne = {};
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
        plot(uv, "ultimoValore"),
        "<br>",
        plot(vp, "variazionePercentuale"),
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





