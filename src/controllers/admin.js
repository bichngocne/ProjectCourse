

//[GET] admin
const index = async (req, res) => {
    res.render('pages/adminpotal',{ title: 'Trang Chủ admin'});
};


module.exports = { index }