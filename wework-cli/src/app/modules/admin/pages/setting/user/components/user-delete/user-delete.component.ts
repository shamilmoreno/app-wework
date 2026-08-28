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
	selector: 'app-user-delete',
	standalone: true,
	imports: [
		CommonModule,
		MatDialogModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatTabsModule
	],
	templateUrl: './user-delete.component.html',
	styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit {
	@Output() public removeUser = new EventEmitter();
	public id!: number;
	public firstName!: string;
	public lastName!: string;

	constructor(
		private userDeleteDialog: MatDialogRef<UserDeleteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		this.id = this.data.user.id;
		this.firstName = this.data.user.firstName;
		this.lastName = this.data.user.lastName;
	}

	public remove(userId: number) {
		this.removeUser.emit(userId);
		this.closeDialog();
	}

	public closeDialog() {
		this.userDeleteDialog.close();
	}
}
