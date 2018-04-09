const express = require('express');
const app = express();
const fs = require('fs');
const dns = require('dns');
const endOfLine = require('os').EOL;
const checkInterval = 1000; // Checks the internet connection every 1000ms (1sec)
app.use('/', express.static(__dirname + '/www'));
var lastCheckState;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/www/index.html');
});

app.listen(3652, function () {
  console.info('Webchecker listening on port 3652!');
});

setInterval(checkInternet, checkInterval);

/**
 * Checks the internet connection
 * When the state changed current state will be logged
 */
async function checkInternet(){
  const currentState = await isOnline();
  if(lastCheckState != currentState){
    var logMsg = currentState ? 'Connected' : 'Disconnected';
    fs.appendFileSync(__dirname + '/www/net.log', getTimestamp() + ' ' + logMsg + endOfLine);
  } 
  lastCheckState = currentState;
}

/**
 * Trys to lookup google.de
 * Returns true on success
 */
function isOnline(){
  return new Promise(function(res, rej){
    dns.lookup('google.de',function(err) {
        if (err && err.code == "ENOTFOUND") {
          res(false);
        } else {
          res(true);
        }
    })
  });
}

/**
 * Returns current timestamp DD.MM.YYYY HH:mm:ss
 */
function getTimestamp(){
  const time = new Date();
  const day = addLeadingZero(time.getDate());
  const month = addLeadingZero(time.getMonth() + 1);
  const year = time.getFullYear();
  const hours = addLeadingZero(time.getHours());
  const mins = addLeadingZero(time.getMinutes());
  const secs = addLeadingZero(time.getSeconds());
  return day + '.' + month + '.' + year + ' ' + hours + ':' + mins + ':' + secs;
}

/**
 * Adds a leading zero for numbers lower 10
 * Returns resulst as string
 * @param {Number} number - Number to add leading zero
 */
function addLeadingZero(number){
  if(number < 10){
    return '0' + number;
  }
  return number;
}