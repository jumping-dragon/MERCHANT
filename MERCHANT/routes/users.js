const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2, device_id } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      device_id
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
          device_id,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          device_id
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


router.post('/trade', (req, res) => {
  let user = req.user;
  const {buy_currency,buy_amount,sell_currency,sell_amount} = req.body;
  let errors = [];
   if (!buy_currency || !buy_amount || !sell_currency || !sell_amount) {
    errors.push({ msg: 'Please enter all fields' });
   }
	if ( buy_amount < 0 || sell_amount < 0) {
    errors.push({ msg: 'Invalid Trade Amount' });
   }
  if(errors.length <= 0){
  User.findOneAndUpdate(
  	{ name : req.user.name ,  },  // search query
  	{ $push: { "trade" : { 
  		buy_currency: buy_currency, 
  		buy_amount: buy_amount, 
  		sell_currency:sell_currency,
  		sell_amount:sell_amount } } }  , 
  	{ runValidators: true    })        // validate before update
  .then(console.log("You Traded " + sell_amount +" "+ sell_currency))
  .catch(err => {
  	console.error(err)
  })	
  }else{
  	console.log(errors[0].msg);
  };
res.redirect('/dashboard');
});




router.post('/topup', (req, res) => {
  const { new_currency,new_amount } = req.body;
  let errors = [];
  if (!new_amount || !new_currency) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (new_currency.length > 3) {
    errors.push({ msg: 'Invalid Input of Currency' });
  }

  if(errors.length <= 0){
  User.findOneAndUpdate(
  	{ email : req.user.email },  // search query
  	{ $push: { "wallet" : { currency: new_currency, amount: new_amount } } } , 
  	{ new: true,                       // return updated doc
      runValidators: true              // validate before update
  })
  .then(console.log("You Received " + new_amount +" "+ new_currency))
  .catch(err => {
  	console.error(err)
  })	
  }else{
  	console.log(errors[0].msg);
  }
  
  res.redirect('/dashboard');
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
