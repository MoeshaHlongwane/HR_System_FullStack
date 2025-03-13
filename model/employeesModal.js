
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


// Insert a new employee
const insertEmployee = async (first_name, last_name, position, contact, department_id) => {
  const query = `
    INSERT INTO employees (first_name, last_name, position, contact, department_id)
    VALUES (?, ?, ?, ?, ?);
  `;
  const values = [first_name, last_name, position, contact, department_id];

  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    const [result] = await connection.query(query, values);
    return result.insertId; // Return the new employee_id
  } catch (error) {
    throw new Error(`Failed to insert employee: ${error.message}`);
  } finally {
    if (connection) connection.release(); // Always release connection
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