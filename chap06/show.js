var util = require('util');
//var notesdb = require('./notesdb-sqlite3');
var notesdb = require('./notesdb-mongoose');

notesdb.connect(function(err){
  if (err) throw err;
});

notesdb.forAll(function(err, row) {
    util.log('ROW: '+util.inspect(row));
  }, function(err) {
    if (err) throw err;
    util.log('All Done!');
    notesdb.disconnect(function(err){});
  }
);