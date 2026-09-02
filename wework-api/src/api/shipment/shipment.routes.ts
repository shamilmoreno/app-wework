import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { checkPermission } from '../../core/middlewares/check-permission';
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
        this.router.get('/', checkJwt, checkPermission('shipment:view'), this.sc.ctrlList);
        this.router.get('/pending', checkJwt, checkPermission('shipment:view'), this.sc.ctrlListPendingShipments);
        this.router.get('/:id([0-9]+)', checkJwt, checkPermission('shipment:view'), this.sc.ctrlGetOne);
        this.router.get('/:id([0-9]+)/detail', checkJwt, checkPermission('shipment:view'), this.sc.ctrlGetOneForDetail);
        this.router.get('/filter-date', checkJwt, checkPermission('shipment:view'), this.sc.ctrlFilterDataControl);
        this.router.post('/', checkJwt, checkPermission('shipment:create'), this.sc.ctrlCreate);
        this.router.put('/', checkJwt, checkPermission('shipment:edit'), this.sc.ctrlUpdate);
        this.router.delete('/:id([0-9]+)', checkJwt, checkPermission('shipment:delete'), this.sc.ctrlRemove);

        // Shipment Observations (no es data financiera, permisos normales)
        this.router.get('/:id([0-9]+)/observations', checkJwt, checkPermission('shipment:view'), this.soc.ctrlListByShipmentId);
        this.router.post('/observations', checkJwt, checkPermission('shipment:edit'), this.soc.ctrlCreateOrUpdate);
        this.router.delete('/:id([0-9]+)/observations', checkJwt, checkPermission('shipment:delete'), this.soc.ctrlRemove);

        // Shipment administrative expenses (DATA FINANCIERA - requiere permiso especial)
        this.router.get('/:id([0-9]+)/expenses-administrative', checkJwt, checkPermission('shipment:view_admin_expense'), this.saec.ctrlListByShipmentId);
        this.router.post('/expenses-administrative', checkJwt, checkPermission('shipment:edit'), checkPermission('shipment:view_admin_expense'), this.saec.ctrlCreateOrUpdate);
        this.router.delete('/:id([0-9]+)/expenses-administrative', checkJwt, checkPermission('shipment:delete'), checkPermission('shipment:view_admin_expense'), this.saec.ctrlRemove);

        // Shipment nationalization expenses (DATA FINANCIERA - requiere permiso especial)
        this.router.get('/:id([0-9]+)/expenses-nationalization', checkJwt, checkPermission('shipment:view_nationalization_expense'), this.snec.ctrlListByShipmentId);
        this.router.post('/expenses-nationalization', checkJwt, checkPermission('shipment:edit'), checkPermission('shipment:view_nationalization_expense'), this.snec.ctrlCreateOrUpdate);
        this.router.delete('/:id([0-9]+)/expenses-nationalization', checkJwt, checkPermission('shipment:delete'), checkPermission('shipment:view_nationalization_expense'), this.snec.ctrlRemove);

        // Shipment Legal Regimes (no es data financiera, permisos normales)
        this.router.get('/:id([0-9]+)/legal-regimes', checkJwt, checkPermission('shipment:view'), this.src.ctrlListByShipmentId);
        this.router.post('/legal-regimes', checkJwt, checkPermission('shipment:edit'), this.src.ctrlCreateOrUpdate);
        this.router.delete('/:id([0-9]+)/legal-regimes', checkJwt, checkPermission('shipment:delete'), this.src.ctrlRemove);

        // Shipment Summary (totales monetarios - requiere permiso especial)
        this.router.get('/summary/:filter([0-9]+)', checkJwt, checkPermission('shipment:view_totals'), this.ssc.ctrlDataControl);
        this.router.get('/summary/:date(\\d{2}/\\d{4})', checkJwt, checkPermission('shipment:view_totals'), this.ssc.ctrlListShipmentSpecificMonth);
    }
}