/**
 * Created by Van Phan
 */
"use strict";

let passport = require('passport');
const nodemailer = require('nodemailer');
var pdfFiller = require('pdffiller');
let now, db;
var transporter = nodemailer.createTransport("SMTP", {
    service: 'gmail',
    auth: {
        user: 'vanthuyphan@gmail.com',
        pass: 'F88kmenaya'
    }
});
exports.init = (_now, cb) => {
    now = _now;
    db = now.db;
    setupRegister();
    cb();
}

function setupRegister() {

    function checkLogged(req, res, next) {
        if (req.user && req.user.mob) {
            res.redirect("/");
            return;
        }
        next();
    }

    now.web.get("/", function (req, res, next) {
        res.render('index');
    });

    now.web.post("/login", function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        db.getUserByEmail(email.toLowerCase(), (error, user) => {
            console.log("found user", user);
            if (user && user.password == password) {
                console.log("Loggging in")
                res.send({"code": "0", "user": user});
            } else {
                res.send({"code": "1"});
            }
        })
    });

    now.web.post("/get-pulses", function (req, res, next) {
        const id = req.body.userId;
        console.log("Id", id);
        db.getPulses(id, (error, pulses) => {
            if (error) {
                console.log("Bugs", error)
                res.send({"code": "1"});
            } else {
                console.log("found pulses", pulses);
                res.send({"code": "0", "pulses": pulses});
            }
        })
    });

    now.web.post("/delete-pulse", function (req, res, next) {
        const id = req.body.pulseId;
        console.log("Id", id);
        db.deletePulse(id, (error) => {
            if (error) {
                console.log("Bugs", error)
                res.send({"code": "1"});
            } else {
                console.log("deleted pulses");
                res.send({"code": "0"});
            }
        })
    });

    now.web.post("/signup", function (req, res, next) {
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        console.log("Email", email)
        console.log("Password", password)
        const name = req.body.name;

        let model = {
            email: email,
            name: name,
            password: password,
            verified: false
        };
        db.insertUser(model, (error, user) => {
            if (user.code == undefined) {
                res.send({"code": "1"});
            } else {
                const href = "127.0.0.1:3000/verify?code=" + user.code
                let mailOptions = {
                    from: '"Amrita Shrivastava 👻"amritashrivastava69@gmail.com',
                    to: email,
                    subject: 'Please verify your email address ✔',
                    html: 'Click here to verify your email address: ' + href
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    res.send({SUCCESS: "DONE"});
                })
            }
        });
    });

    now.web.post("/save-pulse", function (req, res, next) {
        const code = req.body.code;
        const email = req.body.email;
        const userId = req.body.userId;
        console.log("UserId", userId)
        const name = req.body.name;
        const height = req.body.height;
        const weight = req.body.weight;
        const dry = req.body.dry;

        let model = {
            dry: dry,
            name: email,
            height: name,
            weight: weight,
            code: code
        };
        if (code) {
            db.updatePulse(model, (error) => {
                if (error) {
                    res.send({"code": "1"});
                } else {
                    res.send({SUCCESS: "DONE"});
                }
            });
        } else {
            db.insertPulse(userId, model, (error, pulse) => {
                if (pulse.code == undefined) {
                    res.send({"code": "1"});
                } else {
                    res.send({SUCCESS: "DONE"});
                }
            });
        }
    });

    now.web.post("/get-pulse", function (req, res, next) {
        const pulseId = req.body.pulseId;
        db.getPulseByCode(pulseId, (error, pulse) => {
            if (pulse.code == undefined) {
                res.send({"code": "1"});
            } else {
                res.send({SUCCESS: "DONE", "pulse": pulse});
            }
        });
    });

    now.web.post("/email-pulse", function (req, res, next) {
        const pulseId = req.body.pulseId;
        const email = req.body.email;

        let model = {
            name: email,
            height: 123,
            weight: 123
        };
        db.getPulseByCode(pulseId, (error, pulse) => {
            if (pulse.code == undefined) {
                res.send({"code": "1"});
            } else {

                var sourcePDF = "profile_template.pdf";
                var destinationPDF = "test_complete.pdf";
                var data = {
                    "Name": "Van P"
                };
                pdfFiller.fillForm(sourcePDF, destinationPDF, data, function (err) {
                    if (err) throw err;
                    console.log("In callback (we're done).");
                    let mailOptions = {
                        from: '"Amrita Shrivastava 👻"amritashrivastava69@gmail.com',
                        to: "vanthuyphan@gmail.com",
                        subject: 'New Form',
                        body: 'mail content...',
                        attachments: [{filename: 'test.pdf', filePath: destinationPDF}]
                    };
                    transporter.sendMail(mailOptions, function (err, success) {
                        if (err) {
                            console.log(err);
                        } else {
                            db.updateSystemNote(pulseId, "Sent at " + new Date().toLocaleString(), (err) => {
                                res.send({SUCCESS: "DONE"});
                            })
                        }
                    });
                });
            }
        });
    });

    now.web.get("/verify", function (req, res, next) {
        const code = req.param('code');
        console.log("Code", code);
        db.verifyUser(code, (error) => {
            res.send({"Congrats": "Thank you very much! Now you can log in using your email address"});
        });
    });

    now.web.post("/update-user", function (req, res, next) {
        console.log("Updatign user")
        const email = req.body.email;
        const password = req.body.password;
        const dob = req.body.dob;
        const name = req.body.name;
        const height = req.body.height;
        const weight = req.body.weight;
        const prakriti = req.body.prakriti;

        let user = {
            email: email,
            password: password,
            dob: dob,
            name: name,
            height: height,
            weight: weight,
            prakriti: prakriti
        };
        db.updateUser(user, (error) => {
            console.log("found user", error);
            if (!error) {
                res.send({"code": "0", user: user});
            } else {
                res.send({"code": "1"});
            }
        })
    });

    now.web.post("/forget_password", function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.password;
        console.log("Email", email)
        console.log("Password", password)
        res.send({"ERROR": "NONE"});
    });

    now.web.post("/save_log", function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.password;
        console.log("Email", email)
        console.log("Password", password)
        res.send({"ERROR": "NONE"});
    });

    now.web.post("/get_logs", function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.password;
        console.log("Email", email)
        console.log("Password", password)
        res.send({"ERROR": "NONE"});
    });

    now.web.post("/edit_log", function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.password;
        console.log("Email", email)
        console.log("Password", password)
        res.send({"ERROR": "NONE"});
    });

    now.web.post("/delete_log", function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.password;
        console.log("Email", email)
        console.log("Password", password)
        res.send({"ERROR": "NONE"});
    });

    now.web.post("/save_profile", function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.password;
        console.log("Email", email)
        console.log("Password", password)
        res.send({"ERROR": "NONE"});
    });

    now.web.post("/email_log", function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.password;
        console.log("Email", email)
        console.log("Password", password)
        res.send({"ERROR": "NONE"});
    });
}
