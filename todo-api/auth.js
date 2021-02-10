/**
 * @author: Imran Shaikh
 * @email: shaikhimran115@gmail.com
 * The file contains authentication utils and middlewares to
 * ensure whether the user is authenticated or not.
 * */

    
var jwt = require('jwt-simple'),
moment = require('moment');

var auth = {
    decodeToken: decodeToken,
    createJWT: createJWT,
    ensureAuthenticated: ensureAuthenticated,
}

function decodeToken(authorization,callback) {

    var token = authorization.split(' ')[1];
        try {
            var payload = jwt.decode(token, 'super-secret-key');
            console.log(' decode --- ',payload)
            callback(null,payload);
        } catch (err) {
            callback({ message: err.message},null);
    }
}

function createJWT(user) {
    var payload = {
        username: user.username,
        iss: 'todo',
        iat: moment().unix(),
        exp: moment().add(5, 'days').unix()
    };
    console.log('--->JWT Payload - ', payload);
    return jwt.encode(payload, 'super-secret-key');
}

/*Authentication interceptor*/
function ensureAuthenticated(req, res, next) {
    // console.log("header details", req.headers);
    if (!req.headers.authorization) {
    // console.log('---==>token not present');
    return res.status(401).send({
        code: 401, message: 'Please make sure your request has an Authorization header',
        status: 'failed', reason: 'Invalid Auth header'
    });
    }
    if (req.headers.authorization.split(' ').length !== 2) {
    // console.log('--->Invalid token');
    return res.status(401).json({
        code: 401,
        message: '=>Invalid token',
        status: 'failed',
        reason: 'Invalid token'
    });
    }
    decodeToken(req.headers.authorization, function (err, payload) {
    if (err) {
        // console.log('--->Invalid token', err);
        return res.status(401).json({
            code: 401, message: '=>Invalid token',
            status: 'failed', reason: 'Invalid token'
        });
    }
    // console.log(">>>********* req.application and payload", payload);
    if (payload.exp <= moment().unix()) {
        return res.status(401).json({
            code: 401, message: "Session expired please login again",
            status: 'failed', reason: 'Session expired'
        });
    }
    req.userInfo = payload;
    return next();
    });
}


module.exports = auth;