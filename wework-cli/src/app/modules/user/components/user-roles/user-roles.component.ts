import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { UserModel } from '@core/models/user.model';
import { RoleModel } from '@core/models/role.model';
import { ResponseModel } from '@core/models/response.model';
import { UserService } from '@core/services/user.service';

@Component({
	selector: 'app-user-roles',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
	templateUrl: './user-roles.component.html',
	styleUrl: './user-roles.component.scss',
	providers: [UserService],
})
export class UserRolesComponent implements OnInit {
	@Output() public saveRoles = new EventEmitter<RoleModel[]>();
	public user!: UserModel;
	public roleList: RoleModel[] = [];
	public rolesForm!: FormGroup;
	public isLoading: boolean = true;

	constructor(
		private formBuilder: FormBuilder,
		private userService: UserService,
		public dialogRef: MatDialogRef<UserRolesComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) { }

	ngOnInit(): void {
		this.user = this.data.user;
		this.roleList = this.data.roleList;
		this.fetchUserCurrentRoles();
	}

	private fetchUserCurrentRoles(): void {
		this.userService.listRoles(this.user.id!).subscribe({
			next: (rm: ResponseModel) => {
				const currentRoleIds: number[] = (rm.response || []).map((ur: any) => ur.role.id);
				this.buildForm(currentRoleIds);
				this.isLoading = false;
			},
			error: () => {
				this.buildForm([]);
				this.isLoading = false;
			},
		});
	}

	private buildForm(currentRoleIds: number[]): void {
		const controls: { [key: string]: boolean } = {};
		this.roleList.forEach((role) => {
			controls[`role_${role.id}`] = currentRoleIds.includes(role.id!);
		});
		this.rolesForm = this.formBuilder.group(controls);
	}

	public saveChanges(): void {
		const selectedRoles: RoleModel[] = this.roleList.filter(
			(role) => this.rolesForm.get(`role_${role.id}`)?.value,
		);
		this.saveRoles.emit(selectedRoles);
	}

	public closeDialog(): void {
		this.dialogRef.close();
	}
}