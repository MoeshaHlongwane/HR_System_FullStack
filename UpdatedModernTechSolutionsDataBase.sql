-- --------------------------------------------------------------------Create Database
CREATE DATABASE moderntech_db;
USE moderntech_db;
-- ------------------------------------------------------------------Create HR Staff table
CREATE TABLE hr_staff (
    hr_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(300) NOT NULL
);
-- ------------------------------------------------------------------Insert HR Staff members
INSERT INTO hr_staff (full_name, password,email)
VALUES
    ('John Doe','p123','Johndoe@gmail.com'),
    ('Jane Smith', 'p345','Janesmith@gmail.com'),
    ('Michael Brown','p678','Michealbron@gmail.com');
    
-- -----------------------------------------------------------------Create Departments table
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);
-- Insert departments
INSERT INTO departments (department_name)
VALUES
    ('Development'),
    ('HR'),
    ('QA'),
    ('Sales'),
    ('Marketing'),
    ('Design'),
    ('IT'),
    ('Finance'),
    ('Support');
-- --------------------------------------------------- Create Employees table (Fixed department_id issue)

CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    position VARCHAR(100) NOT NULL,
    contact VARCHAR(100) NOT NULL,
    department_id INT,  
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
SET FOREIGN_KEY_CHECKS=0;
-- ---------------------------------------------------- Insert Employee Details with short reviews

INSERT INTO employees (first_name,last_name, position, contact, department_id)
VALUES
    ('Sibongile','Nkosi', 'Software Engineer', 'sibongile.nkosi@moderntech.com', 1),
    ('Lungile Moyo', 'HR Manager', 'lungile.moyo@moderntech.com', 2),
    ('Thabo Molefe', 'Quality Analyst', 'thabo.molefe@moderntech.com', 3),
    ('Keshav Naidoo', 'Sales Representative', 'keshav.naidoo@moderntech.com', 4),
    ('Zanele Khumalo', 'Marketing Specialist', 'zanele.khumalo@moderntech.com', 5),
    ('Sipho Zulu', 'UI/UX Designer', 'sipho.zulu@moderntech.com', 6),
    ('Naledi Moeketsi', 'DevOps Engineer', 'naledi.moeketsi@moderntech.com', 7),
    ('Farai Gumbo', 'Content Strategist', 'farai.gumbo@moderntech.com', 8),
    ('Karabo Dlamini', 'Accountant', 'karabo.dlamini@moderntech.com', 9),
    ('Fatima Patel', 'Customer Support Lead', 'fatima.patel@moderntech.com', 9);
    
-- -------------------------------------------------------------- Create Leave Requests table
CREATE TABLE leave_requests (
    leave_request_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Approved', 'Pending', 'Denied') NOT NULL,
    reason TEXT NOT NULL,
    action ENUM('Approve', 'Deny') DEFAULT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
SET FOREIGN_KEY_CHECKS=0;
-- Insert Leave Requests
INSERT INTO leave_requests (employee_id, date, status, reason)
VALUES
    (1, '2024-11-22', 'Approved', 'Sick Leave'),
    (1, '2024-12-01', 'Pending', 'Personal'),
    (2, '2024-11-15', 'Denied', 'Family Responsibility'),
    (2, '2024-12-02', 'Approved', 'Vacation'),
    (3, '2024-11-10', 'Approved', 'Medical Appointment'),
    (3, '2024-12-05', 'Pending', 'Personal'),
    (4, '2024-11-20', 'Approved', 'Bereavement'),
    (5, '2024-12-01', 'Pending', 'Childcare'),
    (6, '2024-11-18', 'Approved', 'Sick Leave'),
    (7, '2024-12-02', 'Approved', 'Medical Appointment'),
    (8, '2024-11-19', 'Denied', 'Childcare'),
    (9, '2024-12-03', 'Pending', 'Vacation');
    
-- ---------------------------------------------------------------- Alterations for all tables
ALTER TABLE `moderntech_db`.`employees`
DROP FOREIGN KEY `employees_ibfk_1`;
ALTER TABLE `moderntech_db`.`employees`
ADD CONSTRAINT `employees_ibfk_1`
FOREIGN KEY (`department_id`)
REFERENCES `moderntech_db`.`departments` (`department_id`)
ON DELETE CASCADE
ON UPDATE CASCADE;
ALTER TABLE `moderntech_db`.`leave_requests`
DROP FOREIGN KEY `leave_requests_ibfk_1`;
ALTER TABLE `moderntech_db`.`leave_requests`
ADD CONSTRAINT `leave_requests_ibfk_1`
FOREIGN KEY (`employee_id`)
REFERENCES `moderntech_db`.`employees` (`employee_id`)
ON DELETE CASCADE
ON UPDATE CASCADE;
ALTER TABLE `moderntech_db`.`payroll`
DROP FOREIGN KEY `payroll_ibfk_1`;
ALTER TABLE `moderntech_db`.`payroll`
ADD CONSTRAINT `payroll_ibfk_1`
FOREIGN KEY (`employee_id`)
REFERENCES `moderntech_db`.`employees` (`employee_id`)
ON DELETE CASCADE
ON UPDATE CASCADE;
ALTER TABLE `moderntech_db`.`attendance`
DROP FOREIGN KEY `attendance_ibfk_1`;
ALTER TABLE `moderntech_db`.`attendance`
ADD CONSTRAINT `attendance_ibfk_1`
FOREIGN KEY (`employee_id`)
REFERENCES `moderntech_db`.`employees` (`employee_id`)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- ----------------------------------------------------------- Altering attendance Table
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    month_year VARCHAR(7) NOT NULL,
    day_25 VARCHAR(20),
    day_26 VARCHAR(20),
    day_27 VARCHAR(20),
    day_28 VARCHAR(20),
    day_29 VARCHAR(20),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
) AUTO_INCREMENT=101;
-- Insert attendance data for November 2024 (specified days)
INSERT INTO attendance
(employee_id, employee_name, month_year, day_25, day_26, day_27, day_28, day_29)
VALUES
    (1, 'Sibongile Nkosi', '2024-11', 'Present', 'Absent', 'Present', 'Present', 'Present'),
    (2, 'Lungile Moyo', '2024-11', 'Present', 'Present', 'Absent', 'Present', 'Present'),
    (3, 'Thabo Molefe', '2024-11', 'Present', 'Present', 'Present', 'Absent', 'Present'),
    (4, 'Keshav Naidoo', '2024-11', 'Absent', 'Present', 'Present', 'Present', 'Present'),
    (5, 'Zanele Khumalo', '2024-11', 'Present', 'Present', 'Absent', 'Present', 'Present'),
    (6, 'Sipho Zulu', '2024-11', 'Present', 'Present', 'Absent', 'Present', 'Present'),
    (7, 'Naledi Moeketsi', '2024-11', 'Present', 'Present', 'Present', 'Absent', 'Present'),
    (8, 'Farai Gumbo', '2024-11', 'Present', 'Absent', 'Present', 'Present', 'Present'),
    (9, 'Karabo Dlamini', '2024-11', 'Present', 'Present', 'Present', 'Absent', 'Present'),
    (10, 'Fatima Patel', '2024-11', 'Present', 'Present', 'Absent', 'Present', 'Present');
    
ALTER TABLE attendance
ADD COLUMN day_30 VARCHAR(20) NOT NULL DEFAULT 'Absent';

ALTER TABLE attendance
ADD COLUMN day_31 VARCHAR(20) NOT NULL DEFAULT 'Absent';

CREATE TABLE payroll (
    payroll_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    hours_worked INT NOT NULL,
    leave_deductions INT NOT NULL,
    gross_salary DECIMAL(10,2) NOT NULL,
    hourly_rate DECIMAL(10,2) GENERATED ALWAYS AS (gross_salary / hours_worked) STORED,
    deductions DECIMAL(10,2) GENERATED ALWAYS AS (gross_salary - final_salary) STORED,
    remuneration_pa DECIMAL(10,2) GENERATED ALWAYS AS (gross_salary * 12) STORED,
    net_salary_with_deductions DECIMAL(10,2) GENERATED ALWAYS AS (final_salary - deductions) STORED,
    final_salary DECIMAL(10,2) NOT NULL,
    payslip TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Disable foreign key checks to allow modifications
SET FOREIGN_KEY_CHECKS=0;
-- Insert Payroll Information (With Gross Salary Calculations)
INSERT INTO payroll (employee_id, hours_worked, leave_deductions, gross_salary, final_salary)
VALUES
    (1, 160, 8, 70000, 69500),
    (2, 150, 10, 80000, 79000),
    (3, 170, 4, 55000, 54800),
    (4, 165, 6, 60000, 59700),
    (5, 158, 5, 58000, 57850),
    (6, 168, 2, 65000, 64800),
    (7, 175, 3, 72000, 71800),
    (8, 160, 0, 56000, 56000),
    (9, 155, 5, 62000, 61500),
    (10, 162, 4, 58000, 57750);
-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;
-- Select all Payroll Data with Calculated Fields
SELECT * FROM payroll;


    

