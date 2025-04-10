import express from 'express';
import {
  createLeaveRequestHandler,
  getLeaveRequestsHandler,
  updateLeaveRequestStatusHandler // Add this
} from '../controller/leaverequestController.js';

const router = express.Router();

router.post('/', createLeaveRequestHandler);
router.get('/', getLeaveRequestsHandler);
router.patch('/:id', updateLeaveRequestStatusHandler); // Add this generic route
// Keep or remove the specific approve/reject routes as needed
export default router;
