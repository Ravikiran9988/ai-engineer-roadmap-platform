const express=require('express');
const router=express.Router();
const controller=require('../controllers/progressController');
const {protect}=require('../middleware/authMiddleware');

router.use(protect);
router.get('/',controller.getProgress);
router.post('/',controller.updateProgress);

module.exports=router;