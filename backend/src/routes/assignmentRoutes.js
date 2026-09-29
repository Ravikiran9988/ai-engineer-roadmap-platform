const express = require('express');
const router = express.Router();
const controller = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', controller.list);
router.post('/:id/submit', controller.submit);

module.exports = router;
