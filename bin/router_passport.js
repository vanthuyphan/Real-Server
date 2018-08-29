/**
 * Created by Van Phan
 */
"use strict";

let passport = require('passport');
const nodemailer = require('nodemailer');
var pdfFiller = require('pdffiller');
var request = require('request');
var querystring = require('querystring');
let now, db;
const canvasUrl = "https://mum.instructure.com/api/v1/";
const courseId = "24";
//const token = "7~sgHnCY45GVJ5q0vetHYLuOjRNhGUseTxsenXO9MzBjHQsj64y33IQI62SSceu0jx";
var transporter = nodemailer.createTransport("SMTP", {
    service: 'gmail',
    auth: {
        user: 'absoluteamrit@gmail.com',
        pass: 'fairfield007'
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
        res.render('landing');
    });

    now.web.post("/login", function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        db.getUserByEmail(email.toLowerCase(), (error, user) => {
            console.log("found user", user);
            let samePassword = user.password == password;
            let resetPassword = user.reset == password;
            if (user && samePassword) {
                console.log("Loggging in")
                res.send({"code": "0", "user": user});
            } else if (user && resetPassword) {
                console.log("Resetting");
                db.resetPassword(user.code, user.reset, (error) => {
                    if (error) {
                        console.log("Error", error);
                        res.send({"code": "1"});
                    } else {
                        res.send({"code": "0", "user": user});
                    }

                })
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
                const href = "https://absoluteamrit.com/verify?code=" + user.code
                res.send({SUCCESS: "DONE"});
                let mailOptions = {
                    from: '"Amrita Shrivastava"absoluteamrit@gmail.com',
                    to: email,
                    subject: 'Please verify your email address',
                    html: 'Please click on this link to verify your email address: ' + href
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                })
            }
        });
    });

    now.web.post("/save-pulse", function (req, res, next) {
        const code = req.body.code;
        const email = req.body.email;
        const userId = req.body.userId;
        // Profile
        const name = req.body.name;
        const height = req.body.height;
        const weight = req.body.weight;
        const prakriti = req.body.prakriti;
        const dob = req.body.dob;

        //Log It
        const activity = req.body.activity;
        let model = req.body;
        console.log("Model", model);
        if (code) {
            db.updatePulse(model, (error) => {
                console.log("Resulting", error);
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
                    res.send({SUCCESS: "DONE", pulseId: pulse.code});
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

    now.web.post("/get-user", function (req, res, next) {
        const code = req.body.code;
        db.getUserByCode(code, (error, user) => {
            if (user.code == undefined) {
                res.send({"code": "1"});
            } else {
                res.send({SUCCESS: "DONE", "user": user});
            }
        });
    });

    now.web.post("/reset", function (req, res, next) {
        const email = req.body.email;
        let random = "amrita" + Math.floor(Math.random() * Math.floor(1000));
        db.getUserByEmail(email, (error, user) => {
            if (user) {
                db.generateResetPassword(email, random, (error) => {
                    if (error) {
                        res.send({"code": "1"});
                    } else {
                        res.send({SUCCESS: "DONE"});
                        let mailOptions = {
                            from: '"Amrita Shrivastava"absoluteamrit@gmail.com',
                            to: email,
                            cc: "vanthuyphan@gmail.com",
                            subject: 'You just reset your password?',
                            body: 'Your temporary password is: ' + random + '. Please use this to log into the app then change your password',
                        };
                        transporter.sendMail(mailOptions, function (err, success) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.send({SUCCESS: "DONE"});
                            }
                        });
                    }
                });
            } else {
                res.send({"code": "1"});
            }
        })
        ;
    });

    now.web.get("/confirm_reset", function (req, res, next) {
        const code = req.param('code');
        console.log("Code", code);
        db.verifyUser(code, (error) => {
            res.send("Reset, Your password was");
        });
    });

    now.web.post("/submit-pulse", function (req, firstRes, next) {
        const pulseId = req.body.pulseId;
        const token = req.body.token;
        let assignment = req.body.assignment || "9437881";

        db.getPulseByCode(pulseId, (error, pulse) => {
            if (error || pulse.code == undefined) {
                firstRes.send({"code": "1"});
            } else {
                var sourcePDF = "profile_template.pdf";
                var destinationPDF = "test_complete.pdf";
                console.log("The pulse", pulse);
                var data = {
                    "Name": pulse.name || "",
                    "Weight": pulse.weight || "",
                    "DOB": pulse.dob || "",
                    "Height": pulse.height || "",
                    "Prakriti": pulse.prakriti || "",
                    "Activity": pulse.activity || "",
                    "Date": pulse.date || "",
                    "Overall Impression": pulse.overall_impression || "",
                    "Quality Note": pulse.quality_note || "",
                    "Light": pulse.light ? "Yes" : "No",
                    "Dry": pulse.dry ? "Yes" : "No",
                    "Cold": pulse.cold ? "Yes" : "No",
                    "Rough": pulse.rough ? "Yes" : "No",
                    "Clear": pulse.clear ? "Yes" : "No",
                    "Movable": pulse.movable ? "Yes" : "No",
                    "Sharp": pulse.sharp ? "Yes" : "No",
                    "Liquid": pulse.liquid ? "Yes" : "No",
                    "Subtle": pulse.subtle ? "Yes" : "No",
                    "Hard": pulse.hard ? "Yes" : "No",
                    "Oily": pulse.oily ? "Yes" : "No",
                    "Heavy": pulse.heavy ? "Yes" : "No",
                    "Smooth": pulse.smooth ? "Yes" : "No",
                    "Cloudy": pulse.cloudy ? "Yes" : "No",
                    "Stable": pulse.stable ? "Yes" : "No",
                    "Dull": pulse.dull ? "Yes" : "No",
                    "Gross": pulse.gross ? "Yes" : "No",
                    "Dense": pulse.dense ? "Yes" : "No",
                    "Soft": pulse.soft ? "Yes" : "No",
                    "Prana": pulse.prana ? "Yes" : "No",
                    "Udana": pulse.udana ? "Yes" : "No",
                    "Samana": pulse.samana ? "Yes" : "No",
                    "Apana": pulse.apana ? "Yes" : "No",
                    "Vyana": pulse.vyana ? "Yes" : "No",
                    "Pachaka": pulse.pachaka ? "Yes" : "No",
                    "Ranjaka": pulse.ranjaka ? "Yes" : "No",
                    "Sadhaka": pulse.sadhaka ? "Yes" : "No",
                    "Alochaka": pulse.alochaka ? "Yes" : "No",
                    "Bhrajaka": pulse.bhrajaka ? "Yes" : "No",
                    "Kledaka": pulse.kledaka ? "Yes" : "No",
                    "Avalambaka": pulse.avalambaka ? "Yes" : "No",
                    "Tarpaka": pulse.tarpaka ? "Yes" : "No",
                    "Shelshaka": pulse.shelshaka ? "Yes" : "No",
                    "Bodhaka": pulse.bodhaka ? "Yes" : "No",
                    "Sub Dosha Note": pulse.sub_dosha_note || "",
                    "Rasa": pulse.rasa ? "Yes" : "No",
                    "Rakta": pulse.rakta ? "Yes" : "No",
                    "Mamsa": pulse.mamsa ? "Yes" : "No",
                    "Meda": pulse.meda ? "Yes" : "No",
                    "Asthi": pulse.asthi ? "Yes" : "No",
                    "Majja": pulse.majja ? "Yes" : "No",
                    "Shukra": pulse.shukra ? "Yes" : "No",
                    "Rasa Tendency": pulse.rasa_tendency || "",
                    "Rakta Tendency": pulse.rakta_tendency || "",
                    "Mamsa Tendency": pulse.mamsa_tendency || "",
                    "Meda Tendency": pulse.meda_tendency || "",
                    "Asthi Tendency": pulse.asthi_tendency || "",
                    "Majja Tendency": pulse.majja_tendency || "",
                    "Shukra Tendency": pulse.shukra_tendency || "",
                    "Prana Tendency": pulse.prana_tendency || "",
                    "Udana Tendency": pulse.udana_tendency || "",
                    "Samana Tendency": pulse.samana_tendency || "",
                    "Apana Tendency": pulse.apana_tendency || "",
                    "Vyana Tendency": pulse.vyana_tendency || "",
                    "Pachaka Tendency": pulse.pachaka_tendency || "",
                    "Ranjaka Tendency": pulse.ranjaka_tendency || "",
                    "Sadhaka Tendency": pulse.sadhaka_tendency || "",
                    "Alochaka Tendency": pulse.alochaka_tendency || "",
                    "Bhrajaka Tendency": pulse.bhrajaka_tendency || "",
                    "Kledaka Tendency": pulse.kledaka_tendency || "",
                    "Avalambaka Tendency": pulse.avalambaka_tendency || "",
                    "Bodhaka Tendency": pulse.bodhaka_tendency || "",
                    "Tarpaka Tendency": pulse.tarpaka_tendency || "",
                    "Shelshaka Tendency": pulse.shelshaka_tendency || "",
                    "Dhatu Note": pulse.dhatu_note || "",
                    "Deep Level Note": pulse.deep_level_note || "",
                    "Interpretation": pulse.interpretation || "",
                    "Additional Comments": pulse.comments || "",
                    "Day Vata": pulse.day.indexOf("Vata") > -1 ? "Yes" : "No",
                    "Time Vata": pulse.time.indexOf("Vata") > -1 ? "Yes" : "No",
                    "Day Pitta": pulse.day.indexOf("Pitta") > -1 ? "Yes" : "No",
                    "Time Pitta": pulse.time.indexOf("Pitta") > -1 ? "Yes" : "No",
                    "Day Kapha": pulse.day.indexOf("Kapha") > -1 ? "Yes" : "No",
                    "Time Khapha": pulse.time.indexOf("Kapha") > -1 ? "Yes" : "No",
                    "Deep Level Vata": pulse.deep_level_type.indexOf("Vata") > -1 ? "Yes" : "No",
                    "Deep Level Pitta": pulse.deep_level_type.indexOf("Pitta") > -1 ? "Yes" : "No",
                    "Deep Level Kapha": pulse.deep_level_type.indexOf("Kapha") > -1 ? "Yes" : "No",
                };
                pdfFiller.fillForm(sourcePDF, destinationPDF, data, function (err) {
                    if (err) firstRes.send({"code": "1"});;
                    let jsonString = {"name": "pulse.pdf", "size": "110690", "content_type":"application/pdf", "parent_folder_path": "my_files", "url": "https://absoluteamrit.com/pdf/" + destinationPDF};
                    let uri = canvasUrl + 'courses/' + courseId + '/assignments/' + assignment + '/submissions/self/files';
                    request({
                        headers: {
                            'AUTHORIZATION': "Bearer " + token,
                            'Content-Type': 'application/json'
                        },
                        uri: uri,
                        body: JSON.stringify(jsonString),
                        method: 'POST'
                    }, function (err, res, body) {
                        console.log("Body", body);
                        body = JSON.parse(body);
                        var checkingUrl = body.progress.url;
                        if (err) firstRes.send({"code": "1"});
                        var timer = setTimeout(myFunction, 2000);

                        function myFunction() {
                            request({
                                headers: {
                                    'AUTHORIZATION': "Bearer " + token,
                                    'Content-Type': 'application/json'
                                },
                                uri: checkingUrl,
                                method: 'GET'
                            }, function (err, res, body) {
                                body = JSON.parse(body);
                                var form = {
                                    "submission[submission_type]": "online_upload",
                                    "submission[file_ids][]": body.results.id,
                                    "comment[text_comment]": "Uploaded via Amrit"
                                };
                                var formData = querystring.stringify(form);
                                console.log("Data", formData)
                                var contentLength = formData.length;
                                request({
                                    headers: {
                                        'AUTHORIZATION': "Bearer " + token,
                                        'Content-Length': contentLength,
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    },
                                    uri: canvasUrl + 'courses/' + courseId + '/assignments/' + assignment + '/submissions',
                                    body: formData,
                                    method: 'POST'
                                }, function (err, res, body) {
                                    console.log("Body1", body);
                                    if (err) firstRes.send({"code": "1"});
                                    db.updateSubmitNote(pulseId, "Submitted at " + new Date().toLocaleString(), (err) => {
                                        firstRes.send({SUCCESS: "DONE"});
                                    })

                                });
                            });
                        }
                    });
                })
            }
        });
    });

    now.web.post("/email-pulse", function (req, res, next) {
        const pulseId = req.body.pulseId;
        let email = req.body.email || "";

        db.getPulseByCode(pulseId, (error, pulse) => {
            if (error || pulse.code == undefined) {
                res.send({"code": "1"});
            } else {
                var sourcePDF = "profile_template.pdf";
                var destinationPDF = "test_complete.pdf";
                var data = {
                    "Name": pulse.name || "",
                    "Weight": pulse.weight || "",
                    "DOB": pulse.dob || "",
                    "Height": pulse.height || "",
                    "Prakriti": pulse.prakriti || "",
                    "Activity": pulse.activity || "",
                    "Date": pulse.date || "",
                    "Overall Impression": pulse.overall_impression || "",
                    "Quality Note": pulse.quality_note || "",
                    "Light": pulse.light ? "Yes" : "No",
                    "Dry": pulse.dry ? "Yes" : "No",
                    "Cold": pulse.cold ? "Yes" : "No",
                    "Rough": pulse.rough ? "Yes" : "No",
                    "Clear": pulse.clear ? "Yes" : "No",
                    "Movable": pulse.movable ? "Yes" : "No",
                    "Sharp": pulse.sharp ? "Yes" : "No",
                    "Liquid": pulse.liquid ? "Yes" : "No",
                    "Subtle": pulse.subtle ? "Yes" : "No",
                    "Hard": pulse.hard ? "Yes" : "No",
                    "Oily": pulse.oily ? "Yes" : "No",
                    "Heavy": pulse.heavy ? "Yes" : "No",
                    "Smooth": pulse.smooth ? "Yes" : "No",
                    "Cloudy": pulse.cloudy ? "Yes" : "No",
                    "Stable": pulse.stable ? "Yes" : "No",
                    "Dull": pulse.dull ? "Yes" : "No",
                    "Gross": pulse.gross ? "Yes" : "No",
                    "Dense": pulse.dense ? "Yes" : "No",
                    "Soft": pulse.soft ? "Yes" : "No",
                    "Prana": pulse.prana ? "Yes" : "No",
                    "Udana": pulse.udana ? "Yes" : "No",
                    "Samana": pulse.samana ? "Yes" : "No",
                    "Apana": pulse.apana ? "Yes" : "No",
                    "Vyana": pulse.vyana ? "Yes" : "No",
                    "Pachaka": pulse.pachaka ? "Yes" : "No",
                    "Ranjaka": pulse.ranjaka ? "Yes" : "No",
                    "Sadhaka": pulse.sadhaka ? "Yes" : "No",
                    "Alochaka": pulse.alochaka ? "Yes" : "No",
                    "Bhrajaka": pulse.bhrajaka ? "Yes" : "No",
                    "Kledaka": pulse.kledaka ? "Yes" : "No",
                    "Avalambaka": pulse.avalambaka ? "Yes" : "No",
                    "Tarpaka": pulse.tarpaka ? "Yes" : "No",
                    "Shelshaka": pulse.shelshaka ? "Yes" : "No",
                    "Bodhaka": pulse.bodhaka ? "Yes" : "No",
                    "Sub Dosha Note": pulse.sub_dosha_note || "",
                    "Rasa": pulse.rasa ? "Yes" : "No",
                    "Rakta": pulse.rakta ? "Yes" : "No",
                    "Mamsa": pulse.mamsa ? "Yes" : "No",
                    "Meda": pulse.meda ? "Yes" : "No",
                    "Asthi": pulse.asthi ? "Yes" : "No",
                    "Majja": pulse.majja ? "Yes" : "No",
                    "Shukra": pulse.shukra ? "Yes" : "No",
                    "Rasa Tendency": pulse.rasa_tendency || "",
                    "Rakta Tendency": pulse.rakta_tendency || "",
                    "Mamsa Tendency": pulse.mamsa_tendency || "",
                    "Meda Tendency": pulse.meda_tendency || "",
                    "Asthi Tendency": pulse.asthi_tendency || "",
                    "Majja Tendency": pulse.majja_tendency || "",
                    "Shukra Tendency": pulse.shukra_tendency || "",
                    "Prana Tendency": pulse.prana_tendency || "",
                    "Udana Tendency": pulse.udana_tendency || "",
                    "Samana Tendency": pulse.samana_tendency || "",
                    "Apana Tendency": pulse.apana_tendency || "",
                    "Vyana Tendency": pulse.vyana_tendency || "",
                    "Pachaka Tendency": pulse.pachaka_tendency || "",
                    "Ranjaka Tendency": pulse.ranjaka_tendency || "",
                    "Sadhaka Tendency": pulse.sadhaka_tendency || "",
                    "Alochaka Tendency": pulse.alochaka_tendency || "",
                    "Bhrajaka Tendency": pulse.bhrajaka_tendency || "",
                    "Kledaka Tendency": pulse.kledaka_tendency || "",
                    "Avalambaka Tendency": pulse.avalambaka_tendency || "",
                    "Bodhaka Tendency": pulse.bodhaka_tendency || "",
                    "Tarpaka Tendency": pulse.tarpaka_tendency || "",
                    "Shelshaka Tendency": pulse.shelshaka_tendency || "",
                    "Dhatu Note": pulse.dhatu_note || "",
                    "Deep Level Note": pulse.deep_level_note || "",
                    "Interpretation": pulse.interpretation || "",
                    "Additional Comments": pulse.comments || "",
                    "Day Vata": pulse.day.indexOf("Vata") > -1 ? "Yes" : "No",
                    "Time Vata": pulse.time.indexOf("Vata") > -1 ? "Yes" : "No",
                    "Day Pitta": pulse.day.indexOf("Pitta") > -1 ? "Yes" : "No",
                    "Time Pitta": pulse.time.indexOf("Pitta") > -1 ? "Yes" : "No",
                    "Day Kapha": pulse.day.indexOf("Kapha") > -1 ? "Yes" : "No",
                    "Time Khapha": pulse.time.indexOf("Kapha") > -1 ? "Yes" : "No",
                    "Deep Level Vata": pulse.deep_level_type.indexOf("Vata") > -1 ? "Yes" : "No",
                    "Deep Level Pitta": pulse.deep_level_type.indexOf("Pitta") > -1 ? "Yes" : "No",
                    "Deep Level Kapha": pulse.deep_level_type.indexOf("Kapha") > -1 ? "Yes" : "No",
                };

                if (email == "Amrita") {
                    email = "amrita@tm.org";
                } else if (email == "Van") {
                    email = "vanthuyphan@gmail.com";
                }
                if (email.indexOf("@") > -1) {
                    pdfFiller.fillForm(sourcePDF, destinationPDF, data, function (err) {
                        if (err) console.log("Error", err);
                        let mailOptions = {
                            from: '"Amrita Shrivastava"absoluteamrit@gmail.com',
                            to: "pulseph500@gmail.com",
                            replyTo: email,
                            cc: email,
                            bcc: "vanthuyphan@gmail.com",
                            subject: 'New pulse reading from ' + email,
                            body: "",
                            attachments: [{filename: 'pulse.pdf', filePath: destinationPDF}]
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
                } else {
                    res.send({SUCCESS: "DONE"});
                }
            }
        });
    });

    now.web.get("/verify", function (req, res, next) {
        const code = req.param('code');
        db.verifyUser(code, (error) => {
            res.send("Welcome fellow 🧘‍. Your account is verified. Now go ahead and use the app!");
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
