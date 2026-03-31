import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await categoryService.getCategories(req.user!.userId, req.query.type as string | undefined);
    res.json({ data });
  } catch (err) { next(err); }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await categoryService.createCategory(req.user!.userId, req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await categoryService.updateCategory(req.user!.userId, Number(req.params.id), req.body);
    res.json({ data });
  } catch (err) { next(err); }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    await categoryService.deleteCategory(req.user!.userId, Number(req.params.id));
    res.sendStatus(204);
  } catch (err) { next(err); }
}
