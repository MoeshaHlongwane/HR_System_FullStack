<template>
    <NavBar />
    <br>
    <div class="employee-reviews">
      <button @click="openAddReviewModal" class="btn primary-btn">Post a New Review</button>
  
      <div class="review-cards">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-for="employee in employees" :key="employee.employee_id" class="review-card">
          <h2>Employee ID: {{ employee.employee_id }}</h2>
          <h2 class="employee-name">{{ employee.first_name }} {{ employee.last_name }}</h2>
          <p class="employee-position"><strong>Position:</strong> {{ employee.position }}</p>
  
          <div v-if="employee.reviews.length">
            <h3 class="reviews-title">Performance Reviews</h3>
            <div v-for="review in employee.reviews" :key="review.review_id" class="review-card-body">
              <p><strong>Review:</strong> {{ review.performance_review }}</p>
              <div class="review-actions">
                <button @click="openEditReviewModal(review)" class="btn edit-btn">Edit</button>
                <button @click="openDeleteModal(review.review_id)" class="btn delete-btn">Delete</button>
              </div>
            </div>
          </div>
          <div v-else>
            <p class="no-reviews">No reviews available</p>
          </div>
        </div>
      </div>
  
      <!-- Delete Review Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Are you sure you want to delete this review?</h3>
          <div class="modal-actions">
            <button @click="deleteReview" class="btn confirm-btn">Yes, Delete</button>
            <button @click="closeDeleteModal" class="btn cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
  
      <!-- Add Review Modal -->
      <div v-if="showAddReviewModal" class="modal">
        <div class="modal-content">
          <h2 class="modal-title">Add New Review</h2>
          <form @submit.prevent="addReview">
            <label for="employee_id">Employee ID:</label>
            <input type="number" v-model="newReview.employee_id" id="employee_id" required class="input-field" />
            <label for="performance_review">Performance Review:</label>
            <textarea v-model="newReview.performance_review" id="performance_review" required class="input-field"></textarea>
            <div class="modal-actions">
              <button type="submit" class="btn submit-btn">Submit</button>
              <button @click="closeAddReviewModal" type="button" class="btn close-btn">Close</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Edit Review Modal -->
      <div v-if="showEditReviewModal" class="modal">
        <div class="modal-content">
          <h2>Edit Review</h2>
          <form @submit.prevent="editReview">
            <textarea v-model="editingReview.performance_review" placeholder="Edit the performance review"></textarea>
            <div class="modal-actions">
              <button type="submit" class="btn submit-btn">Save Changes</button>
              <button @click="closeEditReviewModal" type="button" class="btn close-btn">Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
<script>
import NavBar from '@/components/NavBar.vue';
  
  export default {
    components: {
      NavBar
    },
    data() {
      return {
        employees: [],
        loading: true,
        showAddReviewModal: false,
        showEditReviewModal: false,
        showDeleteModal: false,
        reviewToDelete: null,
        newReview: { employee_id: null, performance_review: '' },
        editingReview: { review_id: null, performance_review: '' }
      };
    },
    mounted() {
      this.fetchEmployeesReviews();
    },
    methods: {
      async fetchEmployeesReviews() {
        try {
          const response = await fetch('http://localhost:4000/reviews');
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          if (Array.isArray(data.reviews)) {
            this.employees = this.mapReviewsToEmployees(data.reviews);
          } else {
            console.error('Invalid data structure: reviews should be an array', data);
            this.employees = [];
          }
        } catch (error) {
          console.error('Error fetching employee reviews:', error);
          this.employees = [];
        } finally {
          this.loading = false;
        }
      },
  
      mapReviewsToEmployees(reviews) {
        const employeesMap = {};
        reviews.forEach(review => {
          if (!employeesMap[review.employee_id]) {
            employeesMap[review.employee_id] = {
              employee_id: review.employee_id,
              first_name: review.first_name,
              last_name: review.last_name,
              position: review.position,
              reviews: []
            };
          }
          employeesMap[review.employee_id].reviews.push({
            review_id: review.review_id,
            performance_review: review.performance_review
          });
        });
        return Object.values(employeesMap);
      },
  
      openAddReviewModal() {
        this.showAddReviewModal = true;
      },
      closeAddReviewModal() {
        this.showAddReviewModal = false;
        this.newReview = { employee_id: null, performance_review: '' };
      },
  
      async addReview() {
        try {
          const response = await fetch('http://localhost:4000/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.newReview)
          });
          const data = await response.json();
          if (data.success) {
            this.fetchEmployeesReviews();
            this.closeAddReviewModal();
          } else {
            console.error('Failed to add review', data);
          }
        } catch (error) {
          console.error('Error adding review:', error);
        }
      },
  
      openEditReviewModal(review) {
        this.editingReview = { ...review };
        this.showEditReviewModal = true;
      },
      closeEditReviewModal() {
        this.showEditReviewModal = false;
        this.editingReview = { review_id: null, performance_review: '' };
      },
  
      async editReview() {
        try {
          const response = await fetch(`http://localhost:4000/reviews/${this.editingReview.review_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              performance_review: this.editingReview.performance_review
            })
          });
  
          const data = await response.json();
          if (data.success) {
            this.fetchEmployeesReviews();
            this.closeEditReviewModal();
          } else {
            console.error('Failed to update review', data);
          }
        } catch (error) {
          console.error('Error editing review:', error);
        }
      },
  
      openDeleteModal(reviewId) {
        this.showDeleteModal = true;
        this.reviewToDelete = reviewId;
      },
  
      closeDeleteModal() {
        this.showDeleteModal = false;
        this.reviewToDelete = null;
      },
  
      async deleteReview() {
        try {
          const response = await fetch(`http://localhost:4000/reviews/${this.reviewToDelete}`, {
            method: 'DELETE',
          });
          const result = await response.json();
          if (response.ok) {
            this.employees = this.employees.map(employee => {
              employee.reviews = employee.reviews.filter(review => review.review_id !== this.reviewToDelete);
              return employee;
            });
            this.closeDeleteModal(); // Close the modal after deletion
          } else {
            console.error('Failed to delete review:', result);
          }
        } catch (error) {
          console.error('Error deleting review:', error);
        }
      }
    }
  };
</script>
  
  <style scoped>
  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Dark overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px; /* Adjust modal width */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center; /* Center the content */
}

.modal-content h3 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: space-around; /* Distribute buttons evenly */
  margin-top: 20px;
}

.confirm-btn {
  background-color: #dc3545;
  color: white;
}

.confirm-btn:hover {
  background-color: #c82333;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

  .modal-content form textarea {
  width: 100%;
  height: 150px; 
  padding: 10px; 
  border-radius: 8px; 
  border: 1px solid #ccc; /* Adds a light border */
  resize: vertical; /* Allows resizing vertically only */
  font-size: 1em; /* Ensures readable text size */
  margin-bottom: 20px; /* Adds space between textarea and the buttons */
}

.modal-content form {
  display: flex;
  flex-direction: column;
}

  .employee-reviews {
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #f4f6f9;
    border-radius: 8px;
  }
  
  .page-title {
    font-size: 2em;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .primary-btn {
    background-color: #007bff;
    color: white;
  }
  
  .primary-btn:hover {
    background-color: #0056b3;
  }
  
  .edit-btn {
    background-color: #ffc107;
    color: white;
  }
  
  .edit-btn:hover {
    background-color: #e0a800;
  }
  
  .delete-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .delete-btn:hover {
    background-color: #c82333;
  }
  
  .review-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .review-card {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow: hidden;
  }
  
  .review-card h2 {
    font-size: 1.6em;
    color: #333;
  }
  
  .review-card p {
    font-size: 1em;
    color: #666;
  }
  
  .review-card-body {
    margin-top: 15px;
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
  }
  
  .review-actions {
    margin-top: 15px;
    display: flex;
    gap: 10px;
  }
  
  .no-reviews {
    color: #888;
    font-style: italic;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    width: 500px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .modal-title {
    font-size: 1.8em;
    margin-bottom: 20px;
    color: #333;
  }
  
  .modal-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  
  .input-field {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .submit-btn {
    background-color: #28a745;
    color: white;
  }
  
  .submit-btn:hover {
    background-color: #218838;
  }
  
  .close-btn {
    background-color: #6c757d;
    color: white;
  }
  
  .close-btn:hover {
    background-color: #5a6268;
  }
  </style>
  