import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { BagRecipeController } from './bag-recipe.controller';
import { BagRecipeMaquiladorController } from "./bag-recipe-maquilador.controller";
import { BagRecipeProductController } from './bag-recipe-products.controller';
import { BagRecipePaymentController } from './bag-recipe-payments.controller';
import { SummaryBagRecipeController } from './summary-bag-recipe.controller';

export class BagRecipeDataRoutes {
  public router: Router = Router();
  private brc = new BagRecipeController();
  private brmc = new BagRecipeMaquiladorController();
  private brpc = new BagRecipeProductController();
  private bpc = new BagRecipePaymentController();
  private sbpc = new SummaryBagRecipeController();

  constructor() {
    this.router.get('/', checkJwt, this.brc.ctrlList);
    this.router.post('/', checkJwt, this.brc.ctrlCreate);
    this.router.put('/', checkJwt, this.brc.ctrlUpdate);
    this.router.patch('/', checkJwt, this.brc.ctrlSetInactive);
    this.router.get('/:id([0-9]+)', checkJwt, this.brc.ctrlGetOne);
    this.router.get('/:id([0-9]+)/detail', checkJwt, this.brc.ctrlGetOneForDetail);
    this.router.delete('/:id([0-9]+)', checkJwt, this.brc.ctrlRemove);

    // Bag Recipe Maquiladors
    this.router.get('/:id([0-9]+)/maquiladors', checkJwt, this.brmc.ctrlListByBagRecipetId);
    this.router.post('/maquiladors', checkJwt, this.brmc.ctrlCreateOrUpdate);
    this.router.delete('/:id([0-9]+)/maquiladors', checkJwt, this.brmc.ctrlRemove);

    // Bag Recipe Products
    this.router.get('/:id([0-9]+)/products', checkJwt, this.brpc.ctrlListByBagRecipetId);
    this.router.post('/products', checkJwt, this.brpc.ctrlCreateOrUpdate);

    // Bag Recipe Payments
    this.router.get('/:id([0-9]+)/payments', checkJwt, this.bpc.ctrlListByBagRecipetId);
    this.router.post('/payments', checkJwt, this.bpc.ctrlCreateOrUpdate);
    this.router.delete('/:id([0-9]+)/payments', checkJwt, this.bpc.ctrlRemove);

    // Bag Recipe Summary
    this.router.get('/summary/:filter([0-9]+)', checkJwt, this.sbpc.ctrlDataControl);
    this.router.get('/summary/:date(\\d{2}/\\d{4})', checkJwt, this.sbpc.ctrlListByBagRecipeSpecificMonth);
  }
}
