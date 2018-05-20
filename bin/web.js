/**
 * Created by Van Phan
 */
"use strict";

let express = require("express");
let web = express();
let fs = require("fs");
let http = require('http');
let https = require('https');
let lessMiddleware = require('less-middleware');
let session = require('express-session');
let bodyParser = require("body-parser");
let router = require("./router");
let now = {};
let server = http.createServer(web);
const spdy = require('spdy');

function setup() {
    web.set('view engine', 'jade');
    web.use("/bower_components", express.static("bower_components"));
    web.use("/static", lessMiddleware('static'));
    web.use("/static", express.static("static"));
    web.locals.pretty = true;
    web.use(bodyParser({limit: '10mb'}));
    web.use(bodyParser.urlencoded({extended: false}));
    web.use(bodyParser.json());
    web.use(session({resave: true, saveUninitialized: true, secret: 'SOMERANDOMSECRETHERE', cookie: {maxAge: 3600000}}));
    web.use(function (req, res, next) {
        res.locals.user = req.session;
        next();
    });
};

exports.init = function (_now, cb) {
    now = _now;
    console.log("[web]  %s:%s", now.ini.web.host, now.ini.web.port);
    now.web = web;
    setup();

    router.init(now, err => {
        if (err) throw err;

        now.web.use(function (req, res) {
            res.status(404).render("404");
        });

        now.router.use((err, req, res, next) => {
            res.status(500).render("error");
            req.next(err);
        });

        process.on('uncaughtException', err => {
            console.log("ERRRORRRR: " + err);
        })
        server.listen(3000, now.ini.web.host, function(err) {
            if (err) throw err;

            cb();
        });

    });
};