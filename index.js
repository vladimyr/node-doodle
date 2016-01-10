'use strict';

var util = require('util');
var arrify = require('arrify');
var urlJoin = require('url-join');
var got = require('got');
var qs = require('qs');


var PollInputTypes = {
  Text: 'TEXT',
  Date: 'DATE'
};

var PollAnswerTypes = {
  YesNo: 2,
  YesNoIfNeedBe: 3
};

var baseUrl = 'http://doodle.com';

function Doodle(options) {}

Doodle.makeUrl = function(baseUrl, path) {
  return urlJoin.apply(null, arguments);
};

Doodle.makeRequestOptions = function(data) {
  var body = qs.stringify(data, { arrayFormat: 'brackets' });
  var headers = { 'content-type': 'application/x-www-form-urlencoded' };
  
  return {
    headers: headers,
    body: body
  };
};

Doodle.InputTypes = PollInputTypes;
Doodle.AnswerTypes = PollAnswerTypes;

Doodle.prototype._getDoodleOptions = function(options) {
  var date = new Date();
  
  var doodleOptions = {
    type: options.inputType,
    title: options.title,
    ifNeedBe: options.answerType === PollAnswerTypes.YesNoIfNeedBe,
    locale: options.locale,
    initiatorAlias: options.creator,
    initiatorEmail: options.email,
    optionsMode: 'dates',
    options: options.choices,
    hidden: !!options.private,
    // premium stuff
    askAddress: false,
    askEmail: false,
    askPhone: false,
    // date
    currentYear: date.getFullYear(),
    currentMonth: date.getMonth()
  };
  
  if (options.description)
    doodleOptions.description = options.description;
  if (options.location)
    doodleOptions.location = options.location;
    
  return doodleOptions;
};

Doodle.prototype.deletePoll = function(options) {
  options = options || {};
  
  var url = Doodle.makeUrl(baseUrl, '/np/new-polls/',
    options.id, '/delete');
    
  var reqOpts = Doodle.makeRequestOptions({ adminKey: options.adminKey });
  return got.post(url, reqOpts)
};

Doodle.prototype.createPoll = function(options) {
  options = options || {};
  
  options.inputType = options.inputType || PollInputTypes.Text;
  options.answerType = options.answerType || PollAnswerTypes.YesNo;
  options.locale = options.locale || 'en_US';
  options.private = options.private || true;
  options.choices = arrify(options.choices);
  
  var opts = this._getDoodleOptions(options);
  
  var url = Doodle.makeUrl(baseUrl, '/np/new-polls/');
  var reqOpts = Doodle.makeRequestOptions(opts);
  
  function processResponse(response) {
    var data = JSON.parse(response.body);
    var compId = util.format('%s%s', data.id, data.adminKey);
    
    data.links = {
      public: urlJoin(baseUrl, '/poll/', data.id),
      admin: urlJoin(baseUrl, '/poll/', compId, '/admin'),
    };

    return data;
  }
  
  return got.post(url, reqOpts)
    .then(processResponse);
};

module.exports = Doodle;
