import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// ANGULAR MATERIAL
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// MODELS
import { RoleModel } from '@core/models/role.model';

@Component({
	selector: 'app-role-manage',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
	],
	templateUrl: './role-manage.component.html',
	styleUrl: './role-manage.component.scss',
})
export class RoleManageComponent implements OnInit {
	@Output() public saveRole = new EventEmitter();
	public dialogTitle!: string;
	public roleForm!: FormGroup;
	public role: RoleModel = new RoleModel();

	constructor(
		private formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<RoleManageComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) { }

	get f() {
		return this.roleForm.controls;
	}

	ngOnInit(): void {
		this.buildData();
		this.buildForm();
	}

	public buildData() {
		if (this.data?.role !== undefined) {
			this.dialogTitle = 'Editar Rol';
			this.role = this.data.role;
		} else {
			this.dialogTitle = 'Nuevo Rol';
		}
	}

	public buildForm() {
		this.roleForm = this.formBuilder.group({
			name: [this.role.name || '', [Validators.required]],
		});
	}

	public saveChanges(event: Event): void {
		event.preventDefault();
		if (this.roleForm.invalid) {
			this.roleForm.markAllAsTouched();
			return;
		}

		this.role.name = this.roleForm.get('name')?.value;

		this.saveRole.emit({
			op: this.role.id !== undefined ? 'update' : 'create',
			object: this.role,
		});

		this.closeDialog();
	}

	public closeDialog() {
		this.dialogRef.close();
	}
}