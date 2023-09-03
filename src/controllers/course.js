const { Course } = require('../models/index.js')
const { mutipleMongooseToObject, mongooseToObject } = require('../utils/mongoose.js')
//[INDEX] management course screen
const index = async (req, res, next) => {
    await Course.find({})
        .then((courses) => {
            res.render('pages/managementcourse', { title: 'Quản lý khoá học', courses: mutipleMongooseToObject(courses) });
        }).catch(next)
}
//[GET] courses search
const search = async (req, res, next) => {
    var name = req.body.search;
    console.log(name);
    await Course.find({ name: { $regex: name, $options: 'i' } })
        .then((courses) => {
            res.json({ courses: mutipleMongooseToObject(courses) });
        }).catch(next)
}
//[SHOW] create course screen
const show = (req, res) => {
    res.render('pages/course/create', { title: 'Đăng khoá học' });
}
//[STORE] submit course screen
async function store(req, res, next) {
    console.log(req.body)
    // Display uploaded image for user validation
    var data = req.body;
    var images = []
    for (let i = 0; i < req.files.length; i++) {
        images.push(req.files[i].filename)
        console.log('Uploaded file name:', req.files[i].filename);
    }
    console.log(images);
    // Chuyển đổi enrollment_limit và price thành số
    data.enrollment_limit = Number(data.enrollment_limit);
    data.price = Number(data.price);

    // Thêm mảng images vào đối tượng data
    data.images = images;
    const course = new Course(data);
    course.save().then(() => {
        res.status(200).json({
            success: true,
            message: 'Đăng khoá học thành công',
            uri: '/english-course-manager/managementcourse'
        });
    }).catch(error => {
        res.status(400).json({
            success: true,
            message: 'Đăng khoá học không thành công',
        });
    })
}
//[EDIT] update course
async function edit(req, res, next) {
    Course.findById(req.params.id)
        .then((course) => {
            res.render('pages/course/edit', { title: 'Sửa khoá học', course: mongooseToObject(course) });
        })
        .catch(next)
}
//[PUT] Update course 
async function update(req, res, next) {
    const courseId = req.params.id;
    const { name, description, enrollment_limit, level, price } = req.body;
    debugger
    try {
        debugger
        // Tìm khóa học cần cập nhật
        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Không tìm thấy khóa học' });
        }

        // Cập nhật các thông tin ngoại trừ ảnh (nếu có)
        course.name = name;
        course.description = description;
        course.enrollment_limit = enrollment_limit;
        course.level = level;
        course.price = price;
        console.log(req.files);
        debugger
        var images = []
        if (req.files && req.files.length > 0) {
            debugger
            for (let i = 0; i < req.files.length; i++) {
                images.push(req.files[i].filename)
                console.log('Uploaded file name:', req.files[i].filename);
            }
            course.images = images
        }
        course.images = course.images

        // Lưu khóa học đã cập nhật
        await course.save();

        return res.json({ success: true, message: 'Cập nhật khóa học thành công', uri: '/english-course-manager/managementcourse' });
    } catch (error) {
        debugger
        console.error(error);
        return res.json({ success: false, message: 'Lỗi cập nhật khóa học' });
    }
}
//[DELETE] soft course 
async function forceDestroy(req, res, next) {
    Course.findByIdAndUpdate(req.params.id, { deleted: true })
        .then(() => {
            return res.json({
                success: true,
                message: 'Xoá khoá học thành công!!',
            });
        })
        .catch(next)
}
// //[DELETE] course
async function destroy(req, res, next) {
    Course.deleteOne({ _id: req.params.id })
        .then(() => {
            return res.json({
                success: true,
                message: 'Xoá khoá học thành công!!',
            });
        })
        .catch(next)

}
//GET trash can course
const showtrash = async (req, res, next) => {
    await Course.findDeleted({})
        .then((courses) => {
            res.render('pages/course/trashcan', { title: 'Thùng rác', courses: mutipleMongooseToObject(courses) });
        }).catch(next)
}

//Khôi phục course
async function restore(req, res, next) {
    debugger
    const course = await Course.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true })
        .then((updatedCourse) => {
            debugger
            return res.json({
                success: true,
                message: 'Khôi phục khoá học thành công!!',
                course: updatedCourse
            });
        })
        .catch((err) => {
            debugger
            return res.json({
                success: false,
                message: 'Khôi phục khoá học không thành công!!' + err,
            });
        });

}

// Arrange by ..
const arrCourse = async (req, res, next) => {
    const nameArr = req.params.name;
    console.log(nameArr);
    await Course.find({}).sort(nameArr).exec()
        .then((courses) => {
            res.json({ courses: mutipleMongooseToObject(courses) });
        }).catch(next)
}

async function showDetail(req, res, next) {
    Course.findOne({ slug: req.params.slug })
        .then((course) => {
            res.render('pages/course/show', { title: 'Chi tiết khoá học', course: mongooseToObject(course) });
        })
        .catch(next)
}
module.exports = { index, search, show, store, edit, update, destroy, forceDestroy, showtrash, restore, arrCourse, showDetail }
