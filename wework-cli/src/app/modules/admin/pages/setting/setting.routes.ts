import { Routes } from "@angular/router";

export const SETTING_ROUTES: Routes = [
	{
		path: "",
		redirectTo: "system-value",
		pathMatch: "full",
	},
	{
		path: "system-value",
		children: [
			{
				path: "",
				redirectTo: "index",
				pathMatch: "full",
			},
			{
				path: "index",
				loadComponent: () =>
					import("./system-value/system-value-index/system-value-index.component").then((m) => m.SystemValueIndexComponent),
			},
			{
				path: "list",
				loadComponent: () => import("./system-value/system-value-list/system-value-list.component").then((m) => m.SystemValueListComponent),
			},
			{
				path: "manage",
				loadComponent: () =>
					import("./system-value/system-value-manage/system-value-manage.component").then((m) => m.SystemValueManageComponent),
			},
		],
	},
	{
		path: "user",
		children: [
			{
				path: "",
				redirectTo: "list",
				pathMatch: "full",
			},
			{
				path: "list",
				loadComponent: () => import("./user/containers/user-index/user-index.component").then((m) => m.UserIndexComponent),
			},
			// Si tienes más rutas dentro de user (como 'profile' o 'add'), agrégalas aquí siguiendo el mismo patrón
		],
	},
	{
		path: "role",
		children: [
			{
				path: "",
				redirectTo: "list",
				pathMatch: "full",
			},
			{
				path: "list",
				loadComponent: () => import("./role/containers/role-index/role-index.component").then((m) => m.RoleIndexComponent),
			},
		],
	},
];
