import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
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

// DIRECTIVE
import { FormattedNumberDirective } from '@shared/directives/formatted-number-input.directive';

// ANGULAR MATERIAL
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// MODELS
import { BagRecipeMaquiladorModel } from '@core/models/bag-recipe-maquilador.model';
import { CompanyModel } from '@core/models/company.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
	selector: 'app-bag-recipe-maquilador',
	standalone: true,
	imports: [
		CommonModule,
		FormattedNumberDirective,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatButtonModule,
		MatDividerModule,
		MatInputModule,
		MatIconModule,
	],
	templateUrl: './bag-recipe-maquilador.component.html',
	styleUrl: './bag-recipe-maquilador.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BagRecipeMaquiladorComponent),
			multi: true,
		},
	],
})
export class BagRecipeMaquiladorComponent implements ControlValueAccessor, OnChanges, OnDestroy {
	@Input() public numberCurrentBags: any = '';
	@Input() public maquiladorList!: BagRecipeMaquiladorModel[];
	@Input() public companyList!: CompanyModel[];
	@Input() public totalNumberBags: number | null = null;
	public previousValue: string = '';
	public resultado: any;
	public dataDetail!: BagRecipeMaquiladorModel[];
	public countItemsMaquiladors!: number;
	private onChange: (value: any) => void = () => { };
	private onTouched: () => void = () => { };
	private destroy$ = new Subject<void>();
	public internalFormArray!: FormArray;

	constructor(private fb: FormBuilder) {
		this.internalFormArray = this.fb.array([]);
		// Escucha y transmite de forma reactiva cada cambio estructural o de valores al componente padre
		this.internalFormArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			this.onChange(value);
			this.onTouched();
		});
	}

	// ─── IMPLEMENTACIÓN DE CONTROL VALUE ACCESSOR ───
	public writeValue(value: any[]): void {
		// Si el valor inicial que proviene del padre está vacío o es nulo, inicializamos el flujo con el maquilador principal
		if (!value || value.length === 0) {
			this.internalFormArray.clear({ emitEvent: false });
			this.addMaquilador(true);
			return;
		}

		this.internalFormArray.clear({ emitEvent: false });
		value.forEach((item) => {
			this.internalFormArray.push(this.createMaquiladorGroup(item), { emitEvent: false });
		});
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

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	// ─── GESTIÓN INTERNA DE FORMULARIOS CORREGIDA (ÚNICA VERSIÓN) ───
	private createMaquiladorGroup(item?: any): FormGroup {
		const group = this.fb.group({
			company: [item?.company || ''],
			assignedBags: [item?.assignedBags || ''],
			isPrimary: [item?.isPrimary ?? false],
		});

		// Aplicamos los requeridos iniciales basados en si es principal o secundario
		const isPrimary = item?.isPrimary ?? false;
		this.setGroupValidators(group, isPrimary);

		// Escuchamos de forma reactiva los cambios del estado "isPrimary"
		group
			.get('isPrimary')
			?.valueChanges.pipe(takeUntil(this.destroy$))
			.subscribe((primaryState) => {
				this.setGroupValidators(group, primaryState);
			});

		return group;
	}

	// Helper senior para aislar la lógica de validaciones condicionales
	private setGroupValidators(group: FormGroup, isPrimary: boolean): void {
		const companyControl = group.get('company');
		const bagsControl = group.get('assignedBags');

		if (isPrimary) {
			// Si es el maquilador Principal, ambos campos son obligatorios
			companyControl?.setValidators([Validators.required]);
			bagsControl?.setValidators([Validators.required, Validators.min(1)]);
		} else {
			// Si es Secundario, las validaciones se limpian
			companyControl?.clearValidators();
			bagsControl?.clearValidators();
		}

		// Actualizamos el estado de validación interno de Angular en tiempo real
		companyControl?.updateValueAndValidity({ emitEvent: false });
		bagsControl?.updateValueAndValidity({ emitEvent: false });
	}

	public addMaquilador(isPrimary: boolean = false): void {
		this.internalFormArray.push(this.createMaquiladorGroup({ isPrimary }));
	}

	public removeMaquilador(index: number): void {
		this.internalFormArray.removeAt(index);
	}

	public asFormGroup(control: any): FormGroup {
		return control as FormGroup;
	}

	// ─── CICLOS DE VIDA DE ANGULAR ───
	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['totalNumberBags']) {
			this.handleTotalBagsChange();
		}
	}

	private handleTotalBagsChange(): void {
		console.log('Cambio detectado en totalNumberBags:', this.totalNumberBags);

		const amountValue = this.totalNumberBags;

		if (amountValue === null || amountValue === undefined) {
			return;
		}

		// Caso 1: Si el FormArray está vacío, creamos el maquilador principal
		if (this.internalFormArray.length === 0) {
			const principalMaquiladorGroup = this.fb.group({
				company: [null],
				assignedBags: [amountValue], // Coincide con formControlName="assignedBags"
				isPrimary: [true]            // Coincide con isPrimary de la badge
			});

			this.internalFormArray.push(principalMaquiladorGroup);
		}
		// Caso 2: Si ya existe al menos un maquilador, actualizamos la cantidad del principal (índice 0)
		else {
			this.internalFormArray.at(0).patchValue({
				assignedBags: amountValue
			}, { emitEvent: false });
		}
	}
}
