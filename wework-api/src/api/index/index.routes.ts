import { Router } from 'express';
import { IndexController } from './index.controller';

export class IndexRoutes {
  public router: Router = Router();
  private ic = new IndexController();

  constructor() {
    this.router.get('/', this.ic.welcome);
  }
}
