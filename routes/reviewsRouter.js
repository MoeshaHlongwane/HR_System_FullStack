import express from 'express';
import { getReviewsCon, getSingleReviewCon, postReviewCon, deleteSingleReviewCon, patchReviewCon } from '../controller/reviewsController.js';

const router = express.Router();

router.get('/', getReviewsCon);
router.get('/:review_id', getSingleReviewCon);
router.post('/', postReviewCon);
router.delete('/:review_id', deleteSingleReviewCon);
router.patch('/:review_id', patchReviewCon);

export default router;
