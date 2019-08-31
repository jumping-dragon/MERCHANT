const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.post('/trade', (req, res) => {
  const { currency,amount } = req.body;
  let errors = [];
  User.findOneAndUpdate(
    {
      user : req.user // search query
    }, 
    {
      wallet: [{currency : "NTD",amount : 32}]   // field:values to update
    },
    {
      new: true,                       // return updated doc
      runValidators: true              // validate before update
    })
  .then(doc => {
    console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })
   res.redirect('/dashboard');
});

module.exports = router;
