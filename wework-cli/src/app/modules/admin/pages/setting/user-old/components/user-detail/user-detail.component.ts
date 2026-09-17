import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '@envs/environment';

// MODULES
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-user-detail',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		MatTabsModule,
		MatButtonModule
	],
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
	public imagePathServer = environment.server;
	public dialogTitle = 'DETALLES DEL USUARIO';
	public user: any

	constructor(private userDetailDialog: MatDialogRef<UserDetailComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit(): void {
		this.user = this.data.user;
		console.log('Este es el usuario ', this.user);
	}

	public closeDialog() {
		this.userDetailDialog.close();
	}

}
