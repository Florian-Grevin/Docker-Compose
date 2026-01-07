const express = require('express');
const passport = require('passport');
const sanitizer = require('./middlewares/sanitizer');
const securityMiddleware = require('./middlewares/security');
const { globalLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const jwtStrategy = require('./config/passport');

const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const redis = require("./config/redis");

const cookieParser = require("cookie-parser");

const statsRoutes = require('./routes/stats.routes');

const authRoutes = require('./modules/auth/auth.routes');

// 👉 ICI : on crée l'app AVANT d'utiliser cookieParser
const app = express();

// --- BODY PARSER ---
app.use(express.json({ limit: '10kb' }));

// 👉 ICI : cookieParser AVANT passport
app.use(cookieParser());

// --- CONFIGURATION DE LA SESSION ---
app.use(
  session({
    store: new RedisStore({
      client: redis,
      prefix: "sess:",
    }),
    secret: "votre_secret_super_securise",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 86400 * 1000,
    },
  })
);

// --- PASSPORT ---
passport.use(jwtStrategy);
app.use(passport.initialize());
//app.use(passport.session());

// --- MIDDLEWARES DE SÉCURITÉ ---
app.use(securityMiddleware);
app.use(globalLimiter);
app.use(sanitizer);

// --- ROUTES DE TEST ---
const messages = [];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const { content } = req.body;
  messages.push({ content, date: new Date() });
  res.json({ status: 'success' });
});

// --- ROUTES AUTH ---
app.use('/', authRoutes);

app.use('/api', statsRoutes);

// --- ERROR HANDLER ---
app.use(errorHandler);

module.exports = app;
