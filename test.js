/*
  Mumbrella Demo Bot

  SMS chat service over Twilio
*/

var ACCOUNT_SID = 'AC23052eb27194210d58beb2d79dbc2333';
var AUTH_TOKEN = '1ac8e67913c26b142bdfef69d63a66c3';
var APP_SID = 'MG313a50ad9d2cae6b7f5127afc8c9e334';
var TWILIO_NUMBER = '+61429411737';

var express = require('express');
var bodyParser = require('body-parser');
var twilio = require('twilio');
var path = require('path');
var emoji = require('node-emoji').emoji;
var app = express();

/*

{
  ToCountry: 'AU',
  ToState: '',
  SmsMessageSid: 'SM39e3d461df708c9254b5ea39d2dcf437',
  NumMedia: '0',
  ToCity: '',
  FromZip: '',
  SmsSid: 'SM39e3d461df708c9254b5ea39d2dcf437',
  FromState: '',
  SmsStatus: 'received',
  FromCity: '',
  Body: 'Hi',
  FromCountry: 'AU',
  To: '+61429411737',
  MessagingServiceSid: 'MG313a50ad9d2cae6b7f5127afc8c9e334',
  ToZip: '',
  NumSegments: '1',
  MessageSid: 'SM39e3d461df708c9254b5ea39d2dcf437',
  AccountSid: 'AC23052eb27194210d58beb2d79dbc2333',
  From: '+61481458770',
  ApiVersion: '2010-04-01'
}

*/

app.get('/inbound', function(req, res) {

  var params = req.query;
  var messageBody = req.query.Body.toLowerCase();
  var response;

  console.log(messageBody);
  console.log(req.query);

  // Parse incoming message
  switch (messageBody) {
    case "chocolate":
      response = "Great job! You chose: " + emoji.chocolate_bar;
      break;
    case "chips":
      response = "Nice one! You chose " + emoji.fries;
      break;
    default:
      response = "I don't know what you chose, so you get: " + emoji.poop;
      break;
  }


  var twiml = new twilio.TwimlResponse();
  twiml.message(response);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.listen(4444, function() {
  console.log('Mumbrella Bot running on 4444', emoji.chocolate_bar);
});

/*client.messages.create({
    to:'+61481458770',
    from: TWILIO_NUMBER,
    body: 'Hello World'
}, function(error, message) {
    if (error) {
      console.log(error.message);
    }
});*/
