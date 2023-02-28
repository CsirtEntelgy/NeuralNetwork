const sqlite = require("sqlite3");

var { mean, abs, round, random, fineStructureDependencies } = require('mathjs');
var { NeuralNetwork } = require('./nn');
const { TrainingSet, listDays, TestSetDate } = require('./TrainingSetClass');

const db_borsa = "./db/borsa.db";
const db_reti = "./db/reti.db";
const db_elab = "/tmp/elaborazioni.db";
//require("fs").unlinkSync(db_elab);
const db_elaborazioni = new sqlite.Database(db_elab);
let pulizia = async () => {
    db_elaborazioni.run("create table if not exists iterazioni (id_azienda integer,chiave text,iter integer,errore number,primary key (id_azienda,chiave))", (err) => {
        if (err) { console.log("Create Table", err); return; }
    });
    db_elaborazioni.run("delete from iterazioni ", (err) => {
        if (err) { console.log("delete ", err); return; }
        console.log("Delete eseguito");
    });
}
pulizia();
const print = console.log;
const { formatDateShort } = require("./tools.js");
function leggiTutto(chiave, ref_date, elaborazione) {
    query = "select * from abilitate order by azienda";
    const db1 = new sqlite.Database(db_borsa);
    db1.each(query, (err, azione) => {
        if (err) { console.log(err); throw err; }
        var query2 = "select data," + chiave + " from trend where id_azienda=? and data>? order by data"
        db1.all(query2, [eval(azione.id_azienda), ref_date], (err, righe) => {
            if (err) { console.log(err); throw err; }
            var dati = righe.map(el => { return { x: el.data, y: eval(el[chiave]) } });
            var trt = new TrainingSet(dati, { inc: 30, nbit: 20 });
            var ninput = trt.nbitx;
            var noutput = trt.nbity;
            var nhidden = round((ninput + noutput) / 2);
            azione.dati = righe;
            azione.trt = trt;
            const db2 = new sqlite.Database(db_reti);
            db2.all("select jsonData from nn where id_azienda=? and chiave=?", [azione.id_azienda, chiave], (err, nnJSON) => {
                if (err) { console.log(err); throw err; }
                var rete = null;
                var nn = new NeuralNetwork(ninput, nhidden, noutput);
                if (nnJSON.length > 0) {
                    rete = JSON.parse(nnJSON[0].jsonData);
                    Object.assign(nn, rete);
                }
                azione.nn = nn;
                var res = elaborazione(chiave, azione);
                SalvaElaborazione(azione.id_azienda, chiave, res);
                SalvaReteNeurale(azione.id_azienda, chiave, nn);
            });
            db2.close();
        });
    });
    db1.close();
}

function SalvaElaborazione(id_azienda, chiave, res) {
    console.log("Salvataggio risultato elaborazione", res[0], res[1]);
}

function SalvaReteNeurale(id_azienda, chiave, nn) {
    console.log("Salvataggio Rete Neurale", nn.toString());
}

const vel = process.argv[2] || 1;
const ref_date = process.argv[3] || "2023-01-01";
const epsilon = process.argv[4] || 0.01;
//var azioni = JSON.parse(fs.readFileSync("json/azioni.json", "utf8"));
const epochs = vel * 100;
var oggi = formatDateShort(new Date());
print("Oggi: ", oggi);
print("Iterazioni:", vel, "Data riferimento:", ref_date, "Epsilon:", epsilon, "Epoche:", epochs);

leggiTutto("ultimoValore", ref_date, (chiave, azione) => {
    console.log(chiave, azione.azienda, azione.dati.length, azione.nn.toString(),
        azione.trt.toString());
    var res = random([2], -1.0, 1.0).map((x, index) => { return { iter: index, err: x } });
    return res;
})
