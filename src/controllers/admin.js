

//[GET] admin
const index = (req, res) => {
    res.render('pages/adminpotal', { title: 'Trang Chủ Admin' });
}

module.exports = { index }