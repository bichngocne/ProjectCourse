const express = require('express');
const router = express.Router();
const {klassController} = require('../controllers/index.js')

//[GET] class
router.get('/',klassController.show)
//[GET] create class screen
router.get('/create',klassController.index)
//[POST] store class
router.post('/create',klassController.store)
//[Delete] class
router.delete('/:id',klassController.destroy)
//[UPDATE] class 
router.get('/:id/edit', klassController.edit)
//[PUT] course 
router.put('/:id', klassController.update)
//[POST] search class
router.post('/',klassController.search)
//Arrange by name course
router.get('/arrange/:name',klassController.arrClass)
//[GET] show detail class
router.get('/:slug',klassController.showdetail)
module.exports = router;
