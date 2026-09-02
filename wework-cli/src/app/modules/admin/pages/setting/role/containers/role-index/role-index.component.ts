import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

// MODULES
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// MODELS
import { ResponseModel } from '@core/models/response.model';
import { RoleModel } from '@core/models/role.model';
import { PermissionModel } from '@core/models/permission.model';

// SERVICES
import { RoleService } from '@core/services/role.service';
import { PermissionService } from '@core/services/permission.service';

// COMPONENTS
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { RoleManageComponent } from '../../components/role-manage/role-manage.component';
import { RolePermissionsComponent } from '../../components/role-permission/role-permission.component';
import { RoleDeleteComponent } from '../../components/role-delete/role-delete.component';

@Component({
	selector: 'app-role-index',
	standalone: true,
	imports: [
		MatDialogModule,
		RoleListComponent,
		RoleManageComponent,
		RolePermissionsComponent,
		RoleDeleteComponent
	],
	templateUrl: './role-index.component.html',
	styleUrls: ['./role-index.component.scss'],
	providers: [RoleService, PermissionService]
})
export class RoleIndexComponent implements OnInit {
	public roleList: RoleModel[] = [];
	public permissionList: PermissionModel[] = [];
	public role!: RoleModel;
	public searchTittle: string | undefined;
	public columns: Array<any> = [];
	public isTblLoading: boolean | undefined;
	public breadscrums = [
		{
			title: 'Roles y Permisos',
			items: ['Configuración'],
			active: 'Roles y Permisos',
		},
	];

	constructor(
		public dialogService: MatDialog,
		private roleService: RoleService,
		private permissionService: PermissionService,
	) { }

	ngOnInit(): void {
		this.fetchRoleList();
		this.fetchPermissionList();
	}

	public actionCapture(info: any) {
		switch (info.action.name) {
			case 'manage': this.openManageDialog(info); break;
			case 'permissions': this.openPermissionsDialog(info); break;
			case 'delete': this.openDeleteDialog(info.data.row); break;
		}
	}

	public fetchRoleList(): void {
		this.isTblLoading = true;
		this.roleService.list().subscribe({
			next: (rm: ResponseModel) => {
				this.roleList = rm.response;
				this.isTblLoading = false;
				this.searchTittle = 'Filtrar Rol';
			},
			error: err => {
				const error: ResponseModel = err.error;
				Swal.fire({ title: error.message, icon: 'info' });
			},
		});
	}

	public fetchPermissionList(): void {
		this.permissionService.list().subscribe({
			next: (rm: ResponseModel) => {
				this.permissionList = rm.response;
			},
			error: err => {
				const error: ResponseModel = err.error;
				Swal.fire({ title: error.message, icon: 'info' });
			},
		});
	}

	public openManageDialog(info: any) {
		const role = info.data !== undefined ? info.data.row : undefined;
		const roleManage = this.dialogService.open(RoleManageComponent, {
			data: { role }
		});

		roleManage.componentInstance.saveRole.subscribe((data: any) => this.saveChanges(data));
	}

	public openPermissionsDialog(info: any) {
		const role = info.data.row;
		const rolePermissions = this.dialogService.open(RolePermissionsComponent, {
			data: { role, permissionList: this.permissionList },
			width: '600px'
		});

		rolePermissions.componentInstance.savePermissions.subscribe((permissionIds: number[]) => {
			this.roleService.setPermissions(role.id, permissionIds).subscribe({
				next: (rm: ResponseModel) => {
					rolePermissions.close();
					Swal.fire({ title: rm.message, icon: 'success' });
				},
				error: err => {
					const error: ResponseModel = err.error;
					Swal.fire({ title: error.message, icon: 'error' });
				}
			});
		});
	}

	public openDeleteDialog(role: RoleModel) {
		const roleDelete = this.dialogService.open(RoleDeleteComponent, {
			data: { role }
		});

		roleDelete.componentInstance.removeRole.subscribe((roleId: number) => this.remove(roleId));
	}

	public saveChanges(values: any) {
		const request = (values.op === 'update') ? 'update' : 'create';

		this.roleService[request](values.object).subscribe({
			next: (rm: ResponseModel) => {
				this.fetchRoleList();
				Swal.fire({ title: rm.message, icon: 'success' });
			},
			error: err => {
				const error: ResponseModel = err.error;
				Swal.fire({ title: error.message, icon: 'error' });
			}
		});
	}

	public remove(roleId: number) {
		this.roleService.delete(roleId).subscribe({
			next: (rm: ResponseModel) => {
				this.fetchRoleList();
			},
			error: err => {
				const error: ResponseModel = err.error;
				Swal.fire({ title: error.message, icon: 'error' });
			}
		});
	}
}