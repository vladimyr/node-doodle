'use strict';

var Doodle = require('../index.js');
var doodle = new Doodle();

var pollData = {
  id: 'qt4edpb8c4ikxa84',
  adminKey: '9udmpt4s'
};

doodle.deletePoll(pollData)
  .then(function(response) {
    console.log('Poll "%s" successfully deleted.', pollData.id);
  });
