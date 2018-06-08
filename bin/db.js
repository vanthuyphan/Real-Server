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

db.getUserByCode = function (code, cb) {
    console.log("Get User ");
    now.mysql.query("SELECT * FROM `User` WHERE code=? LIMIT 1;", [code], function (err, rows) {
        if (rows) {
            cb(err, rows[0]);
        } else {
            cb(err);
        }
    });
};

db.getUserByEmail = function (email, cb) {
    console.log("Emailing", email);
    now.mysql.query("SELECT * FROM `User` WHERE email=? LIMIT 1;", [email], function (err, rows) {
        if (rows) {
            cb(err, rows[0]);
        } else {
            cb(err);
        }
    });
};

db.changePassword = function (email, password, cb) {
    console.log("Change password ");
    now.mysql.query("UPDATE `User` SET password=? WHERE email=?;", [password, email], function (err) {
        cb(err);
    });
};

db.updateUser = function (user, cb) {
    console.log("Update User ");
    now.mysql.query("UPDATE `User` SET password=?, name=?, dob=?, height=?, weight=?, prakriti=? WHERE email=?;", [
        user.password || "", 
        user.name || "", 
        user.dob || "", 
        user.height || "", 
        user.weight || "", 
        user.prakriti || "", 
        user.email || ""
    ], function (err) {
        cb(err);
    });
};

db.verifyUser = function (code, cb) {
    console.log("Verify user ");
    now.mysql.query("UPDATE `User` SET verified=true WHERE code=?;", [code], function (err) {
        cb(err);
    });
};

db.generateResetPassword = function (email, random, cb) {
    console.log("generate random password password");
    now.mysql.query("UPDATE `User` SET reset=? WHERE email=?;", [random, email], function (err) {
        cb(err);
    });
};

db.resetPassword = function (code, random, cb) {
    console.log("reset password");
    now.mysql.query("UPDATE `User` SET password=?, reset='' WHERE code=?;", [random, code], function (err) {
        cb(err);
    });
};

db.insertUser = function (model, cb) {
    console.log("Add User ");
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

db.insertPulse = function (userId, model, cb) {
    console.log("Add Pulse ");
    now.mysql.query("INSERT INTO Pulse SET ?", {
        name: model.name,
        height: model.height,
        weight: model.weight,
        dob: model.dob,
        prakriti: model.prakriti,
        date: new Date().toLocaleString(),
        day: model.day || "",
        time: model.time || "",
        activity: model.activity || "",
        overall_impression: model.overall_impression || "",
        dry: model.dry,
        light: model.light,
        cold: model.cold,
        rough: model.rough,
        clear: model.clear,
        movable: model.movable,
        sharp: model.sharp,
        liquid: model.liquid,
        subtle: model.subtle,
        hard: model.hard,
        oily: model.oily,
        heavy: model.heavy,
        smooth: model.smooth,
        cloudy: model.cloudy,
        stable: model.stable,
        dull: model.dull,
        gross: model.gross,
        dense: model.dense,
        soft: model.soft,
        quality_note: model.quality_note || "",
        prana: model.prana,
        udana: model.udana,
        samana: model.samana,
        apana: model.apana,
        vyana: model.vyana,
        pachaka: model.pachaka,
        ranjaka: model.ranjaka,
        sadhaka: model.sadhaka,
        alochaka: model.alochaka,
        bhrajaka: model.bhrajaka,
        kledaka: model.kledaka,
        avalambaka: model.avalambaka,
        tarpaka: model.tarpaka,
        shelshaka: model.shelshaka,
        bodhaka: model.bodhaka,
        sub_dosha_note: model.sub_dosha_note || "",
        rasa: model.rasa,
        rakta: model.rakta,
        mamsa: model.mamsa,
        meda: model.meda,
        asthi: model.asthi,
        majja: model.majja,
        rasa_tendency: model.rasa_tendency || "",
        rakta_tendency: model.rakta_tendency || "",
        mamsa_tendency: model.mamsa_tendency || "",
        meda_tendency: model.meda_tendency || "",
        shukra: model.shukra,
        asthi_tendency: model.asthi_tendency || "",
        majja_tendency: model.majja_tendency || "",
        shukra_tendency: model.shukra_tendency || "",
        dhatu_note: model.dhatu_note || "",
        deep_level_type: model.deep_level_type || "",
        deep_level_note: model.deep_level_note || "",
        interpretation: model.interpretation || "",
        comments: model.comments || "",
        apana_tendency: model.apana_tendency || "",
        vyana_tendency: model.vyana_tendency || "",
        pachaka_tendency: model.pachaka_tendency || "",
        ranjaka_tendency: model.ranjaka_tendency || "",
        sadhaka_tendency: model.sadhaka_tendency || "",
        alochaka_tendency: model.alochaka_tendency || "",
        bhrajaka_tendency: model.bhrajaka_tendency || "",
        kledaka_tendency: model.kledaka_tendency || "",
        avalambaka_tendency: model.avalambaka_tendency || "",
        bodhaka_tendency: model.bodhaka_tendency || "",
        tarpaka_tendency: model.tarpaka_tendency || "",
        shelshaka_tendency: model.shelshaka_tendency || "",
        prana_tendency: model.prana_tendency || "",
        udana_tendency: model.udana_tendency || "",
        samana_tendency: model.samana_tendency || "",
        user: userId
    }, function (err, result) {
        if (err) {
            console.log("Error", err);
        }
        if (result) {
            model.code = result.insertId;
        }
        cb(err, model);
    });
};

db.updatePulse = function (model, cb) {
    console.log("Updating Pulse");
    now.mysql.query("UPDATE `Pulse` SET " +
        "dry=?,day=?,time=?,activity=?,overall_impression=?,light=?,cold=?,rough=?,clear=?,movable=?,sharp=?,liquid=?," +
        "subtle=?,hard=?,heavy=?,oily=?,smooth=?,cloudy=?,stable=?,dull=?,gross=?,dense=?,soft=?,quality_note=?,prana=?,udana=?," +
        "samana=?,apana=?,vyana=?,pachaka=?,ranjaka=?,sadhaka=?,alochaka=?,bhrajaka=?,kledaka=?,avalambaka=?,tarpaka=?,shelshaka=?," +
        "bodhaka=?,sub_dosha_note=?,rasa=?,rakta=?,mamsa=?,meda=?,asthi=?,majja=?,rasa_tendency=?,rakta_tendency=?,mamsa_tendency=?," +
        "meda_tendency=?,shukra=?,asthi_tendency=?,majja_tendency=?,shukra_tendency=?,dhatu_note=?,deep_level_type=?,deep_level_note=?," +
        "interpretation=?,comments=?,prana_tendency=?,udana_tendency=?, samana_tendency=?, apana_tendency=?," +
        " vyana_tendency=?, pachaka_tendency=?, ranjaka_tendency=?, sadhaka_tendency=?, alochaka_tendency=?, bhrajaka_tendency=?" +
        " kledaka_tendency=?, avalambaka_tendency=?, bodhaka_tendency=?, tarpaka_tendency=?,shelshaka_tendency=? WHERE code=?",
        [model.dry || false,
        model.day || "",
        model.time || "",
        model.activity || "",
        model.overall_impression || "",
        model.light,
        model.cold,
        model.rough,
        model.clear,
        model.movable,
        model.sharp,
        model.liquid,
        model.subtle,
        model.hard,
        model.heavy,
        model.oily,
        model.smooth,
        model.cloudy,
        model.stable,
        model.dull,
        model.gross,
        model.dense,
        model.soft,
        model.quality_note || "",
        model.prana,
        model.udana,
        model.samana,
        model.apana,
        model.vyana,
        model.pachaka,
        model.ranjaka,
        model.sadhaka,
        model.alochaka,
        model.bhrajaka,
        model.kledaka,
        model.avalambaka,
        model.tarpaka,
        model.shelshaka,
        model.bodhaka,
        model.sub_dosha_note || "",
        model.rasa,
        model.rakta,
        model.mamsa,
        model.meda,
        model.asthi,
        model.majja,
        model.rasa_tendency || "",
        model.rakta_tendency || "",
        model.mamsa_tendency || "",
        model.meda_tendency || "",
        model.shukra,
        model.asthi_tendency || "",
        model.majja_tendency || "",
        model.shukra_tendency || "",
        model.dhatu_note || "",
        model.deep_level_type,
        model.deep_level_note || "",
        model.interpretation || "",
        model.comments || "",
        model.prana_tendency || "",
        model.udana_tendency || "",
        model.samana_tendency || "",
        model.apana_tendency|| "",
        model.vyana_tendency || "",
        model.pachaka_tendency || "",
        model.ranjaka_tendency || "",
        model.sadhaka_tendency || "",
        model.alochaka_tendency || "",
        model.bhrajaka_tendency || "",
        model.kledaka_tendency || "",
        model.avalambaka_tendency || "",
        model.bodhaka_tendency || "",
        model.tarpaka_tendency || "",
        model.shelshaka_tendency || "",
        model.code]
        , function (err, result) {
        if (err) console.log(err)
        cb(err);
    });
};

db.getUsers = function (cb) {
    console.log("Get all users");
    now.mysql.query("SELECT * FROM `User`;", function (err, rows) {
        if (rows) {
            cb(err, rows);
        } else {
            cb(err);
        }
    });
};

db.getPulses = function (userId, cb) {
    console.log("Get all pulses ");
    now.mysql.query("SELECT code, system_note, date FROM `Pulse` WHERE user=? ORDER BY ts DESC;", [userId], function (err, rows) {
        if (rows) {
            cb(err, rows);
        } else {
            cb(err);
        }
    });
};

db.getPulseByCode = function (code, cb) {
    console.log("Get one pulse ");
    now.mysql.query("SELECT * FROM `Pulse` WHERE code=? LIMIT 1;", [code], function (err, rows) {
        if (rows) {
            cb(err, rows[0]);
        } else {
            cb(err);
        }
    });
};

db.updateSystemNote = function (code, note, cb) {
    console.log("Update system note");
    now.mysql.query("UPDATE `Pulse` SET system_note=? WHERE code=?;", [note, code], function (err) {
        cb(err);
    });
};

db.deletePulse = function (code, cb) {
    console.log("Delete one pulse ");
    now.mysql.query("DELETE FROM `Pulse` WHERE code=?", [code], function (err) {
        cb(err);
    });
};

db.insertOauth = function (model, cb) {
    console.log("Add Oauth ");
    now.mysql.query("INSERT INTO Oauth SET ?", {
        userCode: model.userCode,
        profileId: model.profileId,
        provider: model.provider
    }, function (err, result) {
        cb(err);
    });

};