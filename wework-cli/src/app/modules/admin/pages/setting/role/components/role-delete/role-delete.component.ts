import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// MODULES
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button'

@Component({
	selector: 'app-role-delete',
	standalone: true,
	imports: [
		CommonModule,
		MatDialogModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatTabsModule
	],
	templateUrl: './role-delete.component.html',
	styleUrls: ['./role-delete.component.scss']
})
export class RoleDeleteComponent implements OnInit {
	@Output() public removeRole = new EventEmitter();
	public id!: number;
	public name!: string;

	constructor(
		private roleDeleteDialog: MatDialogRef<RoleDeleteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		this.id = this.data.role.id;
		this.name = this.data.role.name;
	}

	public remove(roleId: number) {
		this.removeRole.emit(roleId);
		this.closeDialog();
	}

	public closeDialog() {
		this.roleDeleteDialog.close();
	}
}