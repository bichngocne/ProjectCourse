const express = require('express');
const router = express.Router();
const path = require('path')
const {courseController} = require('../controllers/index.js')
const multer = require('multer');
const { storage, imageFilter } = require('../middlewares/uploadMiddleware.js'); // Import middleware

//[GET] course managament
router.get('/',courseController.index)
//[GET] create course
router.get('/course',courseController.show)
//[POST] create course
//upload file 
var upload = multer({storage:storage,fileFilter: imageFilter,limits: { fileSize: 10 * 1024 * 1024 }});
router.post('/course',upload.array('images',10),courseController.store)

//[UPDATE] course 
router.get('/course/:id/edit',courseController.edit)
//[PUT] course 
router.put('/course-i/:id',upload.array('images',10),courseController.update)
//[DELETE] course
router.delete('/course/:id',courseController.forceDestroy)
//Show trash can course
router.get('/course/trash',courseController.showtrash)


module.exports = router