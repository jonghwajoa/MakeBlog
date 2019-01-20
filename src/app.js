const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');

const visitMiddle = require('./lib/middleware/visit');

require('dotenv').config();
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  //app.use(morgan('dev'));
}

app.set('views', `${__dirname}/views/pages`);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 80);
app.set('ssl_port', process.env.SSL_PORT || 443);
app.disable('x-powered-by');

app.use(helmet());
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/uploads`));
app.set('trust proxy', 1);
app.use(
  session({
    key: 'sessionid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 3, //3시간
      httpOnly: true,
      //secure: true,
    },
  }),
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(hpp());
app.use(visitMiddle.visit);
app.use('/', require('./route'));

module.exports = app;
