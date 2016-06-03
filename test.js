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

var users = {};
var questions = {
  stage1: {
    q: "Hi, how are you? Would you like some (co): chocolate " + emoji.chocolate_bar +
      " or (ap): an apple " + emoji.apple + "?",
    validResponses: ['yes', 'no', 'co', 'chocolate', 'ap', 'apple', 'both'],
    replies: {
      'yes': 'Yes, what? (co): chocolate ' + emoji.chocolate_bar + ' or (ap): an apple ' + emoji.apple + '?',
      'no': 'Ok. Never mind. Have a nice day!',
      'co': "I'm a chocolate lover too. What do you want (tw): Twix, or (sn) Snickers?",
      'chocolate': "I'm a chocolate lover too. What do you want (tw): Twix, or (sn) Snickers?",
      'ap': 'Healthy choice! Do you want me to deliver it to your location: Hilton Sydney, 488 George Street, Sydney, NSW, 2000?',
      'apple': 'Healthy choice! Do you want me to deliver it to your location: Hilton Sydney, 488 George Street, Sydney, NSW, 2000?',
      'both': 'Clever ;) What kind of chocolate do you want? (tw): Twix or (sn): Snickers?'
    },
    invalidResponse: 'Stage 1, invalid Response'
  },
  stage2: {
    q: ''
    validResponses: ['tw', 'twix', 'sn', 'snickers'],
    replies: {
      'tw': 'Twix it is! Do you want (1): one or (2) two?',
      'twix': 'Twix it is! Do you want (1): one or (2) two?',
      'sn': 'My favourite! Do you want (1): one or (2) two?'
    },
    invalidResponse: "I'm sure that's yummy, but I only have (tw): Twix or (sn): Snickers..."
  },
  stage3: {
    q: '',
    validResponses: ['1', '2', 'one', 'two'],
    replies: {
      '1': 'Really? Ok then. Do you want me deliver it to Hilton Sydney, 448 George Street?',
      'one': 'Really? Ok then. Do you want me deliver it to Hilton Sydney, 448 George Street?',
      '2': 'Stupid question I know... Do you want me deliver it to Hilton Sydney, 448 George Street?',
      'two': 'Stupid question I know... Do you want me deliver it to Hilton Sydney, 448 George Street?'
    },
    invalidResponse: "Nice try. You get 2. Do you want me deliver it to Hilton Sydney, 448 George Street?"
  },
  stage4: {
    q: '',
    validResponses: ['y', 'yes', 'ok', 'n', 'no'],
    replies: {
      'y': 'Cool. How do you want to pay? (not): not all at all, (cc): Your credit card (totally not secure, but hey, if you want to...)',
      'yes': 'Cool. How do you want to pay? (not): not all at all, (cc): Your credit card (totally not secure, but hey, if you want to...)',
      'ok': 'Cool. How do you want to pay? (not): not all at all, (cc): Your credit card (totally not secure, but hey, if you want to...)',
      'n': "Well, that wasn't really a question. I'm just a prototype and can't deliver anywhere else yet. Do you still want your treats?",
      'no': "Well, that wasn't really a question. I'm just a prototype and can't deliver anywhere else yet. Do you still want your treats?",
    },
    invalidResponse: "Well, that wasn't really a question. I'm just a prototype and can't deliver anywhere else yet. Do you still want your treats?",
  },
  stage5: {
    q: '',
    validResponses: ['not', 'cc', 'credit card', 'yes', 'no'],
    replies: {
      'not': 'I thought so. Your treats will be with you shortly! Was great chatting to you. Have a nice day!'
      'cc': "I can't believe you did that! Don't send your CC details! Your treats will be with you shortly. Have a nice day!",
      'credit card': "I can't believe you did that! Don't send your CC details! Your treats will be with you shortly. Have a nice day!",
      'yes': '',
      'no': 'Ok. Never mind. Have a nice day!'
    },
    invalidResponse: 'I thought so. Your treats will be with you shortly! Was great chatting to you. Have a nice day!'
  }
};

app.get('/inbound', function(req, res) {

  var params = req.query;
  var messageBody = req.query.Body.toLowerCase();
  var userId = req.query.From;

  var stage;
  var response;

  console.log(messageBody);
  console.log(req.query);

  // Look up the user by number, and work out which stage of the script they are at
  if (! users[userId]) {
    users[userId] = {};
    users[userId].stage = 0;
  }

  stage = user[userId].stage;
  var stringStage = 'stage' + stage;

  // beginning interaction
  if (stage === 0) {
    switch(messageBody) {
      case "hello":
        response = "Hi, how are you? Would you like some (co): chocolate " + emoji.chocolate_bar +
          " or (ap): an apple " + emoji.apple + "?";
        break;
      default:
        response = "Sorry, I'm a bot and still learning. At the moment, I can only offer " +
          "(co): chocolate " + emoji.chocolate_bar + " or (ap): an apple " + emoji.apple + "?";
        break;
    }
  }
  else {
    // parse request
    if (questions[stringStage].validResponses.indexOf(messageBody) !== -1 ) {
      response = questions[stringStage].replies[messageBody];
    }
    else {
      response = questions[stringStage].invalidResponse;
    }
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
