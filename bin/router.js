/**
 * Created by Van Phan
 */
"use strict";

let now, db;
let express = require("express");
let router = express.Router();
let router_passport = require("./router_passport.js");
let request = require('request');
let session = require("express-session");
let constants = require('./constants');
let fs = require('fs');
let api_key = 'key-cafcbc28ec1dcc1c1da7816de720d4f8';
let domain = 'sandbox308ae6766e8249e8b93c9a902ec4955e.mailgun.org';
let mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

exports.init = function (_now, cb) {
    _now.router = router;
    now = _now;
    db = now.db;
    db = now.db;

    router_passport.init(now, function (err) {
        if (err) throw err;
        now.web.use("/", router);
        cb();
    });
};

function requireAuthenticated(req, res, next) {
    if (req.user && req.user.mob) {
        next();
    } else {
        res.redirect('/');
    }
}

router.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

router.use(express.static('static'))








