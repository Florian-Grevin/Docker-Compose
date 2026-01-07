const { Strategy, ExtractJwt } = require('passport-jwt');
const AppDataSource = require('./data-source');
const User = require('../entities/User');
const env = require('./env');

const cookieExtractor = (req) => {
    if (req && req.cookies && req.cookies.accessToken) {
        return req.cookies.accessToken;
    }
    return null;
};

const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: env.JWT_SECRET,
};


const jwtStrategy = new Strategy(options, async (payload, done) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: payload.id });

        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
});

module.exports = jwtStrategy;
