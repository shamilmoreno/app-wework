import { Router } from "express";
import { checkJwt } from "../../core/middlewares/check-jwt";
import { checkPermission } from "../../core/middlewares/check-permission";
import { ProviderController } from "./provider.controller";

export class ProviderRoutes {
	public router: Router = Router();
	private pc = new ProviderController();

	constructor() {
		// Customer
		this.router.get("/", checkJwt, checkPermission("provider:view"), this.pc.ctrlList);
		this.router.post("/", checkJwt, checkPermission("provider:create"), this.pc.ctrlCreate);
		this.router.put("/", checkJwt, checkPermission("provider:edit"), this.pc.ctrlUpdate);
		this.router.get("/:id([0-9]+)", checkJwt, checkPermission("provider:view"), this.pc.ctrlGetOne);
		this.router.get("/:id([0-9]+)/detail", checkJwt, checkPermission("provider:view"), this.pc.ctrlGetOneForDetail);
		// this.router.post('/data-validation', checkJwt, this.pc.ctrlGetOneForDataValidation);
		this.router.delete("/:id([0-9]+)", checkJwt, checkPermission("provider:delete"), this.pc.ctrlRemove);
		this.router.put("/identification-card", checkJwt, checkPermission("provider:edit"), this.pc.ctrlAddIdentificationCard);
	}
}
