import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { SubcategoryController } from './subcategory.controller';

export class SubcategoryRoutes {
  public router: Router = Router();
  private sc = new SubcategoryController();

  constructor() {
    this.router.post('/', checkJwt, this.sc.ctrlCreate);
    this.router.put('/', checkJwt, this.sc.ctrlUpdate);
    this.router.delete('/:id([0-9]+)', checkJwt, this.sc.ctrlRemove);
  }
}
