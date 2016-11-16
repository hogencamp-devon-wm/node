const User = require('../models/user');

const jwt = require('jsonwebtoken');

const config = require('../config');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};

exports.verifyOrdinaryUser = function (req, res, next) {
    // Check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // Decode token
    if (token) {
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenicated!');
                err.status = 401;
                return next(err);
            }
            else {
                // If everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        // If ther is no token
        // Return an Error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};