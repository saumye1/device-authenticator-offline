var Promise = require('bluebird');

exports.checkNoUserExistsWithEmail = checkNoUserExistsWithEmail;
exports.addUser                    = addUser;
exports.authenticateUser           = authenticateUser;
exports.getUserSecretSeed          = getUserSecretSeed;

function checkNoUserExistsWithEmail(email) {
    return new Promise((resolve, reject) => {
        db.collection(config.get('mongoCollections.users')).findOne({email : email}, function(err, result) {
            if (err) {
                return reject(new Error("Some error occured."));
            } else if (result && result.email) {
                return reject(new Error("User already exists."));
            }
            return resolve();
        })
    })
}

function addUser(userObject) {
    return new Promise((resolve, reject) => {
        db.collection(config.get('mongoCollections.users')).insert(userObject, function(err, result) {
            if (err) {
                return reject(new Error("Some error occured while creating user"));
            }
            return resolve(result);
        })
    })
}

function authenticateUser(email, passwordHash) {
    return new Promise((resolve, reject) => {
        db.collection(config.get('mongoCollections.users')).findOne({email : email, password : passwordHash}, function(err, result) {
            if (err) {
                return reject(new Error("Some error occured while authenticating."));
            } else if (result && result.email) {
                return resolve(result);
            }
            return reject(new Error("Invalid Credentials."));
        })
    })
}

function getUserSecretSeed(email) {
    return new Promise((resolve, reject) => {
        db.collection(config.get('mongoCollections.users')).findOne({email : email}, function(err, result) {
            if (err) {
                return reject(new Error("Some error occured"));
            } else if (result && result.email) {
                return resolve(result);
            }
            return reject(new Error("No data found."));
        })
    })
}