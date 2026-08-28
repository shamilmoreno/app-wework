import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { ExchangeRateController } from './exchange-rate.controller';

export class ExchangeRateRoutes {
  public router: Router = Router();
  private ec = new ExchangeRateController();

  constructor() {
    this.router.get('/', checkJwt, this.ec.ctrlList);
    this.router.post('/', checkJwt, this.ec.ctrlCreate);
    this.router.put('/', checkJwt, this.ec.ctrlUpdate);
    this.router.get('/:id([0-9]+)', checkJwt, this.ec.ctrlGetOne);
    this.router.delete('/:id([0-9]+)', checkJwt, this.ec.ctrlRemove);
  }
}