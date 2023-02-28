

function putRequest(url, dati, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    // xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
    xhr.onload = () => {
        //console.log("Risposta", xhr);
        if (xhr.readyState == 4 && xhr.status == 201) {
            var r = JSON.parse(xhr.response);
            if (r.err) {
                console.log("Errore:", r.err)
                cb(null);
            } else cb(r.result);
        } else {
            var r = JSON.parse(xhr.response);
            if (r.err) {
                console.log("Errore:", r.err)
                cb(null);
            } else cb(r.result);
        }
    };
    xhr.send(JSON.stringify(dati));
}

function start(dett) {
    console.log(dett);
    var tit = document.getElementById("azienda");
    if (tit) tit.innerHTML = dett.azienda;
    var runpred = {};
    ["ultimoValore"].forEach(chiave => {
        var data = document.getElementById("dataelab");
        if (data) data.innerHTML = "Ultima elaborazione : " + dett.ultimaElaborazione + " - " + chiave;
        var elab = dett[chiave];
        for (var i = 0; i < elab.x.length; i++) {
            if (!runpred[elab.x[i]]) runpred[elab.x[i]] = {}
            runpred[elab.x[i]].run = elab.y[i];
            runpred[elab.x[i]].xpatt = elab.xpattern[i];
            runpred[elab.x[i]].ypatt = elab.ypattern[i];
        }
        for (var i = 0; i < elab.xp.length; i++) {
            if (!runpred[elab.xp[i]]) runpred[elab.xp[i]] = {}
            runpred[elab.xp[i]].pred = elab.yp[i];
            runpred[elab.xp[i]].xp_patt = elab.xp_pattern[i];
            runpred[elab.xp[i]].yp_patt = elab.yp_pattern[i];
        }
        var htb = document.getElementById("predizioni-" + chiave)
        htb.border = "1";
        var htr = document.createElement("tr")
        htr.innerHTML = "<td>Data</td><td>Valore</td><td>Previsione</td>"
        htb.appendChild(htr)
        Object.keys(runpred).sort().forEach(k => {
            var htr = document.createElement("tr")
            var vr, vp;
            htr.style.color = "blue";
            if (runpred[k].run) {
                vr = runpred[k].run;
                htr.style.color = "green";
            } else vr = ""
            if (runpred[k].pred)
                vp = runpred[k].pred;
            else vp = ""
            if (runpred[k].run && runpred[k].pred && Math.abs(runpred[k].run - runpred[k].pred) > 0.01) {
                htr.style.color = "red";
            }
            htr.innerHTML = `<td>${k}</td><td>${vr}</td><td>${vp}</td><td>${runpred[k].xpatt}<br>${runpred[k].xp_patt}</td><td>${runpred[k].ypatt}<br>${runpred[k].yp_patt}</td>`;
            htb.appendChild(htr)
        });
    });
}

function startDati() {
    var tit = document.getElementById("azienda");
    if (tit) tit.innerHTML = (azione.dettaglio ? azione.dettaglio : azione.azienda);

    var htb = document.getElementById("storico")
    htb.border = "1";
    var htr = document.createElement("tr");
    ["Data", "Apertura", "Massimo", "Minimo", "Ultimo Valore", "%", "Variazione"].forEach(v => htr.innerHTML += "<td>" + v + "</td>");
    htb.appendChild(htr)
    Object.keys(azione.dati).sort().forEach(data => {
        var htr = document.createElement("tr")
        htb.appendChild(htr);
        var dato = azione.dati[data];
        dato.data = data;
        ["data", "apertura", "massimo", "minimo", "ultimoValore", "variazionePercentuale", "variazione"].forEach(v => htr.innerHTML += "<td>" + datDisplay(dato, v) + "</td>");
    })
}

function round(v, n) {
    return Math.round(v * n) / n;
}

function datDisplay(dato, k) {
    switch (k) {
        case "data": return "" + dato[k];
        case "apertura": return "" + round(dato[k], 100);
        case "massimo": return "" + round(dato[k], 100);
        case "minimo": return "" + round(dato[k], 100);
        case "ultimoValore": return "" + round(dato[k], 100);
        case "variazionePercentuale": return "" + round(dato[k], 100);
        case "variazione": return "" + round(dato[k], 100);
        case "calcolo": return "" + round(dato.ultimoValore - dato.apertura, 100);
    }
    return "";
}