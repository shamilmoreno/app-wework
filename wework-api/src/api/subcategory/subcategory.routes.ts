import { Router } from "express";
import { checkJwt } from "../../core/middlewares/check-jwt";
import { checkPermission } from "../../core/middlewares/check-permission";
import { SubcategoryController } from "./subcategory.controller";

export class SubcategoryRoutes {
	public router: Router = Router();
	private sc = new SubcategoryController();

	constructor() {
		this.router.post("/", checkJwt, checkPermission("category:create"), this.sc.ctrlCreate);
		this.router.put("/", checkJwt, checkPermission("category:edit"), this.sc.ctrlUpdate);
		this.router.delete("/:id([0-9]+)", checkJwt, checkPermission("category:delete"), this.sc.ctrlRemove);
	}
}
