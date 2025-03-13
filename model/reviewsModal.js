import { pool } from "../config/config.js";

// Get all reviews
const getReviews = async () => {
  try {
    const [data] = await pool.query(`
      SELECT reviews.*,employees.employee_id, employees.position, employees.first_name, employees.last_name 
      FROM reviews
      INNER JOIN employees ON reviews.employee_id = employees.employee_id
    `);
    return data;
  } catch (error) {
    console.error("Database error:", error);
    throw error; // Rethrow so the controller can catch it
  }
};

// Get a single review by review_id
const getSingleReview = async (review_id) => {
  const [data] = await pool.query(`
    SELECT reviews.performance_review, employees.first_name, employees.last_name
    FROM reviews
    INNER JOIN employees ON reviews.employee_id = employees.employee_id
    WHERE reviews.review_id = ?
  `, [review_id]);

  return data.length ? data[0] : null; // Ensure it returns a single object
};

// Insert a new review
const insertReview = async (employee_id, performance_review) => {
  const query = `
    INSERT INTO reviews (employee_id, performance_review)
    VALUES (?, ?);
  `;
  const values = [employee_id, performance_review];

  try {
    const [result] = await pool.query(query, values);
    return result;
  } catch (error) {
    throw new Error(`Failed to insert review: ${error.message}`);
  }
};

// Delete a review by review_id
const deleteSingleReview = async (review_id) => {
  await pool.query('DELETE FROM reviews WHERE review_id = ?', [review_id]);
};

// Update a review
const updateReview = async (performance_review, review_id) => {
  await pool.query(
    'UPDATE reviews SET performance_review = ? WHERE review_id = ?',
    [performance_review, review_id]
  );

  // Return the updated review
  const [updatedReview] = await pool.query('SELECT * FROM reviews WHERE review_id = ?', [review_id]);
  return updatedReview;
};

export { getReviews, getSingleReview, insertReview, deleteSingleReview, updateReview };
