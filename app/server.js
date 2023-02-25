var html = require("./src/html");
const env = require("./src/env");
const fs = require('fs');
const path = require('path');
const { getAzione, saveMappa, getBorsa, formatOra, Normalize, formatDate, formatDateShort } = require("./tools.js");

const htmlDir = "html/";

const tabelle = fs.readdirSync(__dirname + "../dati/");
const entities = fs.readdirSync(__dirname + "/logico");
const aree = fs.readdirSync(__dirname + "/html/area");
console.log("Aree", aree);
html.start(env.port, __dirname, htmlDir, "/main.html");
const rispondi = html.rispondi;
const LogFormat = html.LogFormat;
var versione = { dataAvvio: new Date() };

html.post("/menu/Entities", (dati, request, response) => {
    rispondi(response, null, entities);
});

html.post("/menu/Aree", (dati, request, response) => {
    rispondi(response, null, aree);
});

html.post("/azione/:nome", (dati, request, response) => {
    console.log(request.params.nome);
    var area = fs.readFileSync(__dirname + "/html/area/" + request.params.file);
    rispondi(response, null, JSON.parse(area));
});

html.post("/logico/:param", (dati, request, response) => {
    console.log(request.params.param);
    var fn = __dirname + "/logico/" + request.params.param;
    var data = fs.readFile(fn, (data) => {
        rispondi(response, null, data);
    })
})

html.get("/", (request, response) => {
    response.send("Ti sarà dato");
    response.end();
})

html.post("/wait", (dati, request, response) => {
    var user = dati.user;
    setTimeout(function () {
        rispondi(response, null, {
            log: "Ritorno"
        });
    }, dati.secs * 1000);
})

function toNormalDate() {
    var x = new Date()
    var month = x.getMonth() + 1;
    var day = x.getDate();
    var h = x.getHours();
    var m = x.getMinutes();
    var s = x.getSeconds();
    return (day > 9 ? day : "0" + day) + "/" + (month > 9 ? month : "0" + month) + "/" + (x.getYear() + 1900) + " " + (h > 9 ? h : "0" + h) + ":" + (m > 9 ? m : "0" + m) + ":" + (s > 9 ? s : "0" + s);
}

