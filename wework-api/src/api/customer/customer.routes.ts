import { Router } from "express";
import { checkJwt } from "../../core/middlewares/check-jwt";
import { checkPermission } from "../../core/middlewares/check-permission";
import { CustomerController } from "./customer.controller";

export class CustomerRoutes {
	public router: Router = Router();
	private cc = new CustomerController();

	constructor() {
		// Customer
		this.router.get("/", checkJwt, checkPermission("customer:view"), this.cc.ctrlList);
		this.router.post("/", checkJwt, checkPermission("customer:create"), this.cc.ctrlCreate);
		this.router.put("/", checkJwt, checkPermission("customer:edit"), this.cc.ctrlUpdate);
		this.router.get("/:id([0-9]+)", checkJwt, checkPermission("customer:view"), this.cc.ctrlGetOne);
		this.router.get("/:id([0-9]+)/detail", checkJwt, checkPermission("customer:view"), this.cc.ctrlGetOneForDetail);
		this.router.post("/data-validation", checkJwt, checkPermission("customer:view"), this.cc.ctrlGetOneForDataValidation);
		this.router.delete("/:id([0-9]+)", checkJwt, checkPermission("customer:delete"), this.cc.ctrlRemove);
		this.router.put("/identification-card", checkJwt, checkPermission("customer:edit"), this.cc.ctrlAddIdentificationCard);
	}
}
