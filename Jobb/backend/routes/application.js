const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  applyJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');

const router = express.Router();

router.post('/', authMiddleware, applyJob);
router.get('/my-applications', authMiddleware, getMyApplications);
router.get('/job/:jobId', authMiddleware, getApplicationsForJob);
router.put('/:id/status', authMiddleware, updateApplicationStatus);

module.exports = router;