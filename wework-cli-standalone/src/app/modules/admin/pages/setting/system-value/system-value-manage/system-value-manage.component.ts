import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SubcategoryModel } from '@core/models/subcategory.model';

// MODULES
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-system-value-manage',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatDialogModule
	],
	templateUrl: './system-value-manage.component.html',
	styleUrls: ['./system-value-manage.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemValueManageComponent implements OnInit {
	@Input() public subcategory: SubcategoryModel = {};
	@Output() public saveSubcategory = new EventEmitter();
	public subcategoryForm!: FormGroup;
	public dialogTitle!: string;
	public submitted: boolean = false;

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: SubcategoryModel = {},
		public dialogRef: MatDialogRef<SystemValueManageComponent>,
		private formBuilder: FormBuilder) { }

	ngOnInit() {
		// Build form
		this.subcategoryForm = this.formBuilder.group({
			name: ['', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(400)
			]]
		});

		this.subcategory = this.data;

		// Check for the form
		if (this.subcategory === undefined) {
			this.subcategoryForm.markAsUntouched();
			this.subcategoryForm.reset();
		} else {
			this.subcategoryForm.get('name')?.setValue(this.subcategory.name);
		}
	}

	get f() { return this.subcategoryForm.controls; }

	public saveSubcategoryOnCategory(event: Event) {
		event.preventDefault();
		this.submitted = true;
		if (this.subcategoryForm.invalid) {
			this.subcategoryForm.markAllAsTouched();
			return;
		}

		// Set object
		this.subcategory.name = this.subcategoryForm.get('name')?.value;

		// Emit Output
		this.saveSubcategory.emit({
			op: (this.subcategory.id !== undefined) ? 'update' : 'create',
			object: this.subcategory
		});

		// Close dialog
		this.closeDialog();
	}

	submit() {
		// emppty stuff
	}

	public closeDialog() {
		this.dialogRef.close();
	}
}
