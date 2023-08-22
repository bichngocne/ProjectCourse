const jwt = require('jsonwebtoken');

module.exports = function checkToken(req, res, next) {
    //Bypass login,register
    //debugger
    if (
        req.url.toLowerCase().trim() == '/user'.toLowerCase().trim() ||
        req.url.toLowerCase().trim() == '/home'.toLowerCase().trim()
    ) {
        next();
        return;
    }
    //other requests
    //get and validate token
    const token = req.headers?.authorization?.split(' ')[1];
    //debugger
    try {
        const jwtObject = jwt.verify(token, process.env.SECRET);
        const isExpired = Date.now() >= jwtObject.exp * 1000;
        if (isExpired) {
            res.status(400).json({
                message: 'Token is expired',
            });
            res.end();
        } else {
            next();
            return;
        }
        // debugger
    } catch (errors) {
        res.status(400).json({
            message: errors.message,
        });
    }
    //debugger
};
