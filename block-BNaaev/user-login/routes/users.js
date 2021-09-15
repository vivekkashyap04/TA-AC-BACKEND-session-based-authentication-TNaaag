var express = require('express');
const { route } = require('.');
const { render } = require('../app');
var router = express.Router();

const User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.post('/register', function (req, res, next) {
  User.create(req.body, (err, data) => {
    if (err) return next(err);
    console.log(data);
    res.redirect('/');
  });
});

module.exports = router;
