import { Router } from 'express';
import * as ctrl from '../controllers/receipt.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticate);
router.post('/:transactionId/receipt', upload.single('file'), ctrl.uploadReceipt);
router.get('/:transactionId/receipt', ctrl.getReceipt);
router.delete('/:transactionId/receipt', ctrl.deleteReceipt);

export default router;
