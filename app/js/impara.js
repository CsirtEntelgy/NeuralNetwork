var { dateTimeToArray, toArray, toVal, fromArray } = require('./transform').binaryTransform;
var { matrix, mean, abs, round } = require('mathjs');
var { NeuralNetwork } = require('./nn');
const { TrainingSet, listDays, TestSetDate } = require('./TrainingSetClass');
const { getDatiAzione, saveBorsa, getBorsa, formatOra, Normalize, formatDate, formatDateShort } = require("./tools.js");

const fs = require("fs");


function learn(trainingset, nn, { epsilon = 0.01, learningRate = -1, skip = 1000, epochs = 10000, verbose = false }, callback = (iter, error) => { }) {
    var titolo = trainingset.azione;
    var FileName = `output/nn/${titolo.displayName}.${trainingset.key}.json`
    var ninput = trainingset.nbitx;
    var noutput = trainingset.nbity;
    if (!nn) {
        nn = new NeuralNetwork(ninput, round((ninput + noutput) / 2), noutput);
        try {
            nn.load(FileName);
        } catch (error) {

        }
    }
    nn.epochs = epochs;
    var lastErr = 100000;
    if (learningRate > 0) nn.lr = learningRate;
    nn.epsilon = epsilon;
    try {
        nn.train(trainingset.x, trainingset.y, 2, (neurals, iter, err, epoca) => {
            var currErr = mean(abs(err));
            if (iter % skip === 0) {
                if (currErr > lastErr) neurals.lr -= 0.05;
                else if (currErr < lastErr) neurals.lr += 0.05;
                else neurals.lr = 0.5;
                if (neurals.lr > 1) neurals.lr = 0.5;
                if (neurals.lr < 0) neurals.lr = 0.5;
                lastErr = currErr;
                //console.log("\u001b[2K\u001b[0E:Learning Iter", iter, `Error: ${round(currErr, 5)}`, "Learnig Rate", neurals.lr, "Soglia errore", neurals.epsilon);
                process.stdout.write(`\u001b[2K\u001b[0EEpoca:${epoca}\tLearning Iter: ${iter}\tError: ${round(currErr, 5)}\tLearnig Rate: ${round(neurals.lr, 4)}`);
            }
            callback(iter, currErr);
        });
        process.stdout.write(`\n`);
        //nn.save(FileName);
    } catch (error) {
        console.log(error)
    }
    var days = 10;
    var predizioni = new TestSetDate(listDays(trainingset.maxval, days), { nbit: 12, inc: 1 });
    var predinput = predizioni.set_entries();
    //predizioni.display();
    //console.log(predizioni.xraw)
    var pred1 = nn.predict(trainingset.x);
    var pred2 = nn.predict(predinput);
    var xp = [...trainingset.xraw, ...predizioni.xraw];
    var pred = [...pred1.map(x => trainingset.inverty(x)), ...pred2.map(x => trainingset.inverty(x))];

    var resoconto = {
        ReteNeurale: nn,
        azienda: titolo.azienda,
        displayName: titolo.displayName,
        dettaglio: titolo.dettaglio,
        sigla: titolo.sigla,
        ninput: ninput,
        noutput: noutput,
        errore: lastErr,
        //xpattern: trainingset.topatternx(trainingset.xraw),
        //ypattern: trainingset.topatterny(trainingset.yraw),
        x: trainingset.xraw,
        y: trainingset.yraw,
        //learningRate: nn.lr,
        xp: xp,
        yp: pred,
        //xp_pattern: trainingset.topatternx(xp),
        //yp_pattern: trainingset.topatterny(pred),
        ultimaElaborazione: formatDate(new Date()),
    }
    return resoconto;
}

const chiave = process.argv[2] || "variazionePercentuale";
const vel = process.argv[3] || 1000;
const ref_date = process.argv[4] || "2023-01-01";
const epsilon = process.argv[5] || 0.01;
//var azioni = JSON.parse(fs.readFileSync("json/azioni.json", "utf8"));
var elaborazione;
var verbose = false;
try { elaborazione = JSON.parse(fs.readFileSync("dati/riepilogo.json", "utf8")); } catch (error) { elaborazione = {}; }
const epochs = vel * 100;
var { lista, mappa } = getBorsa();
var oggi = formatDateShort(new Date());
console.log("Oggi: ", oggi);
Object.keys(mappa).sort().forEach(k => {
    var entry = mappa[k];
    var elab = {};
    var errori = [];
    if (entry.azienda && entry.abilitata) {
        console.log("---------------", entry.azienda, "----------------------------------");
        dati = getDatiAzione(entry.azienda);
        if (dati) {
            var azione = { ...entry, dati };
            var trt = new TrainingSet(azione, chiave, { inc: 30, nbit: 20, accept: function (dt, val) { return (dt > ref_date); } });
            console.log("Soglia errore:", epsilon, "Chiave:", chiave);
            if (trt && trt.xraw && trt.xraw.length > 10) {
                var ninput = trt.nbitx;
                var noutput = trt.nbity;
                var nn = new NeuralNetwork(ninput, round((ninput + noutput) / 2), noutput);
                nn.load("dati/nn/" + chiave + "/" + entry.filename + ".json");
                console.log(nn.toString());
                elab = learn(trt, nn, { epsilon: epsilon, verbose: verbose, learningRate: 0.5, skip: vel, epochs: epochs }, ((iter, error) => {
                    (iter % vel === 0) && errori.push({ iter, error });
                }));
                if (elab.errore > 0.5) {
                    entry.abilitata = false;
                    console.log("Rete sclerata - rifiuto nelle prossime elaborazioni di :", azione.azienda);
                    saveBorsa(mappa);
                }
                elaborazione[k] = entry;
                elab.errori = errori;
                if (!elaborazione[k].training) elaborazione[k].training = {};
                // Decidere cosa salvare come file singolo cancellandolo dal riepilogo
                elab.ReteNeurale.save("dati/nn/" + chiave + "/" + entry.filename + ".json");
                elab.ReteNeurale = "dati/nn/" + chiave + "/" + entry.filename + ".json";
                elaborazione[k].training[chiave] = elab;
                fs.writeFileSync(`dati/riepilogo.json`, JSON.stringify(elaborazione, null, " "));
            }
        }
    }
});


