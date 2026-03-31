import { Router } from 'express';
import authRoutes from './auth.routes';
import transactionRoutes from './transaction.routes';
import categoryRoutes from './category.routes';
import budgetRoutes from './budget.routes';
import recurringRoutes from './recurring.routes';
import dashboardRoutes from './dashboard.routes';
import reportRoutes from './report.routes';
import receiptRoutes from './receipt.routes';
import currencyRoutes from './currency.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/transactions', receiptRoutes);
router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);
router.use('/recurring', recurringRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/currencies', currencyRoutes);

export default router;
