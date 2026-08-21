import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { ProductController } from './product.controller';

export class ProductRoutes {
  public router: Router = Router();
  private pc = new ProductController();


  constructor() {
    this.router.get('/', checkJwt, this.pc.ctrlList);
    this.router.post('/', checkJwt, this.pc.ctrlCreate);
    this.router.put('/', checkJwt, this.pc.ctrlUpdate);
    this.router.get('/:id([0-9]+)', checkJwt, this.pc.ctrlGetOne);
    this.router.get('/:id([0-9]+)/detail', checkJwt, this.pc.ctrlGetOneForDetail);
    this.router.delete('/:id([0-9]+)', checkJwt, this.pc.ctrlRemove);
  }
}
