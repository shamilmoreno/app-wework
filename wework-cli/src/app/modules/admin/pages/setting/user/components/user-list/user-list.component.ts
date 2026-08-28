import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UnsubscribeOnDestroyAdapter } from '@shared/helpers/UnsubscribeOnDestroyAdapter';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// MODULES
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';

// MODELS
import { UserModel } from '@core/models/user.model';

// SERVICES
import { UserService } from '@core/services/user.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

// COMPONENTS

@Component({
	selector: 'app-user-list',
	standalone: true,
	imports: [
		CommonModule,
		BreadcrumbComponent,
		MatTabsModule,
		MatIconModule,
		MatTableModule,
		MatSortModule,
		MatMenuModule,
		MatButtonModule,
		MatPaginatorModule
	],
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends UnsubscribeOnDestroyAdapter implements OnChanges {
	@Input() public breadscrums: Array<any> = [];
	@Input() public showNew: boolean = true;
	@Input() public userList: Array<any> = [];
	@Input() public searchTittle: string | undefined;
	@Input() public columns: Array<any> = [];
	@Output() public action = new EventEmitter();
	@Output() public refresh = new EventEmitter();
	@Output() public dateRangeChange = new EventEmitter();

	public isTblLoading: boolean | undefined;
	@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
	@ViewChild('filter', { static: true }) filter: ElementRef | undefined;
	@ViewChild(MatMenuTrigger)
	public contextMenu: MatMenuTrigger | undefined;
	public contextMenuPosition = { x: '0px', y: '0px' };
	public dataSource!: MatTableDataSource<UserModel>;
	public shipment!: UserModel | null;
	public dataColumns = this.columns;
	public displayedColumns: string[] = [];
	public dataLength!: number;
	public campaignOne!: FormGroup;

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	constructor(
		public httpClient: HttpClient,
		public dialog: MatDialog,
		public userService: UserService,
		private snackBar: MatSnackBar,
		private fb: FormBuilder
	) {
		super();
	}

	ngOnChanges(): void {
		/* this.isTblLoading = true;*/
		this.dataSource = new MatTableDataSource(this.userList);
		this.dataLength = this.userList.length;
		this.displayedColumns = this.columns.map(column => column.name);
		this.dataSource.paginator = this.paginator;
		this.campaignOne = this.fb.group({
			start: [null],
			end: [null]
		});
	}

	public searchDate(event: any) {
		let startDate = this.campaignOne.get('start')?.value;
		let endDate = this.campaignOne.get('end')?.value;
		let dates = {
			startDate,
			endDate
		}
		if (startDate != null && endDate != null) {
			console.log('Este es el TYPEOS de Start', dates.startDate)
			console.log('Este es el TYPEOS de End', dates.endDate)
			this.filterByDate(dates);
			startDate = null
			endDate = null
		}

	}

	public create() {
		const info = {
			action: {
				label: "",
				name: "manage"
			}, data: undefined
		}
		this.action.emit(info);
	}

	public update(row: any) {
		const info = {
			action: {
				label: "",
				name: "manage"
			},
			data: {
				row
			}
		}
		this.action.emit(info);
	}

	public detail(row: any) {
		const info = {
			action: {
				label: "",
				name: "detail"
			},
			data: {
				row
			}
		}
		this.action.emit(info);
	}

	public delete(row: any) {
		const info = {
			action: {
				label: "",
				name: "delete"
			},
			data: {
				row
			}
		}
		this.action.emit(info);
	}

	public changePassword(row: any) {
		// Lógica para cambiar la contraseña
		console.log('Cambiar contraseña para el usuario:', row);
	}

	public filterByDate(row: any) {
		const info = {
			action: {
				label: "",
				name: "filerDates"
			},
			data: {
				row
			}
		}
		this.dateRangeChange.emit(info);

	}

	public dataRefresh() {
		this.refresh.emit(true);
	}

	public showNotification(colorName: any, text: any, placementFrom: any, placementAlign: any) {
		this.snackBar.open(text, '', {
			duration: 2000,
			verticalPosition: placementFrom,
			horizontalPosition: placementAlign,
			panelClass: colorName,
		});
	}
}
