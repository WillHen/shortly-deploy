var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
// var mongoose = require('mongoose')

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },

var usersSchema = db.Schema ({
    username: { type: String, unique: true, required: true },
    password: {type: String, required: true }
});


//this will listen and on every save change the password
//middle wear - 
usersSchema.pre('save', function(next) {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
        console.log("This is the entry....",this)
        next();
      });
});
  usersSchema.methods.comparePassword = function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  };
  // hashPassword: function(){
  //   var cipher = Promise.promisify(bcrypt.hash);
  //   return cipher(this.get('password'), null, null).bind(this)
  //     .then(function(hash) {
  //       this.set('password', hash);
  //     });
  // }
// });

//now need to make a model 

var User = db.model('User', usersSchema);
module.exports = User;
