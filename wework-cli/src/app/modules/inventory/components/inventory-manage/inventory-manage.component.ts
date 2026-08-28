import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MovementType } from '@shared/enums/movement-type.enum';

// DIRECTIVE
import { FormattedNumberDirective } from "@shared/directives/formatted-number-input.directive"

// ANGULAR MATERIAL
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

// MODELS
import { InventoryModel } from '@core/models/inventory.model';

@Component({
  selector: 'app-inventory-manage',
  imports: [
    CommonModule,
    ReactiveFormsModule,
	FormattedNumberDirective,
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './inventory-manage.component.html',
  styleUrl: './inventory-manage.component.scss',
})
export class InventoryManageComponent implements OnInit {
  @Output() public saveBagRecipe = new EventEmitter();
  @Output() closeRequest = new EventEmitter<void>();

  public dialogTitle!: string;
  public inventoryForm!: FormGroup;
  public minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InventoryManageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    console.log('Aqui la data entrante', this.data); // No llega el data
    this.dialogTitle = 'Añadir inventario';
    this.buildForm();
  }

  get f() {
    return this.inventoryForm.controls;
  }

  get entries(): FormArray {
    return this.inventoryForm.get('entries') as FormArray;
  }

  private buildForm(): void {
    this.inventoryForm = this.fb.group({
      guideNumber: ['', Validators.required],
      date: [this.minDate, Validators.required],
      entries: this.fb.array([this.createEntryGroup()]),
    });
  }

  private createEntryGroup(): FormGroup {
    return this.fb.group({
      quantity: ['', [Validators.required, Validators.min(1)]],
      destination: ['', Validators.required],
    });
  }

  public removeEntry(index: number): void {
    if (this.entries.length > 1) {
      this.entries.removeAt(index);
    }
  }

  public saveChanges(event: Event): void {
    event.preventDefault();
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    const guideNumber = this.f['guideNumber'].value;
    const date = this.f['date'].value;
    const responsibleUser = this.data.responsibleUser;
    const productId = this.data.productId;
    const inventoryStockId = this.data.inventoryStockId;

    const entriesToSave: InventoryModel[] = this.entries.controls.map((entry) => {
      const model = new InventoryModel();
      model.quantityProductMoved = entry.get('quantity')?.value;
      model.destination = entry.get('destination')?.value;
      model.description =
        'Ingreso de stock al inventario: recepción y registro de nuevos productos, aumentando la cantidad disponible.';
      model.responsibleUser = responsibleUser;
      model.movementType = MovementType.INCOME;
      model.referenceId = guideNumber;
      model.referenceType = 'PurchaseOrder';
      model.inventoryStockId = inventoryStockId;
      model.productId = productId;
      return model;
    });
    console.log('Onjeto a guardar DATA', this.data); // Esta llgando sin datos;
    console.log('Onjeto a guardar en producto expecifico', entriesToSave);

    this.saveBagRecipe.emit({
      op: 'create',
      object: {
        guideNumber: this.inventoryForm.value.guideNumber,
        date: this.inventoryForm.value.date,
        products: entriesToSave,
      },
    });
  }

  public closeDialog(): void {
    this.closeRequest.emit();
  }
}
