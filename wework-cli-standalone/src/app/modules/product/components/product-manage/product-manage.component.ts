import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// ANGULAR MATERIAL
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

// MODELS
import { ProductModel } from '@core/models/product.model';
import { SubcategoryModel } from '@core/models/subcategory.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
	selector: 'app-product-manage',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatIconModule,
		MatStepperModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatDialogModule,
		MatButtonModule,
		MatSelectModule,
		MatIconModule
	],
	templateUrl: './product-manage.component.html',
	styleUrl: './product-manage.component.scss',
})
export class ProductManageComponent implements OnInit {
	@Output() public save = new EventEmitter();
	@Output() public numberBagsChange = new EventEmitter();
	@Output() closeRequest = new EventEmitter<void>();
	public isLinear = false;
	public isEditable = false;
	public action: string | undefined;
	public dialogTitle!: string;
	public productForm!: FormGroup;
	public generalInformationForm!: FormGroup;
	public product: ProductModel = new ProductModel();
	public productList: ProductModel = new ProductModel();
	public locationList: SubcategoryModel[] = [];
	public unitMeasurecList: SubcategoryModel[] = [];

	constructor(
		private formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<ProductManageComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {}

	ngOnInit(): void {
		// Build data
		this.buildData();

		// Build form
		this.buildForm();
	}

	get f() {
		return this.productForm.controls;
	}

	public buildForm() {
		this.productForm = this.formBuilder.group({
			generalProductForm: this.formBuilder.group({
				sku: ['', [Validators.required]],
				name: ['', [Validators.required]],
				location: [''],
				unitMeasurec: ['', [Validators.required]],
			}),
		});

		if (this.product.id === undefined) {
			this.productForm.markAsUntouched();
			this.productForm.reset();
		} else {
			this.productForm.get('generalProductForm')?.get('sku')?.setValue(this.product.sku);
			this.productForm.get('generalProductForm')?.get('name')?.setValue(this.product.name);
			this.productForm
				.get('generalProductForm')
				?.get('unitMeasurec')
				?.setValue(this.product.unitMeasurec);
		}
	}

	public buildData() {
		this.dialogTitle = 'Añadir Producto';
		this.locationList = this.data.locationList;
		this.unitMeasurecList = this.data.unitMeasurecList;
		if (this.data.product !== undefined) {
			this.product = this.data.product;
		}
		console.log('Lista de localizaciones', this.locationList);
		console.log('Lista de medidas', this.unitMeasurecList);
		console.log('Los productos', this.product);
	}

	public submit() {
		// emppty stuff
	}

	public saveChanges(event: Event): void {
		event.preventDefault();
		if (this.productForm.invalid) {
			this.productForm.markAllAsTouched();
			return;
		}

		// Estableciendo los datos de la receta
		this.product.sku = this.productForm.get('generalProductForm')?.get('sku')?.value;
		this.product.name = this.productForm.get('generalProductForm')?.get('name')?.value;
		this.product.unitMeasurec = this.productForm
			.get('generalProductForm')
			?.get('unitMeasurec')?.value;

		// Enviar la información al componente padre
		this.save.emit({
			op: this.product.id !== undefined ? 'update' : 'create',
			object: this.product,
		});
	}

	public closeDialog() {
		this.closeRequest.emit();
	}
}
