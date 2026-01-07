const express = require('express');
const passport = require('passport');
const authController = require('./auth.controller');
const { registerSchema, loginSchema } = require('./auth.schema');
const validate = require('../../middlewares/validation');
const { authLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();

// Auth Routes
router.post(
    '/auth/register',
    authLimiter,
    validate(registerSchema),
    authController.register
);

router.post(
    '/auth/login',
    authLimiter,
    validate(loginSchema),
    authController.login
);

router.post(
    '/auth/refresh',
    authLimiter,
    validate(require('./auth.schema').refreshTokenSchema),
    authController.refresh
);

router.get(
    '/api/profile',
    passport.authenticate('jwt', { session: false }),
    authController.getProfile
);

module.exports = router;
