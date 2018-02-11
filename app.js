var app         = require('express')();
var config      = require('config');
var bodyParser  = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var users    = require('./routes/user');

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.post('/add_user', users.addUser);
app.post('/user_login', users.userLogin);
app.post('/authenticate_otp', users.authenticateOTP);

app.listen(config.get('port'));

function startInitialProcess() {
  MongoClient.connect(config.get('databaseSettings.database'), function(err, database) {
    db = ''
    if (!err) {
      console.log("Database initialized");
      db = database;
    } else {
      console.error("Error while connecting to database");
      throw err;
    }
  })
}

startInitialProcess();