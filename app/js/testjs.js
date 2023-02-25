var { dateTimeToArray, toArray, toVal, fromArray } = require('./transform').binaryTransform;
var { matrix, mean, abs, round } = require('mathjs');
var { NeuralNetwork } = require('./nn');
var { TrainingSet, TrainingSet2, listDays, TestSetDate, formatDate, formatDateShort } = require('./TrainingSetClass');
const fs = require("fs");


var vel = 10000
var epochs = vel * 10;
//var azioni = JSON.parse(fs.readFileSync("json/azioni.json", "utf8"));
var elaborazione;
var ref_date = "2023-01-01"
/*
azioni.forEach(entry => {
    console.log(entry);
});
*/

borsa = getBorsa().mappa;

Object.values(borsa).forEach(({ azienda, sigla, aggiornamento }) => {
    console.log("entry", azienda, sigla, aggiornamento)
})