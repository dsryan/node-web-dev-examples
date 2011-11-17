var events = require('events');
var util = require('util');

function Pulser() {
  events.EventEmitter.call(this);
}
util.inherits(Pulser, events.EventEmitter);

Pulser.prototype.start = function() {
  var self = this;
  this.id = setInterval(function() {
    util.log('>>>>pulse');
    //dispatch a 'pulse' event
    self.emit('pulse');
    util.log('<<<<pulse');
  }, 1000);
}

var pulser = new Pulser();
//register to listen to the 'pulse' events and provide a callback function to exec when an event is received
pulser.on('pulse', function(){
  util.log('pulse received');
});

pulser.start();