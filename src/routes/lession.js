const express = require('express');
const router = express.Router();
const {lessionController} = require('../controllers/index.js')

//[GET] create lession screen
router.get('/',lessionController.index)
//[POST] create lession
router.post('/create',lessionController.store)
//[GET] edit lession
router.get('/:id/edit',lessionController.edit)
//[PUT] update lession
router.put('/:id',lessionController.update)
//[DELETE] delete lession
router.delete('/:id',lessionController.destroy)
module.exports = router;