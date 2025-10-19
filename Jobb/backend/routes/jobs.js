const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require('../controllers/jobController');

const router = express.Router();

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', authMiddleware, postJob);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);
router.get('/employer/my-jobs', authMiddleware, getMyJobs);

module.exports = router;