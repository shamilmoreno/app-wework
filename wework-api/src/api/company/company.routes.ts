import { Router } from "express";
import { checkJwt } from "../../core/middlewares/check-jwt";
import { checkPermission } from "../../core/middlewares/check-permission";
import { CompanyController } from "./company.controller";

export class CompanyRoutes {
	public router: Router = Router();
	private cc = new CompanyController();

	constructor() {
		this.router.get("/", checkJwt, checkPermission("company:view"), this.cc.ctrlList);
		this.router.post("/", checkJwt, checkPermission("company:create"), this.cc.ctrlCreate);
		this.router.put("/", checkJwt, checkPermission("company:edit"), this.cc.ctrlUpdate);
		this.router.get("/:id([0-9]+)", checkJwt, checkPermission("company:view"), this.cc.ctrlGetOne);
		this.router.delete("/:id([0-9]+)", checkJwt, checkPermission("company:delete"), this.cc.ctrlRemove);
	}
}
