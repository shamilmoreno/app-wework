import { Router } from "express";
import { checkJwt } from "../../core/middlewares/check-jwt";
import { checkPermission } from "../../core/middlewares/check-permission";
import { UserController } from "./user.controller";
import { UserRoleController } from "./user.role.controller";

export class UserRoutes {
	public router: Router = Router();
	private uc = new UserController();
	private rc = new UserRoleController();

	constructor() {
		this.router.get("/", checkJwt, checkPermission("user:view"), this.uc.ctrlList);
		this.router.get("/:id([0-9]+)", checkJwt, checkPermission("user:view"), this.uc.ctrlGetOne);
		this.router.post("/", checkJwt, checkPermission("user:create"), this.uc.ctrlCreate);
		this.router.put("/", checkJwt, checkPermission("user:edit"), this.uc.ctrlUpdate);
		this.router.get("/:id([0-9]+)/detail", checkJwt, checkPermission("user:view"), this.uc.ctrlGetOneForDetail);

		// User Roles
		this.router.get("/:id([0-9]+)/roles", checkJwt, checkPermission("user:view"), this.rc.ctrlListByUserId);
		this.router.post("/roles", checkJwt, checkPermission("user:edit"), this.rc.ctrlCreateOrUpdate);
		this.router.delete("/:id([0-9]+)/roles", checkJwt, checkPermission("user:edit"), this.rc.ctrlRemove);
	}
}
