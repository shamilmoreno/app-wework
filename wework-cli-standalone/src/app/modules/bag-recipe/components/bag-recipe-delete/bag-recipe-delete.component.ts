import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-bag-recipe-delete',
	standalone: true,
	imports: [],
	templateUrl: './bag-recipe-delete.component.html',
	styleUrl: './bag-recipe-delete.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BagRecipeDeleteComponent {
	@Output() public removeBagRecipe = new EventEmitter();
	public id!: number;
	public bl!: string;
	public bagRecipeName!: string;

	constructor(
		private bagRecipeDeleteDialog: MatDialogRef<BagRecipeDeleteComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		this.id = this.data.bagRecipe.id;
		this.bl = this.data.bagRecipe.bl;
	}

	public remove(bagRecipeId: number) {
		this.removeBagRecipe.emit(bagRecipeId);
		this.closeDialog();
	}

	public closeDialog() {
		this.bagRecipeDeleteDialog.close();
	}
}
