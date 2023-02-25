//console.log = require("./myconsole").log
const env = require("./env");
function LogFormat(request, dati) {
    var res = {
        url: request.url,
        ip: getCallerIP(request),
        dati: dati
    }
    return res;
}

var express = require("express");
var path = require("path");
var app = express();
var objExpress = express.Router();
const fs = require("fs");


function getCallerIP(request) {
    var ip =
        request.headers["x-forwarded-for"] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(",")[0];
    ip = ip.split(":").slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    return ip;
}

function walkDirFull(wd, basedir, dir) {
    let files = fs.readdirSync(basedir + dir);
    files.forEach(function (file) {
        if (fs.statSync(basedir + dir + file).isDirectory()) {
            walkDirFull(wd, basedir, dir + file + "/");
        } else {
            addStatic(dir + file, path.join(wd, basedir))
            /*objExpress.get("/" + dir + file, function (request, response) {
                response.sendFile(dir + file, {
                    root: path.join(wd, basedir)
                });
            });
            console.log(`Added handler for /${dir + file}`);
            */
        }
    });
}

function reload(wd, htmlDir) {
    walkDirFull(wd, htmlDir, "");
}
function addStatic(file, basedir) {
    objExpress.get("/" + file, function (request, response) {
        response.sendFile(file, {
            root: basedir
        });
    });
    console.log(`Added handler for ${file}`);

}
function start(port, wd, htmlDir, index) {
    reload(wd, htmlDir);
    objExpress.get("/", function (request, response) { response.sendFile(index, { root: path.join(wd, htmlDir) }); });
    app.use(objExpress);
    app.listen(port, function () { console.log("Listening on  port " + port); });
    console.log("Application started....");
}


function post(url, fn) {
    var body = "";
    objExpress.post(url, (request, response) => {
        request.on("data", chunk => { body += chunk.toString(); });
        request.on("end", () => {
            var dati; if (body) { dati = JSON.parse(body); } else { dati = {}; }
            try {
                console.log(LogFormat(request, dati)); fn(dati, request, response);
            } catch (error) {
                console.log(LogFormat(request, dati), error); response.send(JSON.stringify({ err: error, result: null })); response.end();
            }
            body = "";
        });
    });
    objExpress.post(env.contextRoot + url, (request, response) => {
        request.on("data", chunk => { body += chunk.toString(); });
        request.on("end", () => {
            var dati; if (body) { dati = JSON.parse(body); } else { dati = {}; }
            try {
                console.log(LogFormat(request, dati)); fn(dati, request, response);
            } catch (error) {
                console.log(LogFormat(request, dati), error); response.send(JSON.stringify({ err: error, result: null })); response.end();
            }
            body = "";
        });
    });
}

function get(url, fn) {
    objExpress.get(url, (request, response) => { fn(request.query, request, response); })
    objExpress.get(env.contextRoot + url, (request, response) => { fn(request.query, request, response); })
}
function rispondi(response, err, result) {
    if (err) {
        console.log("Errore", err);
    }
    response.send(JSON.stringify({
        err: err,
        result: result
    }));
    response.end();
}

module.exports = {
    router: objExpress,
    start: start,
    getCallerIP: getCallerIP,
    addStatic: addStatic,
    path: path,
    post: post,
    get: get,
    rispondi,
    LogFormat
};
