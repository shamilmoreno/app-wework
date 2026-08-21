import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { ProviderController } from './provider.controller';

export class ProviderRoutes {
  public router: Router = Router();
  private pc = new ProviderController();

  constructor() {
    // Customer
    this.router.get('/', checkJwt, this.pc.ctrlList);
    this.router.post('/', checkJwt, this.pc.ctrlCreate);
    this.router.put('/', checkJwt, this.pc.ctrlUpdate);
    this.router.get('/:id([0-9]+)', checkJwt, this.pc.ctrlGetOne);
    this.router.get('/:id([0-9]+)/detail', checkJwt, this.pc.ctrlGetOneForDetail);
   // this.router.post('/data-validation', checkJwt, this.pc.ctrlGetOneForDataValidation);
    this.router.delete('/:id([0-9]+)', checkJwt, this.pc.ctrlRemove);
    this.router.put('/identification-card', checkJwt, this.pc.ctrlAddIdentificationCard);
  }
}
