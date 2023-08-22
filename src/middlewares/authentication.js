module.exports = async function checkToken(req, res, next) {
    if (
        req.url.toLowerCase().trim() == '/user'.toLowerCase().trim() ||
        req.url.toLowerCase().trim() == '/home'.toLowerCase().trim() ||
        req.url.toLowerCase().trim() == '/user/logout'.toLowerCase().trim() ||
        req.url.toLowerCase().trim() == '/cource'.toLowerCase().trim()
    ) {
        next();
        return;
    }
    
    // Get and validate token
    const token = await req.headers?.authorization?.split(' ')[1];
    console.log(token);
    try {
        const jwtObject = await jwt.verify(token, process.env.SECRET);
        const isExpired = Date.now() >= jwtObject.exp * 1000;
        
        if (isExpired) {
            res.redirect('/home');
            console.log('vao home1');
        } else {
            next(); // Chỉ gọi next() khi token hợp lệ
            console.log('vao admin');
        }
    } catch (errors) {
        res.redirect('/home');
        console.log('vao home2');

    }
};
