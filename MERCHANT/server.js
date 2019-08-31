const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
mongoose.set('useFindAndModify', false);

const app = express();

const PORT = process.env.PORT || 8888;

//Passport Config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Connect
mongoose.connect(db, { useNewUrlParser : true })
	.then(() => console.log('Cheers MongoDB connected...'))
	.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine','ejs')

//BodyParser
app.use(express.urlencoded({ extended:false}));

// Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	next();
})


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use(express.static('public'));


app.listen(PORT, console.log(`Exchange app listening on port ${PORT}!`));