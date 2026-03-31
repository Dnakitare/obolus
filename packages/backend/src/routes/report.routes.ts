import { Router } from 'express';
import * as ctrl from '../controllers/report.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { taxSummarySchema, exportQuerySchema } from '../schemas/report.schema';

const router = Router();

router.use(authenticate);
router.get('/tax-summary', validate({ query: taxSummarySchema }), ctrl.getTaxSummary);
router.get('/export/csv', validate({ query: exportQuerySchema }), ctrl.exportCSV);
router.get('/export/pdf', validate({ query: exportQuerySchema }), ctrl.exportPDF);

export default router;
