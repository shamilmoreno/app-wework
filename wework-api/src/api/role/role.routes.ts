import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { RoleController } from './role.controller';

export class RoleRoutes {
  public router: Router = Router();
  private rc = new RoleController();

  constructor() {
    // Customer
    this.router.get('/', checkJwt, this.rc.ctrlList);
    this.router.post('/', checkJwt, this.rc.ctrlCreate);
    this.router.put('/', checkJwt, this.rc.ctrlUpdate);
    this.router.get('/:id([0-9]+)', checkJwt, this.rc.ctrlGetOne);
    this.router.get('/:id([0-9]+)/detail', checkJwt, this.rc.ctrlGetOneForDetail);
    this.router.delete('/:id([0-9]+)', checkJwt, this.rc.ctrlRemove);
	this.router.put('/:id([0-9]+)/permissions', checkJwt, checkPermission('role:edit'), this.rc.ctrlSetPermissions);
  }
}
