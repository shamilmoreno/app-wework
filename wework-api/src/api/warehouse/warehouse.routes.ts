import { Router } from "express";
import { checkJwt } from "../../core/middlewares/check-jwt";
import { checkPermission } from "../../core/middlewares/check-permission";
import { checkWarehouse } from "../../core/middlewares/check-warehouse";
import { WareHouseController } from "./warehouse.controller";

export class WareHouseRoutes {
	public router: Router = Router();
	private wc = new WareHouseController();

	constructor() {
		this.router.get("/", checkJwt, checkPermission("warehouse:view"), checkWarehouse, this.wc.ctrlList);
		this.router.post("/", checkJwt, checkPermission("warehouse:create"), this.wc.ctrlCreate);
		this.router.put("/", checkJwt, checkPermission("warehouse:edit"), this.wc.ctrlUpdate);
		this.router.get("/:id([0-9]+)", checkJwt, checkPermission("warehouse:view"), checkWarehouse, this.wc.ctrlGetOne);
		this.router.delete("/:id([0-9]+)", checkJwt, checkPermission("warehouse:delete"), this.wc.ctrlRemove);
	}
}
