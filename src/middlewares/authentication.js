async function checkToken(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        try {
            next();
        } catch (error) {
            console.error('Token is not valid:', error.message);
            res.redirect('/english-course?is_from_login=false');
        }
    } else {
        console.log('No token, user is not logged in');
        res.redirect('/english-course?is_from_login=false');
    }
};

module.exports = {checkToken}
