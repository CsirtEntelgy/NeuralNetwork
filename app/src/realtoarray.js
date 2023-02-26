const { round, pow, exp, random, multiply, dotMultiply, mean, abs, subtract, transpose, add } = require('mathjs');

function toArray(valr, nbit) {
    var array = [];
    var val = round(valr * (pow(2, nbit)));
    if (valr > 1) throw new Error("Valore maggiore di 1.0 : " + valr);
    if (valr < 0) throw new Error("Valore minore di 0.0 :" + valr);
    var pattern = val.toString(2).padStart(nbit, '0');
    return pattern.split('').map(x => eval(x));
}

function fromArray(a) {
    var ab = a.map(x => round(x));
    var pattern = ab.join('');
    var val = parseInt(pattern, 2);
    var ret = val / (pow(2, a.length));
    return (ret > 1.0 ? 1.0 : ret)
}

function pattern(a) {
    var ab = a.map(x => round(x));
    return ab.join('');
}

function toArray2(valr, nbit) {
    var array = [];
    var val = round(valr * (nbit));
    for (var i = 0; i < nbit; i++) {
        if (val < i) array.push(0)
        else array.push(1);
    }
    return array;
}
function fromArray2(a) {
    var val = 0;
    var mx = -10000000;
    for (var i = 0; i < a.length; i++) {
        var x = round(a[i]);
        if (x >= mx) { mx = x; val = i; }
    }
    return val / (a.length);
}

module.exports = { pattern: pattern, fromArray: fromArray, toArray: toArray, toArray2: toArray2, fromArray2: fromArray2 };

//console.log("Esempio versione base");
//[0, 0.2, 0.4, 0.6, 0.8, 1.0].forEach(x => console.log(x, fromArray(toArray(x, 2)), pattern(toArray(x, 2))));
//console.log("Esempio versione 2");
//[0, 0.25, 0.5, 0.75, 1.0, random(), random()].forEach(x => console.log(x, fromArray2(toArray2(x, 100)), pattern(toArray2(x, 100))));
