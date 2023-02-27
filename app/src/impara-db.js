
var { mean, abs, round } = require('mathjs');
var { NeuralNetwork } = require('./nn');
const { TrainingSet, listDays, TestSetDate } = require('./TrainingSetClass');
const { formatDateShort } = require("./tools.js");
const sqlite = require('sqlite3');
const db_borsa = "./db/borsa.db";
const db_reti = "./db/reti.db";
const db_elab = "./db/elaborazioni.db";
const print = console.log;
async function select(db, sql, parms) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(sql, parms, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    })
}
function ReteNeurale(id_azienda, chiave, ninput, nhidden, noutput, cb) {
    const db = new sqlite.Database(db_reti);
    db.all("select jsonData from nn where id_azienda=? and chiave=? and n1=? and n2=? and n3=?", [id_azienda, chiave, ninput, nhidden, noutput], (err, res) => {
        var nn = new NeuralNetwork(ninput, nhidden, noutput);
        var msg = "Nuovo"
        if (res.length === 1) {
            var nnJSON = res[0].jsonData;
            Object.assign(nn, JSON.parse(nnJSON));
            msg = "Dal Database";
        }
        cb(nn, msg);
        db.serialize(() => {
            db.run("delete from nn where id_azienda=? and chiave=? and n1=? and n2=? and n3=?", [id_azienda, chiave, ninput, nhidden, noutput],
                (err) => err && console.log(err));
            db.run("insert into nn (id_azienda,chiave,n1,n2,n3,jsonData) values(?,?,?,?,?,?)", [id_azienda, chiave, ninput, nhidden, noutput, JSON.stringify(nn.stringify())],
                (err) => err && console.log(err));
            db.close();
            console.log("Rete Neurale", id_azienda, chiave, "SALVATA");
        });
    });
}

function leggiDati(id_azienda, chiave, ref_date, cb) {
    var query = "select data," + chiave + " from dati where id_azienda=? and data>? order by data"
    const db = new sqlite.Database(db_borsa);
    db.all(query, [eval(id_azienda), ref_date], (err, res) => {
        cb(res);
        db.close();
    });
}
async function salvaIterazioni(id_azienda, chiave, iterazioni) {
    const db = new sqlite.Database(db_elab);
    //db.prepare("create table if not exists iterazioni (id_azienda integer,chiave text,iter integer,errore number)").run();
    db.serialize(() => {
        db.run("delete from iterazioni where id_azienda=? and chiave=?", [id_azienda, chiave], (err, res) => {
            if (err) console.log("Delete Iterazioni", err);
        });
        console.log("Cancellate iterazioni", id_azienda, chiave);
        let stmt = db.prepare("insert into iterazioni (id_azienda,chiave,iter,errore) values(?,?,?,?)");
        for (let el of iterazioni) {
            stmt.run([id_azienda, chiave, el.iter, el.err], (err) => {
                if (err) console.log("Insert Iterazioni", err);
            })
        }
        stmt.finalize();
        console.log("Salvate iterazioni", id_azienda, chiave);
        db.close();
    });
}

const vel = process.argv[2] || 10;
const ref_date = process.argv[3] || "2023-01-01";
const epsilon = process.argv[4] || 0.01;
//var azioni = JSON.parse(fs.readFileSync("json/azioni.json", "utf8"));
const epochs = vel * 100;
var oggi = formatDateShort(new Date());
print("Oggi: ", oggi);
print("Iterazioni:", vel, "Data riferimento:", ref_date, "Epsilon:", epsilon, "Epoche:", epochs);
function elabora(chiave, entry) {
    //    console.log("Elaborazione", entry.azienda);
    leggiDati(entry.id_azienda, chiave, ref_date, righe => {
        //console.log(righe);
        var dati = righe.map(el => { return { x: el.data, y: eval(el[chiave]) } });
        var trt = new TrainingSet(dati, { inc: 30, nbit: 20 });
        if (trt.valida) {
            var ninput = trt.nbitx;
            var noutput = trt.nbity;
            var nhidden = round((ninput + noutput) / 2);
            ReteNeurale(entry.id_azienda, chiave, ninput, nhidden, noutput, (nn, msg) => {
                print("------------------", entry.azienda, "----------------------------------");
                print("Dettaglio : ", entry.dettaglio, "Record : ", entry.dati)
                print("Soglia errore:", epsilon, "Chiave:", chiave);
                trt.display();
                nn.epochs = epochs;
                print("Rete:", msg, nn.toString());
                new Promise((resolve, reject) => {
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
                    }, () => {
                        process.stdout.write("\n");
                        print("Minimo errore ", minIter, "Massimo errore ", maxIter);
                        salvaIterazioni(entry.id_azienda, chiave, iterazioni);
                        resolve();
                    });
                });
            });
        }
    });
}
async function leggiTuttoP() {
    return new Promise((resolve, reject) => {
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
async function leggiTutto(cb) {
    const sqlite = require("sqlite3");
    query = "select * from abilitate  order by azienda";
    const db = new sqlite.Database(db_borsa);
    db.serialize(() => {
        db.each(query, (err, azione) => cb(azione));
        db.close();
    });
}

const run = async () => {
    await leggiTutto(row => elabora("ultimoValore", row));
    await leggiTutto(row => elabora("ultimoValore", row));
}
run();
