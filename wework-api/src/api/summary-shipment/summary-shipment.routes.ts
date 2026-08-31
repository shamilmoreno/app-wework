import { Router } from "express";
import { checkJwt } from "../../core/middlewares/check-jwt";
import { checkPermission } from "../../core/middlewares/check-permission";
import { SummaryShipmentController } from "./summary-shipment.controller";

export class SummaryShipmentRoutes {
	public router: Router = Router();
	private sc = new SummaryShipmentController();

	constructor() {
		this.router.get("/:filter([0-9]+)", checkJwt, checkPermission("shipment:view_totals"), this.sc.ctrlDataControl);
	}
}
