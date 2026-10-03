const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

// Users
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUser);
router.patch('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Stats
router.get('/stats', adminController.getStats);

// Submissions
router.get('/submissions', adminController.getSubmissions);
router.patch('/submissions/:id/review', adminController.reviewSubmission);

module.exports = router;
