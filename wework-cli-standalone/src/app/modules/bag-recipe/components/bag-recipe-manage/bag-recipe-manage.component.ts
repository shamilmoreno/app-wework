import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_MONTH_YEAR_FORMATS } from '@shared/constants/date-formats';

// DIRECTIVE
import { FormattedNumberDirective } from '@shared/directives/formatted-number-input.directive';

// ANGULAR MATERIALL
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';

// MODELS
import { BagRecipeMaquiladorModel } from '@core/models/bag-recipe-maquilador.model';
import { PaymentDetailModel } from '@core/models/bag-recipe-payment.model';
import { ProductDetailModel } from '@core/models/bag-recipe-product.model';
import { BagRecipeModel } from '@core/models/bag-recipe.model';
import { CompanyModel } from '@core/models/company.model';
import { CommonModule } from '@angular/common';
import { BagRecipeItemModel } from '@core/models/bag-recipe-item.model';

// COMPONENTS
import { BagRecipeMaquiladorComponent } from '../bag-recipe-maquilador/bag-recipe-maquilador.component';
import { BagRecipeItemComponent } from '../bag-recipe-item/bag-recipe-item.component';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CurrencyFormatDirective } from '@shared/directives/currency-format.directive';

@Component({
	selector: 'app-bag-recipe-manage',
	standalone: true,
	imports: [
		CommonModule,
		FormattedNumberDirective,
		CurrencyFormatDirective,
		ReactiveFormsModule,
		MatIconModule,
		MatStepperModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatDialogModule,
		MatButtonModule,
		BagRecipeMaquiladorComponent,
		BagRecipeItemComponent,
		MatListModule,
		MatCardModule,
	],
	providers: [provideMomentDateAdapter(MY_MONTH_YEAR_FORMATS)],
	templateUrl: './bag-recipe-manage.component.html',
	styleUrl: './bag-recipe-manage.component.scss',
})
export class BagRecipeManageComponent implements OnInit {
	@Output() public saveBagRecipe = new EventEmitter();
	@Output() public numberBagsChange = new EventEmitter();
	@Output() closeRequest = new EventEmitter<void>();
	public isLinear = false;
	public isEditable = false;
	public action: string | undefined;
	public dialogTitle!: string;
	public totalNumberBags: number | null = null;
	public bagRecipeForm!: FormGroup;
	public generalInformationForm!: FormGroup;
	public bagRecipe: BagRecipeModel = new BagRecipeModel();
	public bagRecipeList: BagRecipeModel = new BagRecipeModel();
	public itemsList: BagRecipeItemModel[] = [];
	public maquiladorList: BagRecipeMaquiladorModel[] = [];
	public paymentList: PaymentDetailModel[] = [];
	public companyList: CompanyModel[] = [];
	public productList!: ProductDetailModel[];
	public currentDollarRate: number = 0;
	public numberCurrentBags: string = '';
	public minDate: Date = new Date();
	public isStep1Completed = false;
	public isStep2Completed = false;
	public isStep3Completed = false;
	public isStep4Completed = false;
	public maxDate: moment.Moment = moment();

	constructor(
		private formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<BagRecipeManageComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) { }

	get f() {
		return this.bagRecipeForm.controls;
	}

	ngOnInit(): void {
		// Build data
		this.buildData();

		// Build form
		this.buildForm();

		this.bagRecipeForm.get('generalInformationForm.numberBags')?.valueChanges.subscribe((value) => {
			this.totalNumberBags = value;
		});

		console.log('Numero de bolsas en manage', this.totalNumberBags);

		// 1. Escuchar los cambios del campo "numberBags"
		this.bagRecipeForm.get('generalInformationForm.numberBags')?.valueChanges
			.subscribe((value) => {
				// Actualizar la propiedad local que se envía al @Input()
				this.totalNumberBags = value;
			});
	}

	get maquiladorsFormArray(): FormArray {
		return this.bagRecipeForm.get('maquiladorsForms') as FormArray;
	}

	public buildData() {
		console.log('Aqui la data de la receta completa', this.data);

		this.companyList = this.data.companyList;
		this.productList = this.data.productList;

		// VALIDACIÓN SEGURA: Manejo de modo Edición vs Modo Nuevo
		if (this.data.bagRecipe !== undefined && this.data.bagRecipe !== null) {
			// MODO EDICIÓN
			this.dialogTitle = 'Editar Receta';
			this.bagRecipe = this.data.bagRecipe;
			this.maquiladorList = this.data.bagRecipe.maquiladors;

			// Si viene receta, extraemos sus ítems guardados
			this.itemsList = this.data.bagRecipe.items;
		} else {
			// MODO NUEVO
			this.dialogTitle = 'Nueva Receta';
			this.maquiladorList = this.data.bagRecipe?.maquiladors || this.data.listMaquiladors;

			// Si es una receta nueva, la lista de ítems debe empezar estrictamente como un array vacío
			this.itemsList = [];
		}
	}

	// Method to validate all steps and mark them as completed
	public validateSteps() {
		this.isStep1Completed = this.bagRecipeForm.get('generalInformationForm')!.valid;
		this.isStep2Completed = this.bagRecipeForm.get('generalDeductiblesForm')!.valid;
		this.isStep3Completed = this.bagRecipeForm.get('generalDeductiblesForm')!.valid;
	}

	// Method to handle step change event
	public stepperSelectionChange(event: any) {
		const currentIndex = event.selectedIndex;
		const previousIndex = event.previouslySelectedIndex;

		switch (currentIndex) {
			case 1:
				if (!this.isStep1Completed) {
					event.selectedIndex = previousIndex;
				}
				break;
			case 2:
				if (!this.isStep2Completed) {
					event.selectedIndex = previousIndex;
				}
				break;
			case 3:
				if (!this.isStep3Completed) {
					event.selectedIndex = previousIndex;
				}
				break;
			// Add cases for additional steps if needed
			default:
				break;
		}
	}

	public buildForm() {
		this.bagRecipeForm = this.formBuilder.group({
			generalInformationForm: this.formBuilder.group({
				numberBags: ['', [Validators.required]],
				monthRecipeBag: ['', [Validators.required]],
			}),
			generalDeductiblesForm: this.formBuilder.group({
				operatingExpense: ['', [Validators.required]],
				maquila: ['', [Validators.required]],
				tax: ['', [Validators.required]],
				commission: ['', [Validators.required]],
			}),
			maquiladorsForms: [[]],
			itemsForms: [[]],
		});

		if (this.bagRecipe.id === undefined) {
			this.bagRecipeForm.markAsUntouched();
			this.bagRecipeForm.reset();
			this.setMaquiladorsFormArray(this.maquiladorList);
			this.bagRecipe.maquiladors = this.data.listMaquiladors;
		} else {
			this.bagRecipeForm.get('generalInformationForm')?.get('monthRecipeBag')?.setValue(this.bagRecipe.monthRecipeBag);
			this.bagRecipeForm.get('generalInformationForm')?.get('numberBags')?.setValue(this.bagRecipe.numberBags);
			this.bagRecipeForm.get('generalDeductiblesForm')?.get('operatingExpense')?.setValue(this.bagRecipe.operatingExpense);
			this.bagRecipeForm.get('generalDeductiblesForm')?.get('maquila')?.setValue(this.bagRecipe.maquila);
			this.bagRecipeForm.get('generalDeductiblesForm')?.get('tax')?.setValue(this.bagRecipe.tax);
			this.bagRecipeForm.get('generalDeductiblesForm')?.get('commission')?.setValue(this.bagRecipe.commission);
			this.setMaquiladorsFormArray(this.maquiladorList);
			//this.bagRecipe.items = this.itemsList;
			//this.bagRecipe.products = this.productList;
			//this.bagRecipe.payments = this.paymentList;
		}
	}

	private setMaquiladorsFormArray(maquiladors: BagRecipeMaquiladorModel[]) {
		// 1. Mapeamos el arreglo del backend a la estructura plana que espera el hijo
		const mapeados = (maquiladors || []).map((maq) => ({
			company: maq.company?.id || null,
			assignedBags: maq.assignedBags || '',
			isPrimary: maq.isPrimary ?? false,
			productionPercentage: maq.productionPercentage,
		}));

		// 2. Le enviamos los datos planos al control nativo.
		// Esto disparará automáticamente la vista en el componente hijo.
		this.bagRecipeForm.get('maquiladorsForms')?.setValue(mapeados);
	}

	public captureMaquiladorCreated(event: any) {
		this.bagRecipe.maquiladors = event;
	}

	public captureItemCreated(event: BagRecipeItemModel[]) {
		// Transformamos el evento para asegurar que los strings sean números
		const formattedItems = event.map((item) => ({
			...item,
			// Convertimos explícitamente a número
			costPrice: this.clean(item.costPrice),
			salePrice: this.clean(item.salePrice),
			freightAmount: this.clean(item.freightAmount),
		}));

		console.log('Items transformados a números:', formattedItems);
		this.bagRecipe.items = formattedItems;
	}

	private clean(val: any): number {
		if (val === null || val === undefined || val === '') return 0;

		// Si ya es un número, lo devolvemos tal cual
		if (typeof val === 'number') return val;

		// Si es un string, eliminamos caracteres extraños y convertimos
		// Reemplazamos coma por punto por si acaso
		let cleanVal = String(val).replace(/,/g, '');
		return parseFloat(cleanVal) || 0;
	}

	/* 	public captureProductCreated(event: any) {
			this.bagRecipe.products = event;
		}
	 */
	public capturePaymentCreated(event: any) {
		this.bagRecipe.payments = event;
	}

	public onNumberBagsChange(event: any) {
		this.numberCurrentBags = event.target.value;
	}

	public setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
		// 1. Obtener el control del formulario
		const control = this.bagRecipeForm.get('generalInformationForm.monthRecipeBag');

		if (control) {
			// 2. Si ya tiene un valor válido lo usamos, si no, creamos un nuevo moment()
			const ctrlValue = control.value ? moment(control.value) : moment();

			// 3. Ajustamos el mes y año según la selección del usuario
			ctrlValue.month(normalizedMonthAndYear.month());
			ctrlValue.year(normalizedMonthAndYear.year());

			// 4. Guardamos la fecha con el formato requerido por tu base de datos o API
			control.setValue(ctrlValue.format('YYYY-MM-DD'));
		}

		datepicker.close();
	}

	public submit() {
		// emppty stuff
	}

	public saveChanges(event: Event): void {
		event.preventDefault();
		if (this.bagRecipeForm.invalid) {
			this.bagRecipeForm.markAllAsTouched();
			return;
		}

		// Estableciendo los datos de la receta
		this.bagRecipe.monthRecipeBag = this.bagRecipeForm.get('generalInformationForm')?.get('monthRecipeBag')?.value;
		this.bagRecipe.numberBags = this.bagRecipeForm.get('generalInformationForm')?.get('numberBags')?.value;
		this.bagRecipe.operatingExpense = this.bagRecipeForm.get('generalDeductiblesForm')?.get('operatingExpense')?.value;
		this.bagRecipe.maquila = this.bagRecipeForm.get('generalDeductiblesForm')?.get('maquila')?.value;
		this.bagRecipe.tax = this.bagRecipeForm.get('generalDeductiblesForm')?.get('tax')?.value;
		this.bagRecipe.commission = this.bagRecipeForm.get('generalDeductiblesForm')?.get('commission')?.value;
		this.bagRecipe.items = this.bagRecipe.items = this.bagRecipeForm.get('itemsForms')?.value;

		console.log('El Form de la receta que se va a guardar en saveChange', this.bagRecipeForm);
		console.log('El objeto de la receta que se va a guardar en saveChange', this.bagRecipe);

		// Enviar la información al componente padre
		this.saveBagRecipe.emit({
			op: this.bagRecipe.id !== undefined ? 'update' : 'create',
			object: this.bagRecipe,
		});
	}

	public closeDialog() {
		this.closeRequest.emit();
	}
}
