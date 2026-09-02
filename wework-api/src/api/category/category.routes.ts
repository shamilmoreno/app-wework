import { Router } from "express";
import { checkJwt } from "../../core/middlewares/check-jwt";
import { checkPermission } from "../../core/middlewares/check-permission";
import { CategoryController } from "./category.controller";

export class CategoryRoutes {
	public router: Router = Router();
	private cc = new CategoryController();

	constructor() {
		this.router.get("/", checkJwt, checkPermission("category:view"), this.cc.ctrlList);
		this.router.get("/:nem([a-z]{3})", checkJwt, checkPermission("category:view"), this.cc.ctrlGetOneByNemWithSubcategories);
	}
}
