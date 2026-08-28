import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { CustomerController } from './customer.controller';

export class CustomerRoutes {
  public router: Router = Router();
  private cc = new CustomerController();

  constructor() {
    // Customer
    this.router.get('/', checkJwt, this.cc.ctrlList);
    this.router.post('/', checkJwt, this.cc.ctrlCreate);
    this.router.put('/', checkJwt, this.cc.ctrlUpdate);
    this.router.get('/:id([0-9]+)', checkJwt, this.cc.ctrlGetOne);
    this.router.get('/:id([0-9]+)/detail', checkJwt, this.cc.ctrlGetOneForDetail);
    this.router.post('/data-validation', checkJwt, this.cc.ctrlGetOneForDataValidation);
    this.router.delete('/:id([0-9]+)', checkJwt, this.cc.ctrlRemove);
    this.router.put('/identification-card', checkJwt, this.cc.ctrlAddIdentificationCard);
  }
}
