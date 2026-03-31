import { Router } from 'express';
import * as ctrl from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/summary', ctrl.getSummary);
router.get('/trends', ctrl.getTrends);
router.get('/by-category', ctrl.getCategoryBreakdown);
router.get('/budget-status', ctrl.getBudgetStatus);

export default router;
