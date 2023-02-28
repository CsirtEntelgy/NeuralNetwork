
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
    query = "select * from abilitate  order by azienda";
    const db = new Database(db_borsa, { verbose: console.log });
    var stmt = db.prepare(query);
    for (let azione of stmt.iterate()) {
        cb(azione);
    };
    db.close();
}

function leggiDati(id_azienda, chiave, ref_date, cb) {
    var query = "select data," + chiave + " from trend where id_azienda=? and data>? order by data"
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
    console.log("Elaborazione", entry);
    leggiDati(entry.id_azienda, chiave, ref_date, righe => {
        var dati = righe.map(el => { return { x: el.data, y: eval(el[chiave]) } });
        var trt = new TrainingSet(dati, { inc: 30, nbit: 20 });
        if (trt.valida) {
            var ninput = trt.nbitx;
            var noutput = trt.nbity;
            var nhidden = round((ninput + noutput) / 2);
            ReteNeurale(entry.id_azienda, chiave, ninput, nhidden, noutput, (res, msg) => {
                print("------------------", entry.azienda, "----------------------------------");
                print("Dettaglio : ", entry.dettaglio, "Record : ", entry.dati)
                print("Soglia errore:", epsilon, "Chiave:", chiave);
                trt.display();
                var nn = res;
                nn.epochs = epochs;
                print("Rete:", msg, nn.toString());
                var minIter = { iter: 0, err: 100000 };
                var maxIter = { iter: 0, err: -100000 };
                var iterazioni = []
                nn.train(trt.x, trt.y, 1, (neurals, iter, err, epoca) => {
                    var currErr = mean(abs(err));
                    //console.log(iter, currErr);
                    if (minIter.err > currErr) minIter = { iter, err: currErr };
                    if (maxIter.err < currErr) maxIter = { iter, err: currErr };
                    iterazioni.push({ iter: iter, err: currErr });
                    process.stdout.write(`\u001b[2K\u001b[0EEpoca:${epoca}\tLearning Iter: ${iter}\tError: ${round(currErr, 5)}\tLearnig Rate: ${round(neurals.lr, 4)}`);
                });
                process.stdout.write("\n");
                print("Minimo errore ", minIter, "Massimo errore ", maxIter);
                salvaIterazioni(entry.id_azienda, chiave, iterazioni);
            });
        }
    })
}
["ultimoValore", "variazionePercentuale"].forEach(chiave => {
    leggiTutto(row => elabora(chiave, row));
    //leggiAzione(1, row => elabora(chiave,row));
})