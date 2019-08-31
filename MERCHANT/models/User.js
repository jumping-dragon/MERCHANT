const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  device_id: {
    type: String,
  },
  wallet: [
  {currency: String ,
   amount: Number }
  ],
  trade: [
  {buy_currency: String ,
   buy_amount: Number,
   sell_currency: String,
   sell_amount: Number
  }
  ]

});

const User = mongoose.model('User', UserSchema);

module.exports = User;
