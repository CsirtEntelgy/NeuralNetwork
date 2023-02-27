
var { mean, abs, round } = require('mathjs');
var { NeuralNetwork } = require('./nn');
const { TrainingSet, listDays, TestSetDate } = require('./TrainingSetClass');
const { formatDateShort } = require("./tools.js");
const Database = require('better-sqlite3');
const db_borsa = "./db/borsa.db";
const db_reti = "./db/reti.db";
const db_elab = "./db/elaborazioni.db";
const print = console.log;

function ReteNeurale(id_azienda, chiave, ninput, nhidden, noutput, cb) {
    const db = new Database(db_reti);
    //db.prepare("create table if not exists nn (id_azienda integer,chiave text,n1 integer,n2 integer, n3 integer, jsonData TEXT,primary key (id_azienda,chiave,n1,n2,n3))").run();
    var nnJSON = db.prepare("select jsonData from nn where id_azienda=? and chiave=? and n1=? and n2=? and n3=?")
        .pluck()
        .get(id_azienda, chiave, ninput, nhidden, noutput);
    var nn = new NeuralNetwork(ninput, nhidden, noutput);
    var msg = "Nuovo"
    if (nnJSON) {
        Object.assign(nn, JSON.parse(nnJSON));
        msg = "Dal Database";
    }
    cb(nn, msg);
    db.prepare("delete from nn where id_azienda=? and chiave=? and n1=? and n2=? and n3=?").run(id_azienda, chiave, ninput, nhidden, noutput);
    db.prepare("insert into nn (id_azienda,chiave,n1,n2,n3,jsonData) values(?,?,?,?,?,?)")
        .run(id_azienda, chiave, ninput, nhidden, noutput, JSON.stringify(nn.stringify()));
    db.close();
}

function leggiAzione(id_azienda, cb) {
    query = "select * from abilitate where id_azienda=? order by azienda";
    const db = new Database(db_borsa,);
    var row = db.prepare(query).get(id_azienda);
    cb(row);
    db.close();
}

function leggiTutto(cb) {
    const sqlite = require("sqlite3");
    query = "select * from abilitate  order by azienda";
    const db = new sqlite.Database(db_borsa);
    db.serialize(() => {
        db.each(query, (err, row) => {
            cb(row);
        });
    });
    db.close();
}

async function leggiTuttoP() {
    return new Promise((resolve, reject) => {
        var rows = [];
        const sqlite = require("sqlite3");
        query = "select * from abilitate  order by azienda";
        const db = new sqlite.Database(db_borsa);
        db.serialize(() => {
            db.all(query, (err, righe) => {
                if (err) return reject(err);
                resolve(righe);
            });
        });
        db.close();
    })
}
function leggiDati(id_azienda, chiave, ref_date, cb) {
    var query = "select data," + chiave + " from dati where id_azienda=? and data>? order by data"
    const db = new Database(db_borsa, { verbose: console.log });
    var rows = db.prepare(query).all(eval(id_azienda), ref_date);
    if (rows) cb(rows);
    db.close();
}

function salvaIterazioni(id_azienda, chiave, iterazioni) {
    const db = new Database(db_elab);
    //db.prepare("create table if not exists iterazioni (id_azienda integer,chiave text,iter integer,errore number)").run();
    db.prepare("delete from iterazioni where id_azienda=? and chiave=?").run(id_azienda, chiave);
    var stmt = db.prepare("insert into iterazioni (id_azienda,chiave,iter,errore) values(?,?,?,?)");
    iterazioni.forEach(el => stmt.run(id_azienda, chiave, el.iter, el.err));
    db.close();
}

const vel = process.argv[2] || 1;
const ref_date = process.argv[3] || "2023-01-01";
const epsilon = process.argv[4] || 0.01;
//var azioni = JSON.parse(fs.readFileSync("json/azioni.json", "utf8"));
const epochs = vel * 100;
var oggi = formatDateShort(new Date());
print("Oggi: ", oggi);
print("Iterazioni:", vel, "Data riferimento:", ref_date, "Epsilon:", epsilon, "Epoche:", epochs);
function elabora(chiave, entry) {
    console.log("Elaborazione", entry.azienda);
    return;
}


const run = async () => {
    for (let chiave of ["ultimoValore", "variazionePercentuale"]) {
        console.log(chiave);
        var rows = await leggiTuttoP();
        rows.forEach(row => elabora(chiave, row));
    }
}
run();
