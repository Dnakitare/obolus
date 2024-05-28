import { createRouter, createWebHistory } from 'vue-router';
import RegistrationForm from '../components/RegistrationForm.vue';
import LoginForm from '../components/LoginForm.vue';
import UserDashboard from '../components/UserDashboard.vue';

const routes = [
  { path: '/register', component: RegistrationForm },
  { path: '/login', component: LoginForm },
  { path: '/dashboard', component: UserDashboard },
  { path: '/', redirect: '/dashboard' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
});

export default router;