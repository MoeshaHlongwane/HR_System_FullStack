
import { pool } from "../config/config.js";
const getEmployees = async () => {
  try {
    const [data] = await pool.query(`
      SELECT DISTINCT employees.*, departments.department_name
      FROM employees
      INNER JOIN departments ON employees.department_id = departments.department_id
    `);
    return data;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
};


const getSingleEmployee = async (employee_id) => {
  const [data] = await pool.query(`
    SELECT employees.position, reviews.performance_review 
    FROM employees
    LEFT JOIN reviews ON employees.employee_id = reviews.employee_id
    WHERE employees.employee_id = ?
  `, [employee_id]);

  return data.length ? data[0] : null; // Ensure it returns a single object
};


// In your employee modal (config.js)
const insertEmployee = async (first_name, last_name, position, contact, department_id) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction(); // Start transaction

    // Insert employee
    const employeeQuery = `
      INSERT INTO employees (first_name, last_name, position, contact, department_id)
      VALUES (?, ?, ?, ?, ?);
    `;
    const employeeValues = [first_name, last_name, position, contact, department_id];
    const [employeeResult] = await connection.query(employeeQuery, employeeValues);
    const employee_id = employeeResult.insertId;
    const employee_name = `${first_name} ${last_name}`;

    // Get current month and year for attendance
    const currentDate = new Date();
    const month_year = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Create default attendance record with all days marked as 'absent'
    const attendanceRecord = {
      employee_id,
      employee_name,
      month_year,
      // Initialize all days as 'absent' (assuming your table has days 1-31)
      ...Object.fromEntries(Array.from({length: 31}, (_, i) => [`day_${i+1}`, 'absent']))
    };

    // Insert attendance record
    const days = Object.keys(attendanceRecord).filter(key => key.startsWith('day_'));
    const dayValues = days.map(day => attendanceRecord[day]);
    
    const attendanceQuery = `
      INSERT INTO attendance (employee_id, employee_name, month_year, ${days.join(', ')})
      VALUES (?, ?, ?, ${dayValues.map(() => '?').join(', ')})
    `;
    
    await connection.query(attendanceQuery, [
      employee_id, 
      employee_name, 
      month_year, 
      ...dayValues
    ]);

    await connection.commit(); // Commit transaction
    return employee_id;
  } catch (error) {
    if (connection) await connection.rollback(); // Rollback on error
    throw new Error(`Failed to insert employee: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
};


  // Delete an employee by ID
  const deleteSingleEmployee = async (employee_id) => {
    await pool.query('DELETE FROM employees WHERE employee_id = ?', [employee_id]);
  };
// Update employee information
const updateEmployee = async (first_name, last_name, position, contact, department_id, employee_id) => {
    await pool.query(
      'UPDATE employees SET first_name = ?, last_name = ?, contact = ?, department_id = ? WHERE employee_id = ?',
      [first_name, last_name, position, contact, department_id, employee_id]
    );
    // Return the updated employee list (or just the updated employee if necessary)
    const [updatedEmployee] = await pool.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id]);
    return updatedEmployee;
  };
export { getEmployees, getSingleEmployee, insertEmployee, deleteSingleEmployee, updateEmployee };