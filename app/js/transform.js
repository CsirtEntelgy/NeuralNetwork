var { pow,round } = require('mathjs');

function toArray(val, nbit = 8) {
    var base = 2;
    var ori = val;
    var txt = "";
    var array = [];
    for (var i = 0; i < nbit; i++) {
        txt = (val % base) + txt;
        array.push(val % base)
        val = Math.floor(val / base);

    }
    //console.log(ori, txt, array);
    return { data: array, pattern: txt, val: ori };
}

function toVal(array) {
    var base = 2;
    var val = 0;
    var pot = 1;
    for (var i = 0; i < array.length; i++) {
        val += pot * array[i];
        pot *= base;
    }
    return val;
}
function fromPattern(p) {
    var v = { data: [], pattern: p, val: 0 }
    var pot = 1;
    var base = 2;
    for (var i = 0; i < p.length; i++) {
        var x = eval(p.charAt(p.length - i - 1));
        v.val += x * pot;
        pot *= base;
        v.data.push(x);
    }
    return v;
}
function fromArray(a) {
    var v = { data: a, pattern: "", val: 0 }
    var pot = 1;
    var base = 2;
    for (var i = 0; i < a.length; i++) {
        var x = round(a[a.length-i-1]);
        v.pattern=x+v.pattern;
        v.val += x * pot;
        pot *= base;
    }
    return v;
}


function dateTimeToArray(dt) {
    var v = dateToArray(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds());
    v.val = dt;
    return v;
}
function dateToArray(y, m, d, h, mi, s) {
    var anno = toArray(y - 2000, 11)
    var mese = toArray(m, 4)
    var giorno = toArray(d, 5)
    //var h = toArray(h, 5);
    //var m = toArray(mi, 6);
    //var s = toArray(s, 6);
    var pattern = anno.pattern + mese.pattern + giorno.pattern ; //+ h.pattern + m.pattern + s.pattern;
    //console.log(pattern);
    var v = fromPattern(pattern);
    return v;
}

module.exports = { binaryTransform: { fromArray,toArray, toVal, fromPattern, dateToArray, dateTimeToArray } }