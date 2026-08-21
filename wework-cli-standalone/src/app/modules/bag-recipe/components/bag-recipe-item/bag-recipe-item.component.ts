import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {
	ControlValueAccessor,
	FormArray,
	FormBuilder,
	FormGroup,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MyValidators } from '@core/helpers/my-validators';

// ANGULAR MATERIAL
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// MODELS
import { BagRecipeItemModel } from '@core/models/bag-recipe-item.model';
import { ProductModel } from '@core/models/product.model';

@Component({
	selector: 'app-bag-recipe-item',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatListModule,
		MatCardModule,
		MatStepperModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
	],
	templateUrl: './bag-recipe-item.component.html',
	styleUrl: './bag-recipe-item.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BagRecipeItemComponent),
			multi: true,
		},
	],
})

export class BagRecipeItemComponent implements ControlValueAccessor, OnChanges, OnDestroy {
	@Input() public currentDollarRate: number = 0;
	@Input() public productList: ProductModel[] = [];
	@Input() public itemsList: BagRecipeItemModel[] = [];
	@Input() public numberCurrentBags: any = '';
	@Output() public itemsCreated = new EventEmitter<BagRecipeItemModel[]>();

	public internalFormArray!: FormArray;

	private onChange: (value: any) => void = () => { };
	private onTouched: () => void = () => { };
	private destroy$ = new Subject<void>();

	constructor(
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
	) {
		this.internalFormArray = this.fb.array([]);

		// Escuchamos cambios globales para emitir valores limpios de forma nativa al padre
		this.internalFormArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			this.onChange(value);
			this.onTouched();
		});
	}

	// ─── IMPLEMENTACIÓN DE CONTROL VALUE ACCESSOR ───
	public writeValue(value: any[]): void {
		// Nota: Dejamos que ngOnChanges maneje la carga inicial mediante itemsList 
		// para garantizar que productList ya esté disponible en memoria.
		if (value && value.length > 0) {
			this.buildFormFromItems(value);
		}
	}

	// ─── CONSTRUCTOR DE FORMULARIO MAESTRO ───
	private buildFormFromItems(items: any[]): void {
		this.internalFormArray.clear({ emitEvent: false });
		if (!items || items.length === 0) return;

		items.forEach((item) => {
			// 1. Extraer el ID del producto base desde el ítem de la receta
			const idBuscado = item.product?.id || item.productId || item.id;

			// 2. Encontrar el producto base real del almacén para recuperar el Stock actualizado
			const productoBaseReal = this.productList.find(p => String(p.id) === String(idBuscado));

			// 3. Fusionar: Conservamos los precios/cantidades de la receta, pero inyectamos el producto base real
			const itemSincronizado = {
				...item,
				product: productoBaseReal || item.product || item // Fallback por seguridad
			};

			const fg = this.createItemFormGroup(itemSincronizado);
			this.internalFormArray.push(fg, { emitEvent: false });

			// 4. Forzar el cálculo matemático inicial con la tasa de cambio actual
			this.recalculateItemTotals(fg);
		});

		this.internalFormArray.updateValueAndValidity({ emitEvent: false });
	}

	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	public setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.internalFormArray.disable() : this.internalFormArray.enable();
	}

	// ─── GESTIÓN INTERNA DEL FORMULARIO Y CÁLCULOS SÉNIOR ───
	private createItemFormGroup(item: any = {}): FormGroup {
		console.log('Los items en createItemFormGroup', item);
		const group = this.fb.group({
			product: [item.product || null, Validators.required],
			quantity: [item.quantity || 0, [Validators.required, Validators.min(0)]],
			totalQuantityRequired: [item.totalQuantityRequired || 0],
			costPrice: [item.costPrice || 0, Validators.required],
			costPriceBs: [item.costPriceBs || 0],
			totalCostPrice: [item.totalCostPrice || 0],
			totalCostPriceBs: [item.totalCostPriceBs || 0],
			salePrice: [item.salePrice || 0, Validators.required],
			salePriceBs: [item.salePriceBs || 0],
			totalSalePrice: [item.totalSalePrice || 0],
			totalSalePriceBs: [item.totalSalePriceBs || 0],
			freightAmount: [item.freightAmount || 0],
			freightAmountBs: [item.freightAmountBs || 0],
			totalFreightAmount: [item.totalFreightAmount || 0],
			totalFreightAmountBs: [item.totalFreightAmountBs || 0],
			selected: [item.selected ?? true],
		});

		// Escucha reactiva campo por campo del grupo para recalcular montos en tiempo real
		group.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
			this.recalculateItemTotals(group);
		});

		return group;
	}

	private recalculateItemTotals(group: FormGroup): void {
		const qty = MyValidators.toNumber(group.get('quantity')?.value);
		const bags = MyValidators.toNumber(this.numberCurrentBags);
		const rate = MyValidators.toNumber(this.currentDollarRate);
		const product = group.get('product')?.value;

		const totalRequired = qty * bags;

		// Validación de límites de Stock
		const stock = MyValidators.toNumber(product?.stock?.quantity);
		if (totalRequired > stock && product?.name !== 'Bolsa') {
			this.snackBar.open('La cantidad requerida supera el valor máximo permitido por su Stock.', 'Cerrar', {
				duration: 4000,
				horizontalPosition: 'center',
				verticalPosition: 'top',
			});
			const maxQtyPerBag = Math.floor((stock ?? 0) / (bags || 1));
			group.get('quantity')?.setValue(maxQtyPerBag, { emitEvent: false });
			return;
		}

		const costPrice = MyValidators.toNumber(group.get('costPrice')?.value);
		const salePrice = MyValidators.toNumber(group.get('salePrice')?.value);
		const freightAmount = MyValidators.toNumber(group.get('freightAmount')?.value);

		// Ejecución de matrices de conversión matemática USD -> Bs
		const costPriceBs = costPrice * rate;
		const salePriceBs = salePrice * rate;
		const freightAmountBs = freightAmount * rate;

		group.patchValue(
			{
				totalQuantityRequired: totalRequired,
				costPriceBs: costPriceBs,
				salePriceBs: salePriceBs,
				freightAmountBs: freightAmountBs,
				totalCostPrice: costPrice * totalRequired,
				totalCostPriceBs: costPriceBs * totalRequired,
				totalSalePrice: salePrice * totalRequired,
				totalSalePriceBs: salePriceBs * totalRequired,
				totalFreightAmount: freightAmount * totalRequired,
				totalFreightAmountBs: freightAmountBs * totalRequired,
			},
			{ emitEvent: false },
		); // Desactivamos emitEvent para evitar loops infinitos de suscripción
	}

	// ─── ACCIONES DE SELECCIÓN EN LA VISTA REAJUSTADAS ───
	public onSelectionChange(event: any): void {
		const selectedProducts: ProductModel[] = event.source.selectedOptions.selected.map((opt: any) => opt.value);

		// Respaldamos las configuraciones actuales escritas por el usuario en pantalla
		const currentGroups = this.internalFormArray.controls.map((c) => c.value);
		this.internalFormArray.clear({ emitEvent: false });

		selectedProducts.forEach((prod) => {
			// Comparamos usando String() para evitar conflictos de tipo primitivo (number vs string)
			const existingData = currentGroups.find((g) => String(g.product?.id) === String(prod.id));

			if (existingData) {
				// Si ya existía en la bolsa (traído de la receta o editado), mantenemos sus valores
				this.internalFormArray.push(this.createItemFormGroup(existingData), { emitEvent: false });
			} else {
				// Si es un producto nuevo que el usuario acaba de marcar, se añade en cero
				this.internalFormArray.push(this.createItemFormGroup({ product: prod }), { emitEvent: false });
			}
		});

		this.internalFormArray.updateValueAndValidity();
	}

	public isProductSelected(productId: any): boolean {
		if (!this.internalFormArray || this.internalFormArray.length === 0) return false;

		// Verificamos si el ID del producto base está registrado en los controles del FormArray
		return this.internalFormArray.controls.some((control) =>
			String(control.get('product')?.value?.id) === String(productId)
		);
	}

	public asFormGroup(control: any): FormGroup {
		return control as FormGroup;
	}

	// ─── CICLOS DE VIDA DE ANGULAR ───
	public ngOnChanges(changes: SimpleChanges): void {
		// SI LLEGA LA LISTA DE ITEMS DE LA RECETA O CAMBIA LA LISTA MAESTRA DE PRODUCTOS
		if (changes['itemsList'] || changes['productList']) {
			if (this.itemsList && this.itemsList.length > 0 && this.productList && this.productList.length > 0) {
				this.buildFormFromItems(this.itemsList);
			}
		}

		// Si cambia la tasa del dólar o las bolsas, recalculamos importes de los formularios activos
		if (changes['currentDollarRate'] || changes['numberCurrentBags']) {
			this.internalFormArray.controls.forEach((control) => {
				this.recalculateItemTotals(control as FormGroup);
			});
			this.internalFormArray.updateValueAndValidity();
		}
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
