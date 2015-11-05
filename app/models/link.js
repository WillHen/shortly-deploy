var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose')

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },

var urlsSchema = db.Schema ({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: String 
});
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });
var Link = db.model('Link', urlsSchema);
module.exports = Link;
