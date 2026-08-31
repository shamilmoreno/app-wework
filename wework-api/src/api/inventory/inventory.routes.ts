import { Router } from "express";
import { checkJwt } from "../../core/middlewares/check-jwt";
import { checkPermission } from "../../core/middlewares/check-permission";
import { checkWarehouse } from "../../core/middlewares/check-warehouse";
import { InventoryStockController } from "./inventory-stock.controller";
import { InventoryMovementController } from "./inventory-movement.controller";

export class InventoryRoutes {
	public router: Router = Router();
	private ic = new InventoryStockController();
	private imc = new InventoryMovementController();

	constructor() {
		this.router.get("/", checkJwt, checkPermission("inventory:view"), checkWarehouse, this.ic.ctrlList);
		this.router.put("/", checkJwt, checkPermission("inventory:edit"), checkWarehouse, this.ic.ctrlUpdate);
		this.router.get("/:id([0-9]+)", checkJwt, checkPermission("inventory:view"), checkWarehouse, this.ic.ctrlGetOne);
		this.router.get("/:id([0-9]+)/detail", checkJwt, checkPermission("inventory:view"), checkWarehouse, this.ic.ctrlGetOneForDetail);
		this.router.delete("/:id([0-9]+)", checkJwt, checkPermission("inventory:edit"), checkWarehouse, this.ic.ctrlRemove);

		// ROUTE INVENTORY MOVEMENTS
		this.router.get("/movements", checkJwt, checkPermission("inventory:view"), checkWarehouse, this.imc.ctrlList);
		this.router.post("/movement", checkJwt, checkPermission("inventory:create_movement"), checkWarehouse, this.imc.ctrlCreate);
		this.router.get("/:id([0-9]+)/movements", checkJwt, checkPermission("inventory:view"), checkWarehouse, this.imc.ctrlGetOneForDetail);
	}
}
