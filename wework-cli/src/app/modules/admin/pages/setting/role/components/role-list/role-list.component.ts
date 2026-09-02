import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeOnDestroyAdapter } from '@shared/helpers/UnsubscribeOnDestroyAdapter';

// ANGULAR MATERIAL
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// MODELS
import { RoleModel } from '@core/models/role.model';
import { ActionEventModel } from '@core/models/action-event.model';

@Component({
	selector: 'app-role-list',
	standalone: true,
	imports: [
		CommonModule,
		MatPaginatorModule,
		MatSortModule,
		MatMenuTrigger,
		MatTableModule,
		MatIconModule,
		MatMenuModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
	],
	templateUrl: './role-list.component.html',
	styleUrl: './role-list.component.scss'
})
export class RoleListComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnChanges, AfterViewInit {
	@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
	@ViewChild('filter', { static: true }) filter: ElementRef | undefined;
	@ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
	@Output() public action = new EventEmitter<ActionEventModel>();
	@Input() public showNew: boolean = true;
	@Input() public roleList: Array<any> = [];
	@Input() public searchTittle: string = '';
	@Input() public columns: Array<any> = [];
	@Input() public breadscrums: any = null;

	public dataSource!: MatTableDataSource<RoleModel>;
	public displayedColumns: string[] = [];
	public dataLength!: number;

	constructor(
		public dialog: MatDialog,
		private snackBar: MatSnackBar,
	) {
		super();
	}

	ngOnInit(): void {
		this.columns = [
			{ label: 'NOMBRE', name: 'name' },
			{ label: 'Acción', name: 'actions' },
		];

		this.displayedColumns = this.columns.map((column) => column.name);
		this.dataSource = new MatTableDataSource<RoleModel>([]);
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.dataSource = new MatTableDataSource(this.roleList);
		this.dataLength = this.roleList.length;

		if (this.paginator) this.dataSource.paginator = this.paginator;
		if (this.sort) this.dataSource.sort = this.sort;
	}

	ngAfterViewInit(): void {
		if (this.paginator) this.dataSource.paginator = this.paginator;
		if (this.sort) this.dataSource.sort = this.sort;
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	public create() {
		this.action.emit({ action: { label: '', name: 'manage' }, data: undefined });
	}

	public update(row: any) {
		this.action.emit({ action: { label: '', name: 'manage' }, data: { row } });
	}

	// Abre el checklist de permisos para este rol
	public managePermissions(row: any) {
		this.action.emit({ action: { label: '', name: 'permissions' }, data: { row } });
	}

	public delete(row: any) {
		this.action.emit({ action: { label: '', name: 'delete' }, data: { row } });
	}
}