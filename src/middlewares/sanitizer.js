const xss = require('xss');

const sanitize = (obj) => {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitize(obj[key]);
        } else if (typeof obj[key] === 'string') {
            obj[key] = xss(obj[key]); 
        }
    }
};

const sanitizerMiddleware = (req, res, next) => {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
};

module.exports = sanitizerMiddleware;
