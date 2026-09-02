import { Router } from "express";
import { checkJwt } from "../../core/middlewares/check-jwt";
import { checkPermission } from '../../core/middlewares/check-permission';
import { ProductController } from "./product.controller";

export class ProductRoutes {
	public router: Router = Router();
	private pc = new ProductController();

	constructor() {
		this.router.get("/", checkJwt, checkPermission("product:view"), this.pc.ctrlList);
		this.router.post("/", checkJwt, checkPermission("product:create"), this.pc.ctrlCreate);
		this.router.put("/", checkJwt, checkPermission("product:edit"), this.pc.ctrlUpdate);
		this.router.get("/:id([0-9]+)", checkJwt, checkPermission("product:view"), this.pc.ctrlGetOne);
		this.router.get("/:id([0-9]+)/detail", checkJwt, checkPermission("product:view"), this.pc.ctrlGetOneForDetail);
		this.router.delete("/:id([0-9]+)", checkJwt, checkPermission("product:delete"), this.pc.ctrlRemove);
	}
}
