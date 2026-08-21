import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { NotificationController } from './notification.controller';

export class NotificationRoutes {
  public router: Router = Router();
  private nc = new NotificationController();

  constructor() {
    this.router.get('/', checkJwt, this.nc.ctrlList);
    this.router.get('/unreads', checkJwt, this.nc.ctrlListUnreads);
    //this.router.patch('/mark-like-to-read', checkJwt, this.nc.ctrlMarkLikeToRead);
    this.router.patch('/mark-all-like-to-read', checkJwt, this.nc.ctrlMarkAllLikeToRead);
  }
}
