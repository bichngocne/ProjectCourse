const { Lession, Klass } = require('../models/index.js')
const { mutipleMongooseToObject, mongooseToObject } = require('../utils/mongoose.js')
//[INDEX] management course screen
const index = async (req, res, next) => {
    res.render('pages/lession/index', { title: 'Thêm bài học' });
}
//[STORE] submit create class
async function store(req, res, next) {
    // Display uploaded image for user validation
    var data = req.body;
    // console.log(data);
    try {
        // Tìm lớp học
        const klass = await Klass.findById(data.idClass);

        // Tạo bài học
        const lession = new Lession({
            name: data.name,
            description: data.description,
            audios: data.audios,
            videos: data.videos,
            exercises: data.exercises,
            class: klass
        });
        console.log(klass);
        // Lưu bài học và thêm vào danh sách bài học của lớp
        await lession.save();
        klass.lessions.push(lession);
        await klass.save();

        res.json({
            success: true,
            message: 'Thêm bài học thành công',
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Thêm bài học không thành công' + error,
        });
    }
}
//Get edit lession screen
const edit = async (req, res, next) => {
    Lession.findById(req.params.id)
        .then((lession) => {
            res.render('pages/lession/edit', { title: 'Sửa bài học', lession: mongooseToObject(lession) });
        })
        .catch(next)
}
//[UPDATE] lession
async function update(req, res, next) {
    // Display uploaded image for user validation
    var data = req.body;
    try {
        const lession = await Lession.findById(data.idLession);
        // console.log(lession);
        lession.name = data.name
        lession.description = data.description;
        lession.audios = data.audios;
        lession.videos = data.videos;
        lession.exercises = data.exercises;
        // Lưu bài học và thêm vào danh sách bài học của lớp

        await lession.save();
        res.json({
            success: true,
            message: 'Sửa bài học thành công',
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Sửa bài học không thành công' + error,
        });
    }
}
// //[DELETE] lession
async function destroy(req, res, next) {
    Lession.deleteOne({ _id: req.params.id })
        .then(() => {
            return res.json({
                success: true,
                message: 'Xoá bài học thành công!!',
            });
        }).catch(error => {
            res.json({
                success: false,
                message: 'Xoá bài học không thành công' + error,
            });
        })
}
module.exports = { index, store, edit, update, destroy }