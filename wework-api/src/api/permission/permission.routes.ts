import { Router } from "express";
import { checkJwt } from "../../core/middlewares/check-jwt";
import { checkPermission } from "../../core/middlewares/check-permission";
import { PermissionController } from "./permission.controller";

export class PermissionRoutes {
	public router: Router = Router();
	private pc = new PermissionController();

	constructor() {
		this.router.get("/", checkJwt, checkPermission("role:view"), this.pc.ctrlList);
		this.router.get("/:id([0-9]+)", checkJwt, checkPermission("role:view"), this.pc.ctrlGetOne);
	}
}
