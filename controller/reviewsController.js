import {
    getReviews,
    getSingleReview,
    insertReview,
    deleteSingleReview,
    updateReview
  } from "../model/reviewsModal.js";
  
  // Get all reviews
  const getReviewsCon = async (req, res) => {
    try {
      const reviews = await getReviews();
      res.json({ reviews });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve reviews', error: error.message });
    }
  };
  
  // Get a single review
  const getSingleReviewCon = async (req, res) => {
    try {
      const review = await getSingleReview(req.params.review_id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.json({ review });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve review', error: error.message });
    }
  };
  
  // Add a new review
  const postReviewCon = async (req, res) => {
    const { employee_id, performance_review } = req.body;
  
    // Validate input
    if (!employee_id || !performance_review) {
      return res.status(400).json({ message: 'Missing required fields: employee_id or performance_review' });
    }
  
    try {
      await insertReview(employee_id, performance_review);
      res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add review', error: error.message });
    }
  };
  
  // Delete a review
  const deleteSingleReviewCon = async (req, res) => {
    try {
      await deleteSingleReview(req.params.review_id);
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete review', error: error.message });
    }
  };
  
  // Update a review
  const patchReviewCon = async (req, res) => {
    const { performance_review } = req.body;
  
    // Validate input
    if (!performance_review) {
      return res.status(400).json({ message: 'Missing required field: performance_review' });
    }
  
    try {
      await updateReview(performance_review, req.params.review_id);
      res.json({ message: 'Review updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update review', error: error.message });
    }
  };
  
  export { getReviewsCon, getSingleReviewCon, postReviewCon, deleteSingleReviewCon, patchReviewCon };
  