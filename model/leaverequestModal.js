import { pool } from '../config/config.js';

// Create a new leave request
export const createLeaveRequest = async (employee_id, start_date, end_date, reason, leave_type) => {
  const query = `
    INSERT INTO leave_requests (employee_id, start_date, end_date, reason, leave_type, status) 
    VALUES (?, ?, ?, ?, ?, 'Pending')
  `;
  
  await pool.execute(query, [employee_id, start_date, end_date, reason, leave_type]);
};

// Get all leave requests with employee names
export const getAllLeaveRequests = async () => {
  try {
    const query = `
      SELECT lr.*, e.first_name, e.last_name 
      FROM leave_requests lr
      INNER JOIN employees e ON lr.employee_id = e.employee_id
      ORDER BY lr.id DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    throw error;
  }
};

// Update leave request status
export const updateLeaveRequestStatus = async (id, status) => {
  // Validate parameters
  if (typeof id === 'undefined' || typeof status === 'undefined') {
    throw new Error('Both id and status parameters are required');
  }

  try {
    const query = `UPDATE leave_requests SET status = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [status, id]);
    
    if (result.affectedRows === 0) {
      throw new Error('No leave request found with that ID');
    }
    
    return { 
      success: true, 
      message: 'Status updated successfully',
      id,
      newStatus: status
    };
  } catch (error) {
    console.error("Error updating leave request status:", error);
    throw error;
  }
};