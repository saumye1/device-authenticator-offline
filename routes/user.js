var Promise    = require('bluebird');

var responses  = require('./responses');
var mongo      = require('./mongo');
var commonFunc = require('./commonFunctions');

exports.addUser   = addUser;
exports.userLogin = userLogin;
exports.authenticateOTP = authenticateOTP;

function addUser(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var imei = req.body.imei || ""; //can be authenticated first by OTP or some app.

    if (!email || !password) {
        return responses.invalidParametersResponse(res);   
    }
    var secretSeed = "A seed that is used to generate passwords that are a function of every thirty seconds";
    var timeStamp;
    Promise.coroutine(function *() {
        yield mongo.checkNoUserExistsWithEmail(email);
        var passHash = commonFunc.MD5(password);
        timeStamp = new Date().getTime();
        secretSeed = commonFunc.SHA256(email + passHash + imei + new Date().getTime());
        var userObj = {
            email : email,
            password : passHash,
            creation_time : timeStamp,
            secret_seed : secretSeed
        };
        yield mongo.addUser(userObj);
    })()
    .then(user => {
        return responses.actionCompleteResponse(res, { secret_seed : secretSeed, time_stamp : timeStamp });
    })
    .catch(err => {
        return res.send(JSON.stringify({
            message : (err && err.message) || "Some error occured",
            status : 101,
            data : {}
        }));
    })
}

function userLogin(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
        return responses.invalidParametersResponse(res);
    }
    Promise.coroutine(function *() {
        var passHash = commonFunc.MD5(password);
        var userDetails = yield mongo.authenticateUser(email, passHash);
        delete userDetails.password;
        return userDetails;
    })()
    .then(result => {
        responses.actionCompleteResponse(res, result);
    })
    .catch(err => {
        res.send(JSON.stringify({
            message : (err && err.message) || "Invalid credentials",
            status : 101,
            data : {}
        }));
    })
}

//this function will be used by third party apps to check if the user has sent correct OTP to them
function authenticateOTP(req, res) {
    var email = req.body.email;
    var otp = req.body.otp;

    if (!email || !otp) {
        return responses.invalidParametersResponse(res);
    }
    Promise.coroutine(function* () {
        var userDetails = yield mongo.getUserSecretSeed(email);
        var secretSeed = userDetails.secret_seed;
        var currentTime = new Date().getTime();

        //the otp is changed at device side using the same formula
        //every 30 seconds(30000 milliseconds) and displayed to the user
        if ( commonFunc.SHA256(secretSeed + parseInt(currentTime / 30000)).substr(0, 6) != otp ) {
            //invalid OTP response
            return responses.invalidOTP(res);
        }
    })()
    .then(result => {
        responses.actionCompleteResponse(res);
    })
    .catch(err => {
        return res.send(JSON.stringify({
            message : err && err.message || "Some error occured",
            status : 101,
            data : {}
        }));
    })
}