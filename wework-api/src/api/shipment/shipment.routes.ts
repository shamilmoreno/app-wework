import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { ShipmentController } from './shipment.controller';
import { ShipmentObservationController } from './shipment-observation.controller';
import { ShipmentAdministrativeExpensesController } from './shipment-administrative-expenses.controller';
import { ShipmentNationalizationExpensesController } from './shipment-nationalization-expenses.controller';
import { ShipmentRegimeController } from './shipment-regimen.controller';
import { SummaryShipmentController } from './summary-shipment.controller';

export class ShipmentDataRoutes {
    public router: Router = Router();
    private sc = new ShipmentController();
    private soc = new ShipmentObservationController();
    private saec = new ShipmentAdministrativeExpensesController();
    private snec = new ShipmentNationalizationExpensesController();
    private src = new ShipmentRegimeController();
    private ssc = new SummaryShipmentController();

    constructor() {
        this.router.get('/', checkJwt, this.sc.ctrlList);
        this.router.get('/pending', checkJwt, this.sc.ctrlListPendingShipments);
        this.router.get('/:id([0-9]+)', checkJwt, this.sc.ctrlGetOne);
        this.router.get('/:id([0-9]+)/detail', checkJwt, this.sc.ctrlGetOneForDetail);
        this.router.get('/filter-date', checkJwt, this.sc.ctrlFilterDataControl);
        this.router.post('/', checkJwt, this.sc.ctrlCreate);
        this.router.put('/', checkJwt, this.sc.ctrlUpdate);
        this.router.delete('/:id([0-9]+)', checkJwt, this.sc.ctrlRemove);

        // Shipment Observations
        this.router.get('/:id([0-9]+)/observations', checkJwt, this.soc.ctrlListByShipmentId);
        this.router.post('/observations', checkJwt, this.soc.ctrlCreateOrUpdate);
        this.router.delete('/:id([0-9]+)/observations', checkJwt, this.soc.ctrlRemove);

        // Shipment administratives expenses
        this.router.get('/:id([0-9]+)/expenses-administrative', checkJwt, this.saec.ctrlListByShipmentId);
        this.router.post('/expenses-administrative', checkJwt, this.saec.ctrlCreateOrUpdate);
        this.router.delete('/:id([0-9]+)/expenses-administrative', checkJwt, this.saec.ctrlRemove);

        // Shipment nationalization expenses
        this.router.get('/:id([0-9]+)/expenses-nationalization', checkJwt, this.snec.ctrlListByShipmentId);
        this.router.post('/expenses-nationalization', checkJwt, this.snec.ctrlCreateOrUpdate);
        this.router.delete('/:id([0-9]+)/expenses-nationalization', checkJwt, this.snec.ctrlRemove);

        // Shipment Legal Regimes
        this.router.get('/:id([0-9]+)/legal-regimes', checkJwt, this.src.ctrlListByShipmentId);
        this.router.post('/legal-regimes', checkJwt, this.src.ctrlCreateOrUpdate);
        this.router.delete('/:id([0-9]+)/legal-regimes', checkJwt, this.src.ctrlRemove);

        // Shipment Summary
        this.router.get('/summary/:filter([0-9]+)', checkJwt, this.ssc.ctrlDataControl);
        this.router.get('/summary/:date(\\d{2}/\\d{4})', checkJwt, this.ssc.ctrlListShipmentSpecificMonth);
    }
}
