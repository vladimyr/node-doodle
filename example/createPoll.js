'use strict';

var Doodle = require('../index.js');
var doodle = new Doodle();

var pollData = {
  title: 'node-doodle test poll',
  description: 'Testing node-doodle',
  creator: 'Dario Vladovic',
  email: 'nodedoodle@mailinator.com',
  choices: [
    '20160120',  
    '20160121',
    '20160122'
  ],
  private: true
};

doodle.createPoll(pollData)
  .then(function complete(data) {
    console.log(JSON.stringify(data, null, 2));
  });
