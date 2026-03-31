import { Router } from 'express';
import * as ctrl from '../controllers/currency.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', ctrl.getCurrencies);
router.get('/rate', ctrl.getExchangeRate);

export default router;
