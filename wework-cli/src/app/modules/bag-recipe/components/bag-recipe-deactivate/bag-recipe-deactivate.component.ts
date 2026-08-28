import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BagRecipeModel } from '@core/models/bag-recipe.model';

@Component({
	selector: 'app-bag-recipe-deactivate',
	imports: [],
	templateUrl: './bag-recipe-deactivate.component.html',
	styleUrl: './bag-recipe-deactivate.component.scss'
})
export class BagRecipeDesactivateComponent {
	@Output() public desactivateBagRecipe = new EventEmitter();
	public id!: number;
	public bl!: string;
	public bagRecipeName!: string;
	public bagRecipe!: BagRecipeModel;

	constructor(
		private bagRecipeDeactiveComponent: MatDialogRef<BagRecipeDesactivateComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		console.log('Data enviada al componente Desactivar', this.data)
		this.id = this.data.bagRecipe.id;
		this.bl = this.data.bagRecipe.bl;
		this.bagRecipe = this.data.bagRecipe
	}

	public deactive() {
		this.desactivateBagRecipe.emit(this.bagRecipe);
		this.closeDialog();
	}

	public closeDialog() {
		this.bagRecipeDeactiveComponent.close();
	}
}
