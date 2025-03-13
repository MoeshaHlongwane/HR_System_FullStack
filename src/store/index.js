import { createStore } from 'vuex';

export default createStore({
  state: {
    employees: [],
    selectedEmployee: null, // To store employee data including review
    attendance_records: [], 
    leaverequests: null,
    payroll: [],
    selectedPayroll: null,
    
    // New state for login tracking
    isLoggedIn: false,  // To track login status
    loggedInEmployee: null,  // To store the logged-in employee's information
  },

  mutations: {
    // Employees
    setEmployees(state, employees) {
      state.employees = employees;
    },
    setSelectedEmployee(state, employee) {
      state.selectedEmployee = employee;
    },
    addEmployee(state, employee) {
      state.employees.unshift(employee); // Add the new employee at the start of the list
    },
    updateEmployee(state, updatedEmployee) {
      const index = state.employees.findIndex(
        (employee) => employee.employee_id === updatedEmployee.employee_id
      );
      if (index !== -1) {
        state.employees.splice(index, 1, updatedEmployee);
      }
    },
    deleteEmployee(state, employeeId) {
      state.employees = state.employees.filter(
        (employee) => employee.employee_id !== employeeId
      );
    },

    // Payroll
    setpayroll(state, payload) {
      state.payroll = payload;
    },
    setSelectedPayroll(state, payload) {
      state.selectedPayroll = payload;
    },

    // Leave Requests
    setleaverequests(state, payload) {
      state.leaverequests = payload;
    },

    // Attendance records
    setAttendance_records(state, payload) {
      state.attendance_records = payload;
    },
    deleteAttendance_record(state, attendance_id) {
      state.attendance_records = state.attendance_records.filter(record => record.attendance_id !== attendance_id);
    },
    updateAttendance_record(state, updatedRecord) {
      const index = state.attendance_records.findIndex(record => record.attendance_id === updatedRecord.attendance_id);
      if (index !== -1) {
        state.attendance_records[index] = { ...state.attendance_records[index], ...updatedRecord };
      }
    },

    // Login-related mutations
    setLoginStatus(state, status) {
      state.isLoggedIn = status;
    },
    setLoggedInEmployee(state, employee) {
      state.loggedInEmployee = employee;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.loggedInEmployee = null;
    }
  },

  actions: {
    // Fetch Attendance Data
    async getData({ commit }) {
      try {
        const response = await fetch('http://localhost:4000/attendance');
        if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
        const { attendance_records } = await response.json();
        commit('setAttendance_records', attendance_records);
        console.log(attendance_records);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    },
    async fetchSingleEmployee({ commit }, employee_id) {
      try {
        const response = await fetch(`http://localhost:4000/employees/${employee_id}`);
        if (!response.ok) throw new Error('Failed to fetch employee');
        
        const employee = await response.json();
        commit('setSelectedEmployee', employee);
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    },
    // New action to update an attendance record
  async updateAttendanceRecord({ commit }, { attendance_id, updatedData }) {
    try {
      // Send a PATCH request to update the attendance record
      const response = await fetch(`http://localhost:4000/attendance/${attendance_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData), // Send the updated data as a JSON payload
      });

      // Check if the request was successful
      if (!response.ok) throw new Error('Failed to update attendance record');

      // Get the updated record from the response
      const updatedRecord = await response.json();

      // Commit the mutation to update the state with the updated record
      commit('updateAttendance_record', updatedRecord);

      // Optionally, you can reload the page or navigate to another page after the update
      location.reload();
    } catch (error) {
      console.error('Error updating attendance record:', error);
    }
  },

    // Login API
    async login({ commit }, { email, password }) {
      try {
        const response = await fetch('http://localhost:4000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();

        // If login is successful, set login state
        if (data.success) {
          commit('setLoginStatus', true);  // Mark user as logged in
          commit('setLoggedInEmployee', data.employee);  // Store the logged-in employee's details
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        commit('setLoginStatus', false); // Ensure login status is false on error
        commit('setLoggedInEmployee', null);
      }
    },

    // Logout API
    logout({ commit }) {
      // Call backend logout API (if applicable), then reset Vuex state
      commit('logout');
    },

    // Fetch Employees
    async getEmployees({ commit }) {
      try {
        const response = await fetch('http://localhost:4000/employees');
        const { employees } = await response.json();
        commit('setEmployees', employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    },

    // Add Employee
    async addEmployee({ commit }, employee) {
      try {
        const response = await fetch('http://localhost:4000/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(employee),
        });
        if (!response.ok) {
          throw new Error('Failed to add employee');
        }
        const newEmployee = await response.json();
        commit('addEmployee', newEmployee);
        location.reload();
      } catch (error) {
        console.error('Error adding employee:', error);
        // Optionally, you can commit a mutation to set an error state in the store
      }
    },

    // Update Employee
    async updateEmployee({ commit }, updatedEmployee) {
      try {
        const response = await fetch(`http://localhost:4000/employees/${updatedEmployee.employee_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedEmployee),
        });
        if (response.ok) {
          commit('updateEmployee', updatedEmployee);
          location.reload(); // Reload after update
        } else {
          throw new Error('Failed to update employee');
        }
      } catch (error) {
        console.error('Error updating employee:', error);
      }
    },

    // Delete Employee
    async deleteEmployee({ commit }, employeeId) {
      try {
        const response = await fetch(`http://localhost:4000/employees/${employeeId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          commit('deleteEmployee', employeeId); // Update store to remove the employee
        } else {
          throw new Error('Failed to delete employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    },

    // Leave Requests
    async getleaverequests({ commit }) {
      try {
        const response = await fetch('http://localhost:4000/leaverequests');
        const { leave_requests } = await response.json();
        commit('setleaverequests', leave_requests);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    },
    async updateLeaveRequestStatus({ commit }, { leave_request_id, status }) {
      try {
        const response = await fetch(
          `http://localhost:4000/leaverequests/${leave_request_id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
          }
        );
        if (response.ok) {
          const { leave_requests } = await response.json();
          commit('setleaverequests', leave_requests);
        } else {
          console.error('Failed to update leave request status');
        }
      } catch (error) {
        console.error('Error updating leave request status:', error);
      }
    },

    // Payroll
    async getpayroll({ commit }) {
      const response = await fetch('http://localhost:4000/payroll');
      const { payroll_records } = await response.json();
      commit('setpayroll', payroll_records);
    },
    async updatePayroll({ commit }, payroll) {
      const response = await fetch(`http://localhost:4000/payroll/${payroll.payroll_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payroll),
      });
      const { payroll_records } = await response.json();
      commit('setpayroll', payroll_records);
    },
  }
});
