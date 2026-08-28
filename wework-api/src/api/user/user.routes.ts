import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { UserController } from './user.controller';
import { UserRoleController } from './user.role.controller';

export class UserRoutes {
  public router: Router = Router();
  private uc = new UserController();
  private rc = new UserRoleController();

  constructor() {
    this.router.get('/', checkJwt, this.uc.ctrlList);
    this.router.get('/:id([0-9]+)', checkJwt, this.uc.ctrlGetOne);
    this.router.post('/', checkJwt, this.uc.ctrlCreate);
    this.router.put('/', checkJwt, this.uc.ctrlUpdate); 
    this.router.get('/:id([0-9]+)/detail', checkJwt, this.uc.ctrlGetOneForDetail);

    // User Roles
    this.router.get('/:id([0-9]+)/roles', checkJwt, this.rc.ctrlListByUserId);
    this.router.post('/roles', checkJwt, this.rc.ctrlCreateOrUpdate);
    this.router.delete('/:id([0-9]+)/roles', checkJwt, this.rc.ctrlRemove);
  }
}
