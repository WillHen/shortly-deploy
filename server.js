var app = require('./server-config.js');

var port = process.env.port || 4568;
// var port = process.env.port || 27017;

app.listen(port);

console.log('Server now listening on port ' + port);
