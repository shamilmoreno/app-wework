import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { AuthController } from './auth.controller';

export class AuthRoutes {
  public router: Router = Router();
  private ac = new AuthController();

  constructor() {
    this.router.get('/validate/:token', this.ac.ctrlValidateToken);
    this.router.post('/login', this.ac.ctrlLogin);
    this.router.post('/request-change-password', this.ac.ctrlRequestChangePassword);
    this.router.patch('/change-password', checkJwt, this.ac.ctrlChangePassword);
    this.router.delete('/logout', checkJwt, this.ac.ctrlLogout);
  }
}
