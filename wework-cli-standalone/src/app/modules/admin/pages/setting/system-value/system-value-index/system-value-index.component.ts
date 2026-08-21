import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

// MODELS
import { CategoryModel } from '@core/models/category.model';
import { SubcategoryModel } from '@core/models/subcategory.model';
import { ResponseModel } from '@core/models/response.model';

// COMPONENTS
import { SystemValueListComponent } from '../system-value-list/system-value-list.component';
import { SystemValueDeleteComponent } from '../system-value-delete/system-value-delete.component';
import { SystemValueManageComponent } from '../system-value-manage/system-value-manage.component';

// SERVICES
import { SystemValuesService } from '@core/services/system-values.service';

@Component({
	selector: 'app-system-value-index',
	standalone: true,
	imports: [
		CommonModule,
    	SystemValueListComponent 
	],
	templateUrl: './system-value-index.component.html',
	styleUrls: ['./system-value-index.component.scss']
})
export class SystemValueIndexComponent implements OnInit {
	public categoryList: CategoryModel[] = [];
	public subcatIdToRemove!: number;
	public subcatToAdd!: SubcategoryModel;

	constructor(
		public dialogService: MatDialog,
		private systemValuesService: SystemValuesService
	) { }

	ngOnInit() {
		this.getAll();
	}

	public getAll() {
		this.systemValuesService.list().subscribe({
			next: (rm: ResponseModel) => {
				this.categoryList = rm.response;
				this.categoryList.sort((a: CategoryModel, b: CategoryModel) => {
					if (a.name! > b.name!) { return 1; }
					if (a.name! < b.name!) { return -1; }
					return 0;
				});
			},
			error: err => {
				const error: ResponseModel = err.error;
				Swal.fire({
					title: error.message,
					icon: 'error'
				})
			}
		});
	}

	public openManageDialog(currentSubcategory: SubcategoryModel) {
		const subcategoryManage = this.dialogService.open(SystemValueManageComponent, {
			data: {
				catId: currentSubcategory.catId,
				id: currentSubcategory.id,
				name: currentSubcategory.name,
				
			}
		});

		// Subscribe to Output
		subcategoryManage
			.componentInstance
			.saveSubcategory.subscribe((data: any) => this.saveChanges(data));
	}

	public openDeleteDialog(subcategory: SubcategoryModel) {
		const subcategoryDelete = this.dialogService.open(SystemValueDeleteComponent, {
			data: {
				id: subcategory.id,
				name: subcategory.name
			}
		});

		// Subscribe to Output
		subcategoryDelete
			.componentInstance
			.removeSubcategory.subscribe((info: any) => this.removeSubcategory(info));
	}

	public removeSubcategory(subcategoryId: number) {
		this.systemValuesService.removeSubcategory(subcategoryId).subscribe({
			next: (rm: ResponseModel | any) => {
				this.subcatIdToRemove = subcategoryId;
				Swal.fire({
					title: rm.message,
					icon: 'success',
				})
			},
			error: err => {
				const error: ResponseModel = err.error;
				Swal.fire({
					title: error.message,
					icon: 'error'
				})
			}
		});
	}

	public saveChanges(values: any) {
		if (values.op === 'create') {
			this.systemValuesService.createSubcategory(values.object).subscribe({
				next: (rm: ResponseModel | any) => {
					values.object.id = rm.response.id;
					this.subcatToAdd = values.object;
					Swal.fire({
						title: rm.message,
						icon: 'success',
					})
				},
				error: err => {
					const error: ResponseModel = err.error;
					Swal.fire({
						title: error.message,
						icon: 'error'
					})
				}
			});
		} else if (values.op === 'update') {
			this.systemValuesService.editSubcategory(values.object).subscribe({
				next: (rm: ResponseModel | any) => {
					values.object.id = rm.response.id;
					this.subcatToAdd = values.object;
					Swal.fire({
						title: rm.message,
						icon: 'success',
					})
				},
				error: err => {
					const error: ResponseModel = err.error;
					Swal.fire({
						title: error.message,
						icon: 'error'
					})
				}
			});
		}
	}
}
