const { mutipleMongooseToObject, mongooseToObject } = require('../utils/mongoose.js')
const { Klass } = require('../models/index.js')
// show class management screen
const show = async (req, res, next) => {
    await Klass.find({})
        .then((classes) => {
            res.render('pages/managementklass', { title: 'Quản lý lớp học', classes: mutipleMongooseToObject(classes) });
        }).catch(next)
}
//Show create class
const index = async (req, res, next) => {
    res.render('pages/klass/index', { title: 'Thêm lớp học' });
}
//[STORE] submit create class
async function store(req, res, next) {
    // Display uploaded image for user validation
    var data = req.body;
    const klass = new Klass(data);
    klass.save().then(() => {
        res.json({
            success: true,
            message: 'Thêm lớp học thành công',
            uri: '/english-course-manager/class'
        });
    }).catch(error => {
        res.json({
            success: false,
            message: 'Thêm lớp học không thành công',
        });
    })
}

// //[DELETE] course
async function destroy(req, res, next) {
    Klass.deleteOne({ _id: req.params.id })
        .then(() => {
            return res.json({
                success: true,
                message: 'Xoá lớp học thành công!!',
            });
        })
        .catch(next)

}
//[EDIT] update class
async function edit(req, res, next) {
    Klass.findById(req.params.id)
        .then((klass) => {
            res.render('pages/klass/edit', { title: 'Sửa lớp học', klass: mongooseToObject(klass) });
        })
        .catch(next)
}

//[UPDATE] class
async function update(req, res, next) {
    // Display uploaded image for user validation
    try {
        var classId = req.params.id;
        var {
            name, description, level, numberofsessions
        } = req.body
        // console.log(name);
        const klass = await Klass.findById(classId);
        // console.log(klass);
        klass.name = name;
        klass.description = description;
        klass.level = level;
        klass.numberofsessions = numberofsessions;
        await klass.save();
        return res.json({
            success: true,
            message: 'Sửa lớp học thành công',
            uri: '/english-course-manager/class'
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Sửa lớp học không thành công',
        });
    }
}
//[POST] search class
const search = async (req, res, next) => {
    var name = req.body.search;
    console.log(name);
    await Klass.find({ name: { $regex: name, $options: 'i' } })
        .then((klasses) => {
            res.json({ klasses: mutipleMongooseToObject(klasses) });
        }).catch(next)
}
// Arrange by ..
const arrClass = async (req, res, next) => {
    const nameArr = req.params.name;
    console.log(nameArr);
    await Klass.find({}).sort(nameArr).exec()
        .then((klasses) => {
            res.json({ klasses: mutipleMongooseToObject(klasses) });
        }).catch(next)
}
async function showdetail(req,res,next){
    Klass.findOne({ slug: req.params.slug })
    .then((klass) => {
        res.render('pages/klass/show', { title: 'Chi tiết lớp học', klass: mongooseToObject(klass) });
    })
    .catch(next)
}
module.exports = { index, show, store, destroy, edit, update,search, arrClass,showdetail }