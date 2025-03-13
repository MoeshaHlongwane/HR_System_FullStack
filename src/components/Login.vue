<template>
  <body class="loginbody">
    <div class="image-container">
      <img :src="logo" width="300" height="200" alt="logo" class="centered-image">
    </div>
    <div class="login-container">
      <h2><strong>ADMINISTRATOR LOGIN</strong></h2>
      <div v-if="!isLoggedIn">
        <form @submit.prevent="submitLogin">
          <div class="form-group">
            <label for="employeeName">HR Name:</label>
            <input
              type="text"
              id="employeeName"
              v-model="employeeName"
              class="form-control"
              placeholder="Enter admin name"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control"
              placeholder="Enter admin password"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
          <button type="button" @click.prevent="showForgotPasswordForm" class="btn btn-primary">Forgot Password?</button>
        </form>
      </div>
      <div v-else>
        <p>Welcome, {{ employeeName }}!</p>
      </div>

      <!-- Error Modal -->
      <div v-if="showErrorModal" class="error-modal">
        <div class="modal-content">
          <p>{{ errorMessage }}</p>
          <button @click="closeErrorModal" class="btn btn-secondary">Close</button>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div v-if="showForgotPassword" class="forgot-password-modal">
        <h3 align="center">Reset Password</h3>
        <div class="form-group">
          <label for="resetEmployeeName">HR Name :</label>
          <input
            type="text"
            id="resetEmployeeName"
            v-model="resetEmployeeName"
            class="form-control"
            placeholder="Enter HR Name"
            required
          />
          <label for="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            class="form-control"
            placeholder="Enter new password"
            required
          />
        </div>
        <button @click="submitForgotPassword" class="btn btn-primary">Reset Password</button>
        <button @click="cancelForgotPassword" class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  </body>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      employeeName: '',
      password: '',
      isLoggedIn: false,
      showErrorModal: false,
      errorMessage: '',
      showForgotPassword: false,
      resetEmployeeName: '',
      newPassword: '',
      logo: require('../assets/logo.jpg'),
    };
  },
  methods: {
    // Login handler
    async submitLogin() {
      try {
        // Send POST request to backend for login
        const response = await axios.post('http://localhost:4000/hr/login', {
          employeeName: this.employeeName,  // Use employee name for login
          password: this.password,
        });

        if (response.data.success) {
          this.isLoggedIn = true;
          this.$emit('login-success');
        } else {
          this.showErrorModal = true;
          this.errorMessage = 'Invalid credentials';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.showErrorModal = true;
        this.errorMessage = error.response?.data?.message || 'An error occurred';
      }
    },

    // Close error modal
    closeErrorModal() {
      this.showErrorModal = false;
    },

    // Show forgot password form
    showForgotPasswordForm() {
      this.showForgotPassword = true;
    },

    // Cancel forgot password process
    cancelForgotPassword() {
      this.showForgotPassword = false;
    },

    // Submit forgot password form
    async submitForgotPassword() {
      if (!this.resetEmployeeName || !this.newPassword) {
        alert('Please fill out both fields');
        return;
      }

      try {
        // Send PATCH request to backend to update password
        const response = await axios.patch('http://localhost:4000/hr/reset-password', {
          employeeName: this.resetEmployeeName,  // Use employee name for reset
          newPassword: this.newPassword,
        });

        if (response.data.success) {
          alert('Password reset successfully');
          this.showForgotPassword = false;  // Hide modal after success
        } else {
          alert('Employee not found');
        }
      } catch (error) {
        alert('Error resetting password');
      }
    },
  },
};
</script>

<style scoped>
/* Image container styles */
.image-container {
  text-align: center;
}
.form-group {
  text-align: center;
  font-family: 'Times New Roman', Times, serif;
}
.error-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.error-modal .modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #F9F9F9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-family: 'Times New Roman', Times, serif;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}
.form-group input {
  width: 100%;
  padding: 8px;
  color: #333;
  margin-bottom: 5px;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}
input.form-control {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
button.btn {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px; /* Adds space between buttons */
  transition: background-color 0.3s ease; /* Smooth background transition */
}
button.btn:hover {
  background-color: #0056B3;
}
button.btn:disabled {
  background-color: #CCCCCC;
  cursor: not-allowed;
}
p {
  text-align: center;
  color: #4CAF50;
  font-size: 16px;
}
@media (max-width: 600px) {
  .login-container {
    padding: 20px;
  }
  button.btn {
    padding: 12px;  /* Increase padding for mobile for better usability */
  }
}
</style>
