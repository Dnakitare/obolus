import { Router } from 'express';
import * as ctrl from '../controllers/recurring.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createRecurringSchema, updateRecurringSchema } from '../schemas/recurring.schema';
import { idParamSchema } from '../schemas/common.schema';

const router = Router();

router.use(authenticate);
router.get('/', ctrl.getRules);
router.post('/', validate({ body: createRecurringSchema }), ctrl.createRule);
router.post('/process', ctrl.processRules);
router.patch('/:id', validate({ params: idParamSchema, body: updateRecurringSchema }), ctrl.updateRule);
router.delete('/:id', validate({ params: idParamSchema }), ctrl.deleteRule);

export default router;
