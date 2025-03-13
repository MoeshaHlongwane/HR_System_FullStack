<template>
  <!--NavBar  From Bootstrap -->
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link to='/employees' class="nav-link" href="#">Employees Details</router-link>
        </li>
        <li class="nav-item">
          <router-link to='/reviews' class="nav-link" href="#">Review Performance</router-link>
        </li>
        <li class="nav-item">
          <router-link to='/attendance' class="nav-link" href="#">Track Attendance</router-link>
        </li>
        <li class="nav-item">
          <router-link to='/leaveRequests' class="nav-link" href="#">Leave Requests</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/payroll" class="nav-link" href="#">Payroll</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/" class="nav-link active" aria-current="page" href="#">Log out</router-link>
        </li>
      </ul>
    </div>
  </div>
  <a to="/" class="navbar-brand" href="#">
     Modern Tech Solutions
    </a>
  <img :src="logo" alt="Logo" width="40" height="40" class="d-inline-block align-text-top">
</nav>
</template>
<script>
export default {
  data() {
    return {
      logo: require("../assets/logo.jpg"),
    };
  },
};
</script>
<style scoped>
/* Navbar Styling */
.navbar {
  background-color: rgb(60, 60, 138) !important;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
 
}
.logo {
  height: 50px;
  width: 60px;
  object-fit: cover;
  border-radius: 100%;
 
}
.brand-name {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
}
.navbar-nav .nav-link {
  font-size: 20px;
  margin: 0 0.5rem;
  transition: color 0.2s ease;
}
.navbar-brand{
  color: white;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

}
.navbar.navbar-light {
  background-color: rgb(18, 18, 199) !important;
}
.navbar-nav .nav-link {
  font-size: 20px;
  margin: 0 0.5rem;
  transition: color 0.2s ease;
  color: white;

}
.navbar-nav .nav-link:hover {
  color: black !important;
}
.navbar-nav .nav-link:hover {
  color: #1770CF;
}
li{
  text-align: center;
  color: white 
}
.navbar navbar-expand-lg bg-body-tertiary{
  color: blue;
}

</style>






