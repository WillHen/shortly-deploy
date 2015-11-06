var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  // req.session.destroy(function() {
  //   res.redirect('/login');
  // });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function (err, links) {
    console.log(links);
    res.send(200, links);
  })
  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }).exec(function(err, found) {
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          visits: 0
        });
        newLink.save(function(err, newLink) {
          if (err) {
            res.send(500, err);
          } else {
            res.send(200, newLink);
          }
        });
      })
    }
  });
};

// exports.loginUser = function(req, res) {
//   var username = req.body.username;
//   var password = req.body.password;

//   new User({ username: username })
//     .fetch()
//     .then(function(user) {
//       if (!user) {
//         res.redirect('/login');
//       } else {
//         user.comparePassword(password, function(match) {
//           if (match) {
//             util.createSession(req, res, user);
//           } else {
//             res.redirect('/login');
//           }
//         })
//       }
//   });
// };
exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec(function(err, user) {
      if (!user) {
        res.redirect('/login');
      } else {
        User.comparePassword(password, user.password, function(err, match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
  });
};
// exports.signupUser = function(req, res) {
//   var username = req.body.username;
//   var password = req.body.password;

//   new User({ username: username })
//     .fetch()
//     .then(function(user) {
//       if (!user) {
//         var newUser = new User({
//           username: username,
//           password: password
//         });
//         newUser.save()
//           .then(function(newUser) {
//             Users.add(newUser);
//             util.createSession(req, res, newUser);
//           });
//       } else {
//         console.log('Account already exists');
//         res.redirect('/signup');
//       }
//     });
// };

exports.signupUser = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var user = new User({
        username: username,
        password: password
    });
  User.findOne({'username': username}, function(err, user) {
    if (user) {
      console.log('user already exists...');
      res.redirect('/login')
    }
  });
  console.log("Saving user..........");
  user.save(function (err) {
    if(err) {
      console.log("Did not save");
    }
    console.log('in callback')
  });
  console.log("Has saved user, hopefully this should work.....")
}

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }).exec(function(err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err, link) {
        res.redirect(link.url);
        return;
      })
    }
  });
};