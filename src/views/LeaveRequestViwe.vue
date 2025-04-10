<template>
  <NavBar />
  <h1>Employees Leave Requests</h1>
  
  <div class="search-container">
    <input v-model="searchQuery" placeholder="Search by employee ID or reason..." class="search-bar" />
  </div>

  <div v-if="isLoading" class="loading-message">Loading leave requests...</div>

  <table v-else class="leave-request-table">
    <thead>
      <tr>
        <th>Request ID</th>
        <th>Employee ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Leave Type</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Reason</th>
        <th>Status</th>
        <th>Requested Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="request in filteredRequests" :key="request.id">
        <td>{{ request.id }}</td>
        <td>{{ request.employee_id }}</td>
        <td>{{ request.first_name }}</td>
        <td>{{ request.last_name }}</td>
        <td>{{ request.leave_type }}</td>
        <td>{{ formatDate(request.start_date) }}</td>
        <td>{{ formatDate(request.end_date) }}</td>
        <td>{{ request.reason }}</td>
        <td :class="statusClass(request.status)">{{ request.status }}</td>
        <td>{{ formatDate(request.request_date) }}</td>
        <td>
          <button 
            class="btn-accept" 
            v-if="request.status === 'Pending'" 
            @click="updateStatus(request.id, 'Approved')"
            :disabled="updating"
          >
            Accept
          </button>
          <button 
            class="btn-Denied" 
            v-if="request.status === 'Pending'" 
            @click="updateStatus(request.id, 'Rejected')"
            :disabled="updating"
          >
            Denied
          </button>
          <span v-if="request.status !== 'Pending'">No actions</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';

export default {
  data() {
    return {
      searchQuery: '',
      isLoading: true,
      updating: false,
      leaveRequests: []
    };
  },
  components: {
    NavBar,
  },
  computed: {
    filteredRequests() {
      if (!this.searchQuery) return this.leaveRequests;
      
      const query = this.searchQuery.toLowerCase();
      return this.leaveRequests.filter(request => {
        return (
          String(request.employee_id).includes(query) ||
          request.reason.toLowerCase().includes(query) ||
          request.leave_type.toLowerCase().includes(query)
        );
      });
    }
  },
  async mounted() {
    await this.fetchLeaveRequests();
  },
  methods: {
    async fetchLeaveRequests() {
      this.isLoading = true;
      try {
        const response = await axios.get('http://localhost:4000/leaverequests');
        this.leaveRequests = response.data;
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        alert("Failed to load leave requests");
      }
      this.isLoading = false;
    },
    async updateStatus(id, status) {
  this.updating = true;
  try {
    await axios.patch(`http://localhost:4000/leaverequests/${id}`, { 
      status: status // Explicitly send as an object
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    await this.fetchLeaveRequests();
  } catch (error) {
    console.error("Error updating leave request:", error);
    alert(error.response?.data?.message || "Failed to update leave request");
  }
  this.updating = false;
},
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    statusClass(status) {
      return {
        'status-approved': status === 'Approved',
        'status-rejected': status === 'Rejected',
        'status-pending': status === 'Pending'
      };
    }
  }
};
</script>

<style scoped>
.loading-message {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

.leave-request-table {
  width: 95%;
  margin: 20px auto;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.leave-request-table th,
.leave-request-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.leave-request-table th {
  background-color: #1A3E7D;
  color: white;
  font-weight: 500;
}

.leave-request-table tr:hover td {
  background-color: #f5f9ff;
}

.status-approved {
  color: #28a745;
  font-weight: 500;
}

.status-rejected {
  color: #dc3545;
  font-weight: 500;
}

.status-pending {
  color: #ffc107;
  font-weight: 500;
}

.search-container {
  margin: 20px auto;
  width: 95%;
  max-width: 600px;
}

.search-bar {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.btn-accept, .btn-Denied {
  padding: 6px 12px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-accept {
  background-color: #28a745;
  color: white;
}

.btn-Denied {
  background-color: #dc3545;
  color: white;
}

.btn-accept:hover {
  background-color: #218838;
}

.btn-Denied:hover {
  background-color: #c82333;
}

.btn-accept:disabled, .btn-Denied:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

h1 {
  color: #1A3E7D;
  text-align: center;
  margin: 20px 0;
}
</style>