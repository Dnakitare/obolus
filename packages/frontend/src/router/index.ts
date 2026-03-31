import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'Login', component: () => import('@/pages/LoginPage.vue'), meta: { guest: true } },
    { path: '/register', name: 'Register', component: () => import('@/pages/RegisterPage.vue'), meta: { guest: true } },
    {
      path: '/',
      component: () => import('@/components/layout/AppShell.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', name: 'Dashboard', component: () => import('@/pages/DashboardPage.vue') },
        { path: 'transactions', name: 'Transactions', component: () => import('@/pages/TransactionsPage.vue') },
        { path: 'budgets', name: 'Budgets', component: () => import('@/pages/BudgetsPage.vue') },
        { path: 'recurring', name: 'Recurring', component: () => import('@/pages/RecurringPage.vue') },
        { path: 'reports', name: 'Reports', component: () => import('@/pages/ReportsPage.vue') },
        { path: 'settings', name: 'Settings', component: () => import('@/pages/SettingsPage.vue') },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem('accessToken');
  if (to.meta.requiresAuth && !token) return '/login';
  if (to.meta.guest && token) return '/dashboard';
});

export default router;
