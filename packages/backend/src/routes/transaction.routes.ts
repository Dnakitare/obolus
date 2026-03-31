import { Router } from 'express';
import * as ctrl from '../controllers/transaction.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createTransactionSchema, updateTransactionSchema, transactionQuerySchema } from '../schemas/transaction.schema';
import { idParamSchema } from '../schemas/common.schema';

const router = Router();

router.use(authenticate);
router.get('/', validate({ query: transactionQuerySchema }), ctrl.getTransactions);
router.get('/:id', validate({ params: idParamSchema }), ctrl.getTransaction);
router.post('/', validate({ body: createTransactionSchema }), ctrl.createTransaction);
router.patch('/:id', validate({ params: idParamSchema, body: updateTransactionSchema }), ctrl.updateTransaction);
router.delete('/:id', validate({ params: idParamSchema }), ctrl.deleteTransaction);

export default router;
