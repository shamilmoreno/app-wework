import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { InventoryStockController } from './inventory-stock.controller';
import { InventoryMovementController } from './inventory-movement.controller';

export class InventoryRoutes {
  public router: Router = Router();
  private ic = new InventoryStockController();
  private imc = new InventoryMovementController();

  constructor() {
    this.router.get('/', checkJwt, this.ic.ctrlList);
    this.router.put('/', checkJwt, this.ic.ctrlUpdate);
    this.router.get('/:id([0-9]+)', checkJwt, this.ic.ctrlGetOne);
    this.router.get('/:id([0-9]+)/detail', checkJwt, this.ic.ctrlGetOneForDetail);
    this.router.delete('/:id([0-9]+)', checkJwt, this.ic.ctrlRemove);
    
    // ROUTE INVENTORY MOVEMENTS
    this.router.get('/', checkJwt, this.imc.ctrlList);
    this.router.post('/movement', checkJwt, this.imc.ctrlCreate);
    this.router.get('/:id([0-9]+)/movements', checkJwt, this.imc.ctrlGetOneForDetail);
  }
}
