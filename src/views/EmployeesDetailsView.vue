<template>
  <NavBar />
  <br />
  <div class="header-container">
    <h2>Employees Information</h2>
    <input v-model="searchQuery" placeholder="Search employees..." class="search-bar" />
    <button @click="isAddModalVisible = true" class="add-btn">Add Employee</button>
  </div>

  <table class="employee-table">
    <thead>
      <tr>
        <th>Employee ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Contact</th>
        <th>Position</th>
        <th>Department ID</th>
        <th>Department Name</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="employee in filteredEmployees" :key="employee.employee_id">
        <td>{{ employee.employee_id }}</td>
        <td>{{ employee.first_name }}</td>
        <td>{{ employee.last_name }}</td>
        <td>{{ employee.contact }}</td>
        <td>{{ employee.position }}</td>
        <td>{{ employee.department_id }}</td>
        <td>{{ employee.department_name }}</td>
        <td class="action-buttons">
          <button @click="editEmployee(employee)">Edit</button>
          <button @click="confirmDelete(employee)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Add Employee Modal -->
  <div v-if="isAddModalVisible" class="modal">
    <div class="modal-content">
      <h3>Add New Employee</h3>
      <input v-model="insertEmployee.first_name" placeholder="First Name" />
      <input v-model="insertEmployee.last_name" placeholder="Last Name" />
      <input v-model="insertEmployee.contact" placeholder="Contact" />
      <input v-model="insertEmployee.position" placeholder="Position" />
      <input v-model="insertEmployee.department_id" placeholder="Department ID" />
      <button @click="handleAddEmployee">Save</button>
      <button @click="closeAddModal">Cancel</button>
    </div>
  </div>

  <!-- Edit Employee Modal -->
  <div v-if="isEditModalVisible" class="modal">
    <div class="modal-content">
      <h3>Edit Employee</h3>
      <input v-model="editedEmployee.first_name" placeholder="First Name" />
      <input v-model="editedEmployee.last_name" placeholder="Last Name" />
      <input v-model="editedEmployee.contact" placeholder="Contact" />
      <input v-model="editedEmployee.position" placeholder="Position" />
      <button @click="handleUpdateEmployee">Save</button>
      <button @click="closeEditModal">Cancel</button>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="isDeleteModalVisible" class="modal">
    <div class="modal-content">
      <h3>Are you sure you want to delete this employee?</h3>
      <button @click="handleDeleteEmployee">Yes, Delete</button>
      <button @click="closeDeleteModal">Cancel</button>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: { NavBar },
  data() {
    return {
      searchQuery: "",
      isAddModalVisible: false,
      isEditModalVisible: false,
      isDeleteModalVisible: false,
      insertEmployee: {
        first_name: "",
        last_name: "",
        contact: "",
        position: "",
        department_id: "",
      },
      editedEmployee: null,
      employeeToDelete: null,
    };
  },
  computed: {
    ...mapState(["employees"]),
    filteredEmployees() {
      return this.employees?.filter((employee) =>
        Object.values(employee).some((value) =>
          String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );
    },
  },
  methods: {
    ...mapActions(["getEmployees", "addEmployee", "updateEmployee", "deleteEmployee"]),

    async handleAddEmployee() {
    try {
      // First add the employee
      const newEmployeeId = await this.addEmployee(this.insertEmployee);
      
      // The attendance record is now automatically created in the backend
      // So we just need to handle the review part
      await this.$axios.post("http://localhost:4000/reviews", {
        employee_id: newEmployeeId,
        performance_review: "New Hire",
      });

      this.closeAddModal();
      this.getEmployees(); // Refresh the employee list
    } catch (error) {
      console.error("Error adding employee:", error);
      // You might want to show an error message to the user here
    }
  },
  
    handleUpdateEmployee() {
      this.updateEmployee(this.editedEmployee);
      this.closeEditModal();
    },

    handleDeleteEmployee() {
      this.deleteEmployee(this.employeeToDelete.employee_id);
      this.closeDeleteModal();
    },

    editEmployee(employee) {
      this.editedEmployee = { ...employee };
      this.isEditModalVisible = true;
    },

    confirmDelete(employee) {
      this.employeeToDelete = employee;
      this.isDeleteModalVisible = true;
    },

    closeAddModal() {
      this.isAddModalVisible = false;
      this.resetEmployeeForm();
    },

    closeEditModal() {
      this.isEditModalVisible = false;
      this.editedEmployee = null;
    },

    closeDeleteModal() {
      this.isDeleteModalVisible = false;
      this.employeeToDelete = null;
    },

    resetEmployeeForm() {
      this.insertEmployee = {
        first_name: "",
        last_name: "",
        contact: "",
        position: "",
        department_id: "",
      };
    },
  },
  mounted() {
    this.getEmployees();
  },
};
</script>


<style scoped>
/* Responsive Design */
@media screen and (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }

  .employee-table th,
  .employee-table td {
    font-size: 14px;
    padding: 8px;
  }
}

@media screen and (max-width: 480px) {
  .header-container {
    flex-direction: column;
    text-align: center;
  }

  .search-bar {
    width: 90%;
  }

  .add-btn {
    width: 100%;
  }
}

/* Modal Styling */
.modal {
  position: fixed;
  top: 65%;
  left: 50%;
  width: 50%;
  height: auto; /* This allows the height to adjust based on content */
  transform: translate(-50%, -50%); /* Centers the modal */
  display: block; /* Ensure the modal is displayed as a block element */
  background-color: blue;
  color: #0056B3;
  z-index: 1000; /* Makes sure the modal appears above other content */
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
/* Styling for Employee Table */
.employee-table {
  width: 90%;
  border-collapse: collapse;
  margin: 20px 0;
  font-family: Arial, sans-serif;
  border: 1px solid #B0C4DE; /* Light steel blue */
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
h2 {
  font-size: 24px;
  color: #1A3E7D; /* Dark blue */
  margin-bottom: 20px;
}
.employee-table th,
.employee-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #B0C4DE; /* Light steel blue border */
  text-align: center;
  border: 1px solid #B0C4DE; /* Light steel blue border */
  background-color: #F1F8FF; /* Light blue background for rows */
  color: #333; /* Dark text for contrast */
  font-weight: normal;
}
.employee-table th {
  background-color: #4C6D9A; /* Bluish header */
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.employee-table tr:nth-child(even) td{
  background-color: #E6F1FF;
}
.employee-table tr:nth-child(odd) td{
  background-color: #FFFFFF;
}
.employee-table tr:hover {
  background-color: #F1F1F1; /* Light gray background on hover */
}
/* Action Buttons Styling */
.action-buttons {
  display: flex;
  gap: 10px;
}
.edit-btn,
.delete-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: white;
}
.add-btn {
  display: block;
  margin: 0 auto 20px;
  padding: 10px 20px;
  background-color:  #1A3E7D; /* Blue background for add button */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.add-btn:hover {
  background-color: #0056B3; /* Darker blue for hover effect */
}
.edit-btn {
  background-color: #4CAF50; /* Green for edit */
}
.delete-btn {
  background-color: #F44336; /* Red for delete */
}
.edit-btn:hover {
  background-color: #45A049; /* Darker green for edit hover */
}
.delete-btn:hover {
  background-color: #E53935; /* Darker red for delete hover */
}
/* Header Container */
.header-container {
  text-align: center;
  margin-bottom: 20px;
}
/* Search Bar Styling */
.search-bar {
  width: 50%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #007BFF;
  border-radius: 5px;
}
.search-bar:focus {
  border-color: #4C6D9A; /* Dark blue border for focus */
  outline: none;
}
.employee-table th, .employee-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.employee-table th {
  background-color: #4C6D9A; /* Bluish header */
  color: white;
}
</style>
