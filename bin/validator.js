/**
 * Created by Van Phan
 */
"use strict";

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const phoneRegex = /^0[0-9]{9,10}$/;
const OTPRegex = /^[0-9]{6}$/;
const simpleNumberRegex = /[0123456789\.]+/;
const integerRegex = /[0123456789]+/;

exports.isEmail = function (email) {
    return emailRegex.test(email);
}

exports.isPhoneNumber = function (phone) {
    return phoneRegex.test(phone);
}

exports.isValidPassword = function (password) {
    return password.length >= 6;
}

exports.isValidOTP = function (OTP) {
    return OTPRegex.test(OTP);
}

exports.isNumber = function (number) {
    return simpleNumberRegex.test(number);
}

exports.isInteger = function (number) {
    return integerRegex.test(number);
}
