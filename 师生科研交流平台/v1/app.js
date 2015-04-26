var express = require('express'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    moment = require('moment'),
    app = express();


mongoose.connect('mongodb://localhost/test');
moment.locale('zh-cn');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: 100000
}));
app.use(session({
    secret: '666',
    resave: false,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/index'));
app.use('/api/get', require('./routes/api/get'));
app.use('/api/post', require('./routes/api/post'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        if (err.status === 404) {
            res.render('404', {
                user: req.session.user
            });
        } else {
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });
}

module.exports = app;