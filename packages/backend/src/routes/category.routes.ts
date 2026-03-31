import { Router } from 'express';
import * as ctrl from '../controllers/category.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createCategorySchema, updateCategorySchema, categoryQuerySchema } from '../schemas/category.schema';
import { idParamSchema } from '../schemas/common.schema';

const router = Router();

router.use(authenticate);
router.get('/', validate({ query: categoryQuerySchema }), ctrl.getCategories);
router.post('/', validate({ body: createCategorySchema }), ctrl.createCategory);
router.patch('/:id', validate({ params: idParamSchema, body: updateCategorySchema }), ctrl.updateCategory);
router.delete('/:id', validate({ params: idParamSchema }), ctrl.deleteCategory);

export default router;
