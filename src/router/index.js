import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PayrollView from '@/views/PayrollView.vue';

import AttendanceView from '@/views/AttendanceView.vue';
import LeaveRequestViwe from '@/views/LeaveRequestViwe.vue';
import EmployeesDetailsView from '@/views/EmployeesDetailsView.vue';
import ReviewsView from '@/views/reviewsView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/employees', name: 'Employees', component: EmployeesDetailsView },
  { path: '/attendance', name: 'Attendance', component: AttendanceView },
  { path: '/leaveRequests', name: 'LeaveRequests', component: LeaveRequestViwe },
  { path: '/payroll', name: 'Payroll', component: PayrollView },
  { path: '/reviews', name: 'Reviews', component: ReviewsView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

