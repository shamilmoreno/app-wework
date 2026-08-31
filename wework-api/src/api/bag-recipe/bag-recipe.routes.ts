import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { checkPermission } from '../../core/middlewares/check-permission';
import { checkWarehouse } from '../../core/middlewares/check-warehouse';
import { BagRecipeController } from './bag-recipe.controller';
import { BagRecipeMaquiladorController } from './bag-recipe-maquilador.controller';
import { BagRecipeItemController } from './bag-recipe-items.controller';
import { BagRecipePaymentController } from './bag-recipe-payments.controller';
import { SummaryBagRecipeController } from './summary-bag-recipe.controller';

export class BagRecipeDataRoutes {
  public router: Router = Router();
  private brc = new BagRecipeController();
  private brmc = new BagRecipeMaquiladorController();
  private brpc = new BagRecipeItemController();
  private bpc = new BagRecipePaymentController();
  private sbpc = new SummaryBagRecipeController();

  constructor() {
    this.router.get('/', checkJwt, checkPermission('bag_recipe:view'), checkWarehouse, this.brc.ctrlList);
    this.router.post('/', checkJwt, checkPermission('bag_recipe:create'), this.brc.ctrlCreate);
    this.router.put('/', checkJwt, checkPermission('bag_recipe:edit'), this.brc.ctrlUpdate);
    this.router.patch('/', checkJwt, checkPermission('bag_recipe:edit'), this.brc.ctrlSetInactive);
    this.router.get('/:id([0-9]+)', checkJwt, checkPermission('bag_recipe:view'), this.brc.ctrlGetOne);
    this.router.get('/:id([0-9]+)/detail', checkJwt, checkPermission('bag_recipe:view'), checkWarehouse, this.brc.ctrlGetOneForDetail);
    this.router.delete('/:id([0-9]+)', checkJwt, checkPermission('bag_recipe:delete'), this.brc.ctrlRemove);

    // Bag Recipe Maquiladores
    this.router.get('/:id([0-9]+)/maquiladores', checkJwt, checkPermission('bag_recipe:view'), checkWarehouse, this.brmc.ctrlListByBagRecipetId);
    this.router.post('/maquiladores', checkJwt, checkPermission('bag_recipe:edit'), this.brmc.ctrlCreateOrUpdate);
    this.router.delete('/:id([0-9]+)/maquiladores', checkJwt, checkPermission('bag_recipe:delete'), this.brmc.ctrlRemove);

    // Bag Recipe Items
    this.router.get('/:id([0-9]+)/items', checkJwt, checkPermission('bag_recipe:view'), checkWarehouse, this.brpc.ctrlListByBagRecipetId);
    this.router.post('/items', checkJwt, checkPermission('bag_recipe:edit'), this.brpc.ctrlCreateOrUpdate);

    // Bag Recipe Payments
    this.router.get('/:id([0-9]+)/payments', checkJwt, checkPermission('bag_recipe:view'), checkWarehouse, this.bpc.ctrlListByBagRecipetId);
    this.router.post('/payments', checkJwt, checkPermission('bag_recipe:edit'), this.bpc.ctrlCreateOrUpdate);
    this.router.delete('/:id([0-9]+)/payments', checkJwt, checkPermission('bag_recipe:delete'), this.bpc.ctrlRemove);

    // Bag Recipe Summary
    this.router.get('/summary/:filter([a-zA-Z0-9_.-]+)', checkJwt, checkPermission('bag_recipe:view'), checkWarehouse, this.sbpc.ctrlDataControl);
    this.router.get('/summary/:date(\\d{2}/\\d{4})', checkJwt, checkPermission('bag_recipe:view'), checkWarehouse, this.sbpc.ctrlListByBagRecipeSpecificMonth);
  }
}