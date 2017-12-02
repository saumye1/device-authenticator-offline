var cryptoJS    = require('crypto-js');

exports.SHA256 = SHA256;
exports.MD5    = MD5;

function SHA256(word) {
    return cryptoJS.SHA256(word).toString();
}

function MD5(word) {
    return cryptoJS.MD5(word).toString();
}