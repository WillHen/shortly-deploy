var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose')

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },

var usersSchema = mongoose.schema ({
    username: { type: String, unique: true, required: true },
    password: {type: String, required: true }
}),


//this will listen and on every save change the password
//middle wear - 
schema.pre('save', function(next) {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
      next();
});
  User.methods.comparePassword = function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  // hashPassword: function(){
  //   var cipher = Promise.promisify(bcrypt.hash);
  //   return cipher(this.get('password'), null, null).bind(this)
  //     .then(function(hash) {
  //       this.set('password', hash);
  //     });
  // }
});

//now need to make a model 
mongoose.model('User', usersSchema)

module.exports = User;
