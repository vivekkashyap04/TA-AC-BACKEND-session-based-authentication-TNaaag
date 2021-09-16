var express = require('express');
const { route } = require('.');
const { render } = require('../app');
var router = express.Router();

const User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('dashboard');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.post('/register', function (req, res, next) {
  User.create(req.body, (err, data) => {
    if (err) return next(err);
    console.log(data);
    res.redirect('/users/login');
  });
});

//login
router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (!user) {
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      console.log(err, result);
      req.session.userId = user._id;
      res.redirect('/users');
    });
  });
});

module.exports = router;
