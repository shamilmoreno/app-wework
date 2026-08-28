import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

// MODULES
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

// MODELS
import { CategoryModel } from '@core/models/category.model';
import { SubcategoryModel } from '@core/models/subcategory.model';

// COMPONENTS
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
	selector: 'app-system-value-list',
	standalone: true,
	imports: [
		CommonModule, MatTableModule, MatIconModule, BreadcrumbComponent
	],
	templateUrl: './system-value-list.component.html',
	styleUrls: ['./system-value-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemValueListComponent implements OnInit, OnChanges {
	@Input() public categories: CategoryModel[] = [];
	@Input() public subcatIdToRemove!: number;
	@Input() public subcatToAdd!: SubcategoryModel;
	@Output() public add = new EventEmitter();
	@Output() public edit = new EventEmitter();
	@Output() public delete = new EventEmitter();
	public subcategories?: SubcategoryModel[] = [];
	public currentCategory: CategoryModel | undefined;
	public countSubcategories!: number;
	public breadscrums = [
		{
			title: 'Configuracion',
			items: [],
			active: 'Valores del Sistema',
		},
	];

	ngOnInit() {
		this.countSubcategories = 0;
	}

	ngOnChanges() {
		if (this.subcatIdToRemove !== undefined) {
			this.removeSubcategoryFromList(this.subcatIdToRemove);
		} else if (this.subcatToAdd !== undefined) {
			this.addSubcategoryFromList(this.subcatToAdd);
		}
	}

	public showSubcategories(index: number) {
		this.subcategories = [];
		this.subcategories = this.categories[index].subcategories;
		this.currentCategory = this.categories[index];
		this.countSubcategories = this.categories[index].subcategories!.length;

		if (this.countSubcategories > 0) {
			this.subcategories!.sort((a: SubcategoryModel | any, b: SubcategoryModel | any) => {
				if (a.name > b.name) { return 1; }
				if (a.name < b.name) { return -1; }
				return 0;
			});
		}
	}

	public removeSubcategoryFromList(subcategoryId: number) {
		this.subcategories!.filter((value, index, arr) => {
			if (value.id === subcategoryId) {
				arr.splice(index, 1);
				return;
			}
		});
	}

	public addSubcategoryFromList(subcategory: SubcategoryModel) {
		this.subcategories!.push({ id: subcategory.id, name: subcategory.name });
	}

	public showAdd() {
		const subNew: SubcategoryModel = { catId: this.currentCategory?.id };
		this.add.emit(subNew);
	}

	public showEdit(subcategory: SubcategoryModel) {
		subcategory.catId = this.currentCategory?.id;
		this.edit.emit(subcategory);
	}

	public showRemove(subcategory: SubcategoryModel) {
		this.delete.emit(subcategory);
	}
}
