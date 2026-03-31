import { Router } from 'express';
import * as ctrl from '../controllers/budget.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createBudgetSchema, updateBudgetSchema } from '../schemas/budget.schema';
import { idParamSchema } from '../schemas/common.schema';

const router = Router();

router.use(authenticate);
router.get('/', ctrl.getBudgets);
router.post('/', validate({ body: createBudgetSchema }), ctrl.createBudget);
router.patch('/:id', validate({ params: idParamSchema, body: updateBudgetSchema }), ctrl.updateBudget);
router.delete('/:id', validate({ params: idParamSchema }), ctrl.deleteBudget);

export default router;
