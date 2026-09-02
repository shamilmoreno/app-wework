import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// ANGULAR MATERIAL
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

// MODELS
import { RoleModel } from '@core/models/role.model';
import { PermissionModel } from '@core/models/permission.model';
import { ResponseModel } from '@core/models/response.model';

// SERVICES
import { RoleService } from '@core/services/role.service';

interface PermissionGroup {
	resource: string;
	permissions: PermissionModel[];
}

@Component({
	selector: 'app-role-permissions',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatCheckboxModule,
		MatButtonModule,
		MatExpansionModule,
	],
	templateUrl: './role-permissions.component.html',
	styleUrl: './role-permissions.component.scss',
})
export class RolePermissionsComponent implements OnInit {
	@Output() public savePermissions = new EventEmitter<number[]>();
	public role!: RoleModel;
	public permissionList: PermissionModel[] = [];
	public groupedPermissions: PermissionGroup[] = [];
	public permissionsForm!: FormGroup;
	public isLoading: boolean = true;

	constructor(
		private formBuilder: FormBuilder,
		private roleService: RoleService,
		public dialogRef: MatDialogRef<RolePermissionsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) { }

	ngOnInit(): void {
		this.role = this.data.role;
		this.permissionList = this.data.permissionList;
		this.groupPermissionsByResource();
		this.fetchRoleCurrentPermissions();
	}

	// Agrupa "product:view", "product:create"... bajo el recurso "product"
	private groupPermissionsByResource(): void {
		const groups: { [key: string]: PermissionModel[] } = {};

		this.permissionList.forEach((permission) => {
			const resource = permission.name?.split(':')[0] || 'otros';
			if (!groups[resource]) groups[resource] = [];
			groups[resource].push(permission);
		});

		this.groupedPermissions = Object.keys(groups)
			.sort()
			.map((resource) => ({ resource, permissions: groups[resource] }));
	}

	// Carga los permisos que el rol YA tiene, para pre-marcar los checkboxes
	private fetchRoleCurrentPermissions(): void {
		this.roleService.detail(this.role.id!).subscribe({
			next: (rm: ResponseModel) => {
				const currentPermissionIds: number[] = (rm.response.rolePermissions || [])
					.map((rp: any) => rp.permission.id);

				this.buildForm(currentPermissionIds);
				this.isLoading = false;
			},
			error: () => {
				this.buildForm([]);
				this.isLoading = false;
			}
		});
	}

	private buildForm(currentPermissionIds: number[]): void {
		const controls: { [key: string]: boolean } = {};

		this.permissionList.forEach((permission) => {
			controls[`permission_${permission.id}`] = currentPermissionIds.includes(permission.id!);
		});

		this.permissionsForm = this.formBuilder.group(controls);
	}

	public toggleAllInGroup(group: PermissionGroup, checked: boolean): void {
		group.permissions.forEach((permission) => {
			this.permissionsForm.get(`permission_${permission.id}`)?.setValue(checked);
		});
	}

	public isGroupFullyChecked(group: PermissionGroup): boolean {
		return group.permissions.every((permission) =>
			this.permissionsForm?.get(`permission_${permission.id}`)?.value
		);
	}

	public saveChanges(): void {
		const selectedIds: number[] = this.permissionList
			.filter((permission) => this.permissionsForm.get(`permission_${permission.id}`)?.value)
			.map((permission) => permission.id!);

		this.savePermissions.emit(selectedIds);
	}

	public closeDialog(): void {
		this.dialogRef.close();
	}
}