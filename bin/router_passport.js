/**
 * Created by Van Phan
 */
"use strict";

let passport = require('passport');
let goNhaDatAPI = require('./gonhadatAPI');
let LocalStrategy = require('passport-local').Strategy;
let validator = require('./validator');

const UNEXPECTED_ERROR = "Có lỗi xảy ra, vui lòng thử lại sau";
const INVALID_PASSWORD = "Mật khẩu phải có ít nhất 6 kí tự";
const SAME_PASSWORD = "Mật khẩu củ và mật khẩu mới không được trùng nhau";
const MIS_MATCH = "Mật khẩu và mật khẩu xác nhận không trùng khớp";
const INVALID_PHONE = "Số điện thoại phải từ 10-11 số";
const DUPLICATED_PHONE = "Số điện thoại đã được đăng kí";
const INVALID_OTP = 'Mã xác nhận không chính xác. Xin vui lòng nhập lại';
const RESENT_OTP = 'Mã xác nhận đã được gửi lại';
const AUTHENTICATE_FAILED = "Số điện thoại hoặc mật khẩu không chính xác. Xin vui lòng nhập lại";
const SUCCESS = {message: 'ok'};
const ERROR = {error: UNEXPECTED_ERROR};

let now, db;

exports.init = (_now, cb) => {
    now = _now;
    db = now.db;
    setupPassport();
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

    now.web.get("/dang-ky", checkLogged, function (req, res) {
        res.render("register");
    });

    now.web.post("/register", checkLogged, function (req, res, next) {
        const phone = req.body.phone;
        if (!validator.isPhoneNumber(phone)) {
            res.send({phone: phone, errorMessage: INVALID_PHONE});
            return;
        }
        goNhaDatAPI.register(phone, function (err, result) {
            result = JSON.parse(result);
            switch (result.code) {
                case 0:
                    res.send(SUCCESS);
                    break;
                case 601:
                    res.send({errorMessage: DUPLICATED_PHONE});
                    break;
                default:
                    res.send({errorMessage: UNEXPECTED_ERROR});
                    break;

            }
        });
    });

    now.web.post("/change_password_first_time", function (req, res, next) {
        const phone = req.body.phone;
        const confirm = req.body.confirm;
        const name = req.user.fin;
        const password = req.body.password;
        const oldPassword = req.body.oldPassword;
        if (confirm != password) {
            res.send({errorMessage: MIS_MATCH});
        } else if (oldPassword == password) {
            res.send({errorMessage: SAME_PASSWORD});
        } else if (!validator.isValidPassword(password)) {
            res.send({errorMessage: INVALID_PASSWORD});
        } else {
            let tok = req.user.tok;
            goNhaDatAPI.changePassword(tok, oldPassword, password, function (err, body) {
                let result = JSON.parse(body);
                switch (result.code) {
                    case 0:
                        res.send(SUCCESS);
                        break;
                    default:
                        console.log('Error', result);
                        res.send({errorMessage: UNEXPECTED_ERROR});
                        break;

                }
            })
        }
    });

    now.web.post("/change_password", function (req, res, next) {
        console.log('change_password')
        const phone = req.body.phone;
        const confirm = req.body.confirm;
        const password = req.body.password;
        const oldPassword = req.body.oldPassword;
        if (password == oldPassword) {
            res.render("profile", {
                tab: "doi-mat-khau",
                phone: phone,
                confirm: confirm,
                oldPassword: oldPassword,
                password: password,
                errorMessage: SAME_PASSWORD
            });
        } else if (password != confirm) {
            res.render("profile", {
                tab: "doi-mat-khau",
                phone: phone,
                confirm: confirm,
                oldPassword: oldPassword,
                password: password,
                errorMessage: MIS_MATCH
            });
        } else if (!validator.isValidPassword(password)) {
            res.render("profile", {
                tab: "doi-mat-khau",
                phone: phone,
                confirm: confirm,
                oldPassword: oldPassword,
                password: password,
                errorMessage: INVALID_PASSWORD
            });
        } else {
            let tok = req.user.tok;
            goNhaDatAPI.changePassword(tok, oldPassword, password, function (err, body) {
                let result = JSON.parse(body);
                switch (result.code) {
                    case 0:
                        res.render("profile", {
                            tab: "doi-mat-khau",
                            phone: phone,
                            confirm: '',
                            oldPassword: '',
                            password: '',
                            errorMessage: "Mật khẩu đã được cập nhật"
                        });
                        break;
                    case 401:
                        res.render("profile", {
                            tab: "doi-mat-khau",
                            errorMessage: "Mật khẩu hiện tại không đúng",
                            phone: phone,
                            confirm: confirm,
                            oldPassword: oldPassword,
                            password: password
                        });
                        break;
                    default:
                        res.render("error");
                        break;
                }
            })
        }
    });

    now.web.post("/start", function (req, res, next) {
        const name = req.body.name;
        const tok = req.user.tok;
        const uid = req.user.uid;
        let user = req.user;
        user.fin = name;
        goNhaDatAPI.updateUser(tok, {fin: name, uid: uid}, function (err, body) {
            let result = JSON.parse(body);
            switch (result.code) {
                case 0:
                    req.login(user, function (err) {
                        if (err) return next(err)
                        res.send(SUCCESS);
                        return;
                    });
                    break;
                default:
                    res.send({errorMessage: UNEXPECTED_ERROR});
                    break;

            }
        })
    });

    now.web.post("/activate", function (req, res, next) {
        const action = req.body.action;
        const code = req.body.code;
        const phone = req.body.phone;
        if (action == 'activate') {
            goNhaDatAPI.login(phone.trim(), code.trim(), 'deviceId', function (err, result) {
                result = JSON.parse(result);
                switch (result.code) {
                    case 0:
                        req.logIn(result.data, function (err) {
                            if (err) {
                                return next(err);
                            } else {
                                res.send(SUCCESS);
                            }
                        });
                        break;
                    case 403:
                        res.send({errorMessage: INVALID_OTP});
                        break;
                    default:
                        console.log("Error", result);
                        res.send({errorMessage: UNEXPECTED_ERROR});
                        break;

                }
            });

        } else if (action == 'resend') {
            goNhaDatAPI.forgetPassword(phone, function (err, result) {
                result = JSON.parse(result);
                switch (result.code) {
                    case 0:
                        res.send({
                            errorMessage: RESENT_OTP
                        });
                        break;
                    default:
                        res.send({
                            errorMessage: UNEXPECTED_ERROR
                        });
                        break;
                }
            })
        }
        ;
    });
}

function setupPassport() {
    passport.use(new LocalStrategy({
            usernameField: 'phone',
            passwordField: 'password'
        },
        function (phone, password, done) {
            goNhaDatAPI.login(phone, password, "deviceId", function (err, body) {
                body = JSON.parse(body);
                if (err) {
                    return done(err, false);
                } else {
                    return done(err, body);
                }
            });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    now.web.use(passport.initialize());
    now.web.use(passport.session());

    now.web.post('/login', (req, res, next) => {
        let error = "";
        let currentPlace = req.body.currentPlace;
        let nextPlace = req.body.nextPlace;
        let phone = req.body.phone;
        let password = req.body.password;
        if (!validator.isPhoneNumber(phone)) {
            error = INVALID_PHONE;
        } else if (!validator.isValidPassword(password)) {
            error = INVALID_PASSWORD
        }
        if (!!error) {
            res.send({errorMessage: error});
        } else {
            passport.authenticate('local', {
                successRedirect: '/dang-tin',
                failureRedirect: '/dang-nhap'
            }, (err, user, info) => {
                if (err) {
                    return next(err);
                }
                let code = user.code;
                if (code == 0) {
                    req.logIn(user.data, function (err) {
                        if (err) {
                            return next(err);
                        }
                        res.send({place: currentPlace, nextPlace: nextPlace});
                    });
                } else if (code == 403 || code == 600) {
                    res.send({errorMessage: AUTHENTICATE_FAILED});
                } else {
                    res.send({errorMessage: UNEXPECTED_ERROR});
                }

            })(req, res, next);
        }
    });

    now.web.get('/dang-xuat', (req, res) => {
        let user = req.user;
        if (user && user.tok) {
            req.logout();
            goNhaDatAPI.logout(user.tok, (err, body) => {
                if (err) {

                }
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
    });

    now.web.post('/forget_password', (req, res) => {
        const phone = req.body.phone;
        if (!phone) {
            res.send({errorMessage: "Xin điền số điện thoại"});
            return;
        }
        goNhaDatAPI.forgetPassword(phone, (err, result) => {
            result = JSON.parse(result);
            switch (result.code) {
                case 0:
                    res.send(SUCCESS);
                    break;
                default:
                    res.send({errorMessage: UNEXPECTED_ERROR});
                    break;

            }
        })
    })
}
