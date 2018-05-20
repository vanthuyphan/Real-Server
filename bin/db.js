/**
 * Created by Van Phan
 */
"use strict";

let now;

let db = {};

exports.init = function (_now, cb) {
    now = _now;

    now.db = db;
    cb();
}
/**
 * User
 */
db.getUserByCode = function (code, cb) {
    now.mysql.query("SELECT * FROM `User` WHERE code=? LIMIT 1;", [code], function (err, rows) {
        if (rows) {
            cb(err, rows[0]);
        } else {
            cb(err);
        }
    });
};

db.getUserByEmail = function (email, cb) {
    now.mysql.query("SELECT * FROM `User` WHERE email=? LIMIT 1;", [email], function (err, rows) {
        if (rows) {
            cb(err, rows[0]);
        } else {
            cb(err);
        }
    });
};

db.changePassword = function (email, password, cb) {
    now.mysql.query("UPDATE `User` SET password=? WHERE email=?;", [password, email], function (err) {
        cb(err);
    });
};

db.verifyUser = function (code, cb) {
    now.mysql.query("UPDATE `User` SET verified=true WHERE code=?;", [code], function (err) {
        cb(err);
    });
};

db.insertUser = function (model, cb) {
    now.mysql.query("INSERT INTO User SET ?", {
        email: model.email,
        name: model.name,
        password: model.password,
        verified: model.verified
    }, function (err, result) {
        if (result) {
            model.code = result.insertId;
        }
        cb(err, model);
    });
};

db.getUsers = function (cb) {
    now.mysql.query("SELECT * FROM `User`;", function (err, rows) {
        if (rows) {
            cb(err, rows);
        } else {
            cb(err);
        }
    });
};

/**
 * Oauth
 */

db.insertOauth = function (model, cb) {
    now.mysql.query("INSERT INTO Oauth SET ?", {
        userCode: model.userCode,
        profileId: model.profileId,
        provider: model.provider
    }, function (err, result) {
        cb(err);
    });

};