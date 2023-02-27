const fs = require("fs")
function Normalize(txt) {
    var v = txt.replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "")
        .replace(".", "_").replace(".", "_").replace(".", "_")
        .replace(".", "_").replace("'", "_").replace("&", "_").replace(",", "_")
        .replace("%", "_").replace("%", "_")
        .replace("-", "_").replace("-", "_");
    return v;
}
function formatFileDate(d) {
    return "" +
        d.getFullYear() +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        ("0" + d.getDate()).slice(-2) +
        ("0" + d.getHours()).slice(-2) +
        ("0" + d.getMinutes()).slice(-2) +
        ("0" + d.getSeconds()).slice(-2);
}
function leggiDati(id_azienda, chiave, ref_date, cb) {
    const sqlite = require("sqlite3");
    var query = "select data," + chiave + " from dati where id_azienda=? and data>? order by data"
    const db = new sqlite.Database(db_borsa);
    db.all(query, [eval(id_azienda), ref_date], (err, res) => {
        cb(res);
        db.close();
    });
}

function formatDate(d) {
    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
        + ":" + ("0" + d.getSeconds()).slice(-2);
    return datestring;
}
function formatDateShort(d) {
    var datestring =
        d.getFullYear() + "-" +
        ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        ("0" + d.getDate()).slice(-2);
    return datestring;
}
function formatOra(txt) {
    var hh = txt.split(".");
    if (hh.length < 3) {
        hh[0] = "00";
        hh[1] = "00";
        hh[2] = "00";
    }
    return ("0" + hh[0]).slice(-2) + ":" + ("0" + hh[1]).slice(-2) + ":" + ("0" + hh[2]).slice(-2);
}
module.exports = {
    Normalize: Normalize,
    formatDate: formatDate,
    formatDateShort: formatDateShort,
    formatOra: formatOra,
    leggiDati
};

