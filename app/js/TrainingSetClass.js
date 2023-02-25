const fs = require("fs");
const { round, pow, min, max, log, exp, random, multiply, dotMultiply, mean, abs, subtract, transpose, add } = require('mathjs');
const { pattern, fromArray, toArray, fromArray2, toArray2 } = require("./realtoarray.js");
const { Normalize, formatDate, formatDateShort } = require("./tools.js");
const red_date = (24 * 60 * 60 * 1000);

function fromData(dt) { return dt / red_date; }
function toData(v) {
    var dt = new Date();
    dt.setTime(v * red_date);
    return dt;
}


function transform(x, { alfa, beta, nbit, cb = (x => x), toBit = toArray }) {
    var v = (alfa * cb(x) + beta);
    return toBit(v, nbit);
}

function invert(x, { alfa, beta, cb = (x => x), fromBit = fromArray }) {
    var v = fromBit(x);
    return cb((v - beta) / alfa);
}

class TestSet {
    constructor(serie, { nbit, mode = 0, verbose = false, inc = 0 }) {


        this.maxv = pow(2, nbit);
        var x1 = min(...serie);
        var x2 = max(...serie);
        this.prec = 1.0 / this.maxv;
        var d = x2 - x1;
        // estendiamo x2 a 0.1 della differenza con x1
        this.xmax = x2 + d * inc;
        // estendiamo x1 a 1/10 della differenza con x2
        this.xmin = x1 - d * inc;
        var delta = (this.xmax - this.xmin);
        if (delta < 0.001) delta = this.prec;
        this.nbit = nbit;
        this.alfa = 1.0 / (x2 + 2 * inc - x1);
        this.beta = (inc - x1) * this.alfa;
        if (mode === 0) {
            this.toBit = toArray;
            this.fromBit = fromArray;
        } else {
            this.toBit = toArray2;
            this.fromBit = fromArray2;
        }
        //console.log("testSet", nbit, mode, verbose, inc,serie.length,serie[0],this);
        this.xraw = serie;
    }
    addEntry(v) {
        this.xraw.push(v);

    }
    topattern(varray) {
        return varray.map(x => pattern(this.transform(max(min(x, this.xmax), this.xmin))));
    }
    transform(x) {
        var v = (this.alfa * x + this.beta);
        return this.toBit(v, this.nbit);
    }
    invert(x) {
        var v = this.fromBit(x);
        return (v - this.beta) / this.alfa;
    }
    set_entries() { return this.xraw.sort().map(x => this.transform(x)); }
    check() {
        var x = this.set_entries();
        var y = x.map(v => this.invert(v))
        for (var i = 0; i < this.xraw.length; i++) {
            console.log(pattern(x[i]), round(this.xraw[i], 2), round(y[i], 2));
        }
        return true;
    }
}
function parseDate(dtxt) {
    return new Date(dtxt + "T12:00:00").getTime() / red_date;
}
function stringifyDate(dt) {
    var y = dt * red_date;
    var d = new Date();
    d.setTime(y);
    return formatDateShort(d);
}
class TestSetDate {
    constructor(serie, { nbit = 12, inc = 1 }) {
        this.testset = new TestSet(serie.map(x => parseDate(x)), { nbit: nbit, inc: inc });
        //console.log("testSetDat", nbit,  inc,serie.length,serie[0],this);
        this.nbit = this.testset.nbit;
        this.xraw = serie;
    }
    display() {
        console.log("TestSetDate", "nbit\t", this.nbit);
        console.log("             #set  \t", this.xraw.length);
    }

    topattern(varray) {
        return varray.map(x => pattern(this.transform(parseDate(x))));
    }
    transform(x) {
        return this.testset.transform(parseDate(x));
    }
    invert(x) {
        return stringifyDate(this.testset.invert(x));
    }
    set_entries() { return this.testset.set_entries(); }
    addEntry(v) {
        this.testset.addEntry(parseDate(v));
    }
    check() {
        var x = this.testset.set_entries();
        var y = x.map(v => this.invert(v));
        for (var i = 0; i < x.length; i++) {
            console.log(pattern(x[i]), this.xraw[i], y[i]);
        }
        return true;
    }
}


class TrainingSet {

    constructor(azione, key, { verbose = false, nbit = 12, accept, mode = 0, inc = 15 }) {
        this.azione = { displayName: azione.displayName, azienda: azione.azienda }
        this.key = key;
        //console.log(this)
        var seriex = [];
        var seriey = [];
        Object.keys(azione.dati).sort().forEach(data => {
            var val = azione.dati[data];
            if (accept(data, val[key])) {
                seriex.push(data);
                seriey.push(val[key]);
            } else {
                (verbose) && console.log("TrainingSet:accept ", azione.azienda, data, val[key], "SKIPPED")
            }
        })
        console.log("TrainingSet ", "Caricati ", seriex.length, "scartati", Object.keys(azione.dati).length - seriex.length)
        console.log("TrainingSet ", "Data minima:", seriex[0], "Data massima:", seriex[seriex.length - 1]);
        console.log("TrainingSet ", "Valore minimo:", seriey[0], "Valore massimo:", seriey[seriey.length - 1]);
        if (seriex.length === 0) {
            return
        }
        try {
            this.trsetx = new TestSetDate(seriex, { verbose: verbose, mode: mode, inc: 30 });
            this.trsety = new TestSet(seriey, { nbit: nbit, mode: mode, verbose: verbose, inc: inc });
            this.x = this.trsetx.set_entries()
            this.y = this.trsety.set_entries();
            this.nbitx = this.trsetx.nbit;
            this.nbity = this.trsety.nbit;
            this.minval = seriex[0];
            this.maxval = seriex[seriex.length - 1];
        } catch (error) {
            console.log(error);
        }
        this.xraw = seriex;
        this.yraw = seriey;
    }
    topatternx(varray) {
        return varray.map(x => pattern(this.transformx(x)));
    }
    topatterny(varray) {
        return varray.map(x => pattern(this.transformy(x)));
    }
    display() {
        console.log("Training Set", "Azienda\t", this.azione.azienda);
        console.log("             ninput\t", this.nbitx);
        console.log("             noutput\t", this.nbity);
        console.log("             chiave\t", this.key);
        console.log("             #set  \t", this.xraw.length);
    }
    writeStream(filename1) {
        fs.writeFileSync(filename1, `# Elaborazione su ${this.key}\n`);
        for (var i = 0; i < this.xraw.length; i++) {
            //fs.appendFileSync(filename1, `${this.xraw[i]}, ${this.yraw[i]}, ${pattern(this.x[i])}, ${pattern(this.y[i])}\n`)
            fs.appendFileSync(filename1, `${this.xraw[i]}, ${this.yraw[i]}\n`)
        }
    }

    check() {
        console.log("Date:")
        this.trsetx.check();
        console.log("Valore:", this.key)
        this.trsety.check();
    }


    transformx(x) {
        return this.trsetx.transform(x);
    }

    transformy(x) {
        return this.trsety.transform(x);
    }

    invertx(x) {
        return this.trsetx.invert(x);
    }
    inverty(x) {
        return this.trsety.invert(x);
    }
    load(filename) {
        var tr = JSON.parse(fs.readFileSync(filename));
        Object.assign(this, tr);
    }
    save(filename) {
        fs.writeFileSync(filename, JSON.stringify(this, null, " "));
        console.log("TrainingSet:save", filename);
    }
}

var listDays = function (start, days) {
    for (var arr = [], dt = new Date(start), i = 0; i < days; i++) {
        dt.setDate(dt.getDate() + 1);
        arr.push(dt.toISOString().slice(0, 10));
    }
    return arr;
};

module.exports = { TrainingSet: TrainingSet, TestSet: TestSet, TestSetDate: TestSetDate, formatDateShort: formatDateShort, listDays: listDays, formatDate: formatDate };
/*
var ts = new TestSet([0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map(x => x * 10),10);
console.log(ts);
ts.check();



var tr=new TrainingSet({ azione: azioni[24], key: "variazionePercentuale", nbit: 12 });
//console.log(tr);
tr.check();
*/


/*
var tsd = new TestSetDate(["2022-01-01", "2022-01-02", "2023-02-03", "2023-03-03"], { nbit: 12 });
console.log(tsd);
tsd.check();
*/


/*
var x = [0, 2, 3, 4, 5, 6, 7];
var y = x.map(t => toArray2(t, max(...x) + 1));
var z = y.map(t => fromArray2(t));
for (var i = 0; i < x.length; i++)
    console.log(x[i], pattern(y[i]), z[i]);
*/
/*
var ts = new TestSet([0, 1.0, 2.0, 3, 4.0].map(x => x),
    { nbit: 4, verbose: true, mode: 0, inc: 2 });
ts.addEntry(1.2);
ts.addEntry(1.3);
ts.addEntry(1.1);

console.log(ts);
ts.check();
//console.log(ts.xraw.map(x => ts.alfa * x + ts.beta), ts.xraw);
*/

/*
var {lista,mappa}=getBorsa();
var azione = getAzione(lista[0].filejson);
var tr = new TrainingSet({ inc: 200, verbose: true, azione: azione, key: "variazionePercentuale", nbit: 12, accept: function (dt, val) { return (dt > "2022-02-03"); } });
//console.log(tr);
tr.check();
var ax = tr.xraw;
ax = ["2023-02-01", "2023-01-01", "2023-01-02", "2023-08-01"];
var ap = tr.topatternx(ax);
for (var i = 0; i < ap.length; i++)
    console.log(ax[i], ap[i]);

var ay = tr.yraw;
ay = [0, 1, 2, 3]
var ap = tr.topatterny(ay);
for (var i = 0; i < ap.length; i++)
    console.log(ay[i], ap[i]);

var ts = new TestSetDate(listDays("2023-01-01", 10), { nbit: 12, verbose: false, mode: 0, inc: 2 });
console.log(ts);
console.log(ts.set_entries().map(x => ts.invert(x)));
*/