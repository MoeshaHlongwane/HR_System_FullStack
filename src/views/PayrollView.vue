<template>
  <NavBar />
  <br>
  <div class="table-container">
    <h2>Remuneration records</h2>
    <!-- Search Bar -->
     <div>
      <input v-model="searchQuery" placeholder="Search by Employee Name..." class="search-bar" />
     </div>

    <!-- Styled Payroll Table -->
    <table class="payroll-table">
      <thead>
        <tr>
          <th>Payroll ID</th>
          <th>Employees Name</th>
          <th>Hours Worked</th>
          <th>Leave Deductions</th>
          <th>Gross Salary (R)</th>
          <th>Hourly Rate (R)</th>
          <th>Deductions (R)</th>
          <th>Remuneration (Per Annum) (R)</th>
          <th>Net Salary (R)</th>
          <th>Final Salary (R)</th>
          <th>Download Payslip</th>
        </tr>
      </thead>
      <tbody v-if="filteredPayrolls.length > 0">
        <tr v-for="payroll in filteredPayrolls" :key="payroll.payroll_id">
          <td>{{ payroll.payroll_id }}</td>
          <td>{{ payroll.first_name }}</td>
          <td>{{ payroll.hours_worked }}</td>
          <td>{{ payroll.leave_deductions }}</td>
          <td>{{ formatAmount(payroll.gross_salary) }}</td>
          <td>{{ formatAmount(payroll.hourly_rate) }}</td>
          <td>{{ formatAmount(payroll.deductions) }}</td>
          <td>{{ formatAmount(payroll.remuneration_pa) }}</td>
          <td>{{ formatAmount(payroll.net_salary_with_deductions) }}</td>
          <td>{{ formatAmount(payroll.final_salary) }}</td>
          <td><button @click="downloadPayslip(payroll)">Download</button></td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="11" class="no-results">No results found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import jsPDF from "jspdf";

export default {
  components: { NavBar },
  data() {
    return {
      searchQuery: "", // Holds the search input
    };
  },
  computed: {
    // Filters payroll data based on searchQuery
    filteredPayrolls() {
      return this.$store.state.payroll?.filter((payroll) =>
        payroll.first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  mounted() {
    this.$store.dispatch("getpayroll");
  },
  methods: {
    formatAmount(amount) {
      const numAmount = parseFloat(amount);
      return isNaN(numAmount) ? "Invalid Amount" : `R${numAmount.toFixed(2)}`;
    },
    downloadPayslip(payroll) {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold","boder");
      doc.text("Payslip", 80, 20);
      doc.setFont("helvetica", "normal");
      doc.text(`Payroll ID: ${payroll.payroll_id}`, 20, 40);
      doc.text(`Employee Name: ${payroll.first_name}`, 20, 50);
      doc.text(`Hours Worked: ${payroll.hours_worked}`, 20, 60);
      doc.text(`Leave Deductions: ${payroll.leave_deductions}`, 20, 70);
      doc.text(`Gross Salary: ${this.formatAmount(payroll.gross_salary)}`, 20, 80);
      doc.text(`Hourly Rate: ${this.formatAmount(payroll.hourly_rate)}`, 20, 90);
      doc.text(`Deductions: ${this.formatAmount(payroll.deductions)}`, 20, 100);
      doc.text(`Remuneration (Per Annum): ${this.formatAmount(payroll.remuneration_pa)}`, 20, 110);
      doc.text(`Net Salary: ${this.formatAmount(payroll.net_salary_with_deductions)}`, 20, 120);
      doc.text(`Final Salary: ${this.formatAmount(payroll.final_salary)}`, 20, 130);

      doc.save(`payslip_${payroll.payroll_id}.pdf`);
    },
  },
};
</script>

<style>
/* Container Styling */
.table-container {
  width: 90%;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
h2 {
  font-size: 24px;
  color: #1A3E7D; /* Dark blue */
  margin-bottom: 20px;
}
/* Search Bar Styling */
.search-bar {
  width: 60%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #B0C4DE; /* Light steel blue */
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
  border: 1px solid #007BFF; /* Blue border for the search bar */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.search-bar:focus {
  border-color: #4C6D9A; /* Slightly darker blue on focus */
  outline: none;
}
/* Payroll Table */
.payroll-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.payroll-table th,
.payroll-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #B0C4DE; /* Light steel blue border */
  background-color: #F1F8FF; /* Light blue background for rows */
  color: #333; /* Dark text for contrast */
  font-weight: normal;
}
/* Table Header Styling */
.payroll-table th {
  background-color: #4C6D9A; /* Professional bluish header background */
  color: white;
  font-weight: bold;
}
/* Alternate Row Coloring */
.payroll-table tr:nth-child(even) td {
  background-color: #E6F1FF; /* Lighter blue for even rows */
}
.payroll-table tr:nth-child(odd) td {
  background-color: #FFFFFF; /* White for odd rows */
}
/* Button Styling */
button {
  background-color: #4C6D9A; /* Bluish background for buttons */
  color: white;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: #365B7A; /* Darker blue for hover effect */
}
/* No Results Message */
.no-results {
  text-align: center;
  font-size: 18px;
  color: #888;
  padding: 15px;
}
</style>