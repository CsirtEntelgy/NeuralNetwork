

var { matrix, random, mean, abs, round } = require('mathjs');
var { NeuralNetwork } = require('./nn');



function val2array(val, n, minval, maxval) {
    var array = Array(n).fill(0);
    var i = Math.round((n - 1) * (val - minval) / (maxval - minval));
    //for (var index = 0; index <= i; index++)
    array[i] = 1;
    var txt = ""
    array.forEach(v => txt = (v > 0.5 ? "1" : "0") + txt);
    console.log(txt, array);
    return { array: array, pattern: txt }
}
function array2val(array, soglia, minval, maxval) {
    var n = array.length;
    var d = (maxval - minval) / n;
    var val = 0;
    for (var index = 0; index < n; index++) {
        if (array[index] > soglia) val = d * index + minval;
    }
    return val
}


//const input = matrix([[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 0]]);
//const target = matrix([[0], [1], [1], [1]]);
//console.log(input);
//console.log(target);

function toArray2(val, maxval) {
    var ori = val;
    var txt = "";
    var array = [];
    for (var i = 0; i < maxval; i++) {
        if (val === i) v = 1;
        else v = 0;
        txt = v + txt;
        array.push(v);
    }
    //console.log(ori, txt, array);
    return { data: array, pattern: txt, val: ori };
}


var { toArray, toVal } = require('./transform').binaryTransform;

var i1 = [];
var i2 = [];
var o1 = [];
var ninput = 4;
var noutput = 8;
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15].forEach(v => {
    i1.push(toArray(v, ninput).data);
    o1.push(toArray(v * v, noutput).data);
})
for (var v = 0; v < 16; v++)
    i2.push(toArray(v, ninput).data);

var resinput = matrix(i1);
var restarget = matrix(o1);
var preinput = matrix(i2);

var nn;

nn = new NeuralNetwork(ninput, (ninput + noutput) / 2, noutput);


//console.log(resinput);
//console.log(restarget);
nn.lr = 0.5;
nn.epochs = 100000;
nn.epsilon = 0.001;
var lastErr = 1000;
nn.train(resinput, restarget, 1, (neurals, iter, err, maxEpochs) => {
    if (iter % 5000 == 0) {
        var currErr = mean(abs(err));
        if (currErr > lastErr) neurals.lr -= 0.05;
        else if (currErr < lastErr) neurals.lr += 0.05;
        else neurals.lr = 0.5;
        if (neurals.lr > 1) neurals.lr = 0.5;
        lastErr = currErr;
        console.log("iter", maxEpochs, iter, `Error: ${currErr}`, "Learnig Rate", neurals.lr, "Epsilon", neurals.epsilon);
        check(preinput);
    }
});

// Predizione
function check(input) {
    var pred = nn.predict(input);
    var fs = require('fs');
    var txt = "";
    for (var i = 0; i < i2.length; i++) {
        var x = toVal(i2[i]);
        txt += `${x} ${x * x} ${round(toVal(pred._data[i]))}\n`;
    }
    fs.writeFileSync("output/stats.dat", txt, "utf8");
}
check(preinput);
