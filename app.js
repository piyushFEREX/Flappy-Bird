var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//require kar le bhai 
var passport = require('passport')
var expressSession = require('express-session')
var Users = require('./routes/users')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//local statergy ka code bhulna mat bc
var LocalStratergy = require('passport-local').Strategy
passport.use(new LocalStratergy(Users.authenticate()))
//yaad rakhna bkl

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//copy paste of the passport js code 
app.use(expressSession({
  resave:false,
  saveUninitialized:false,
  secret:'flappy flap'
}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(Users.serializeUser())
passport.deserializeUser(Users.deserializeUser())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
