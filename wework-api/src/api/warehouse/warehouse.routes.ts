import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { WareHouseController } from './warehouse.controller';

export class WareHouseRoutes {
  public router: Router = Router();
  private wc = new WareHouseController();

  constructor() {
    this.router.get('/', checkJwt, this.wc.ctrlList);
    this.router.post('/', checkJwt, this.wc.ctrlCreate);
    this.router.put('/', checkJwt, this.wc.ctrlUpdate);
    this.router.get('/:id([0-9]+)', checkJwt, this.wc.ctrlGetOne);
    this.router.delete('/:id([0-9]+)', checkJwt, this.wc.ctrlRemove);
  }
}
