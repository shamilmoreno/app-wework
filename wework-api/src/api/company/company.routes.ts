import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { CompanyController } from './company.controller';

export class CompanyRoutes {
  public router: Router = Router();
  private cc = new CompanyController();

  constructor() {
    this.router.get('/', checkJwt, this.cc.ctrlList);
    this.router.post('/', checkJwt, this.cc.ctrlCreate);
    this.router.put('/', checkJwt, this.cc.ctrlUpdate);
    this.router.get('/:id([0-9]+)', checkJwt, this.cc.ctrlGetOne);
    this.router.delete('/:id([0-9]+)', checkJwt, this.cc.ctrlRemove);
  }
}
