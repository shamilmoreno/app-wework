import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

// MODULES
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

// MODELS
import { SubcategoryModel } from '@core/models/subcategory.model';


@Component({
	selector: 'app-system-value-delete',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatDialogModule,
    	MatCardModule
	],
	templateUrl: './system-value-delete.component.html',
	styleUrls: ['./system-value-delete.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemValueDeleteComponent implements OnInit, OnChanges {
	@Output() public removeSubcategory = new EventEmitter();
	public id!: any;
	public name!: any;

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: SubcategoryModel = {},
		public dialogRef: MatDialogRef<SystemValueDeleteComponent>,
	) { }

	ngOnInit() {
		this.id = this.data.id;
		this.name = this.data.name
	}

	ngOnChanges() {
		if (this.data !== undefined) {
			console.log('Sin Datos a borrar', this.data);
		} else if (this.data !== undefined) {
			console.log('Datos a borrar', this.data);
		}
	}

	public remove(subcategoryId: number) {
		this.removeSubcategory.emit(subcategoryId);
		this.closeDialog();
	}

	public closeDialog() {
		this.dialogRef.close();
	}
}
