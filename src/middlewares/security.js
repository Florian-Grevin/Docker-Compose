const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');

const whitelist = ['http://localhost:4200', 'http://localhost:5500'];

const corsOptions = {
    origin: (origin, callback) => {
        if (/*whitelist.indexOf(origin) !== -1 || !origin*/1) {
            callback(null, true);
        } else {
            callback(new Error('Bloqué par CORS : Domaine non autorisé'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH']
};

const securityMiddleware = [
    helmet(),          
    cors(corsOptions), 
    hpp(),
];

module.exports = securityMiddleware;