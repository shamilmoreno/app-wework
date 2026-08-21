import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { EmployeeDataController } from './employee-data.controller';

export class EmployeeDataRoutes {
  public router: Router = Router();
  private edc = new EmployeeDataController();

  constructor() {
    // Patients
    this.router.get('/', checkJwt, this.edc.ctrlList);
    this.router.get('/:id([0-9]+)', checkJwt, this.edc.ctrlGetOne);
    this.router.get('/:id([0-9]+)/detail', checkJwt, this.edc.ctrlGetOneForDetail);
    this.router.post('/', checkJwt, this.edc.ctrlCreate);
    //this.router.post('/data-validation', checkJwt, this.edc.ctrlGetOneForDataValidation);
    this.router.put('/', checkJwt, this.edc.ctrlUpdate);
    this.router.delete('/:id([0-9]+)', checkJwt, this.edc.ctrlRemove);
  }
}
