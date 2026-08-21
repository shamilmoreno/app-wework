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
import { MatTabsModule } from '@angular/material/tabs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// MODELS
import { UserModel } from '@core/models/user.model';
import { ActionEventModel } from '@core/models/action-event.model';

// SERVICES
import { UserService } from '@core/services/user.service';
import { UserStoreService } from '@core/services/user-store-services';

// COMPONENTS
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        CommonModule,
        MatPaginatorModule,
        MatSortModule,
        MatMenuTrigger,
        MatTabsModule,
        MatTableModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatInputModule,
        BreadcrumbComponent
    ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnChanges, AfterViewInit {
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
    @ViewChild('filter', { static: true }) filter: ElementRef | undefined;
    @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
    @Output() public action = new EventEmitter<ActionEventModel>();
    @Input() public showNew: boolean = true;
    @Input() public userList: Array<any> = [];
    @Input() public searchTittle: string = '';
    @Input() public columns: Array<any> = [];
    @Input() public breadscrums: any = null;

    public dataSource!: MatTableDataSource<UserModel>;
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
            { label: 'PRIMER NOMBRE', name: 'firstName' },
            { label: 'SEGUNDO NOMBRE', name: 'lastName' },
            { label: 'CORREO', name: 'email' },
            { label: 'Acción', name: 'actions' },
        ];

        this.displayedColumns = this.columns.map((column) => column.name);
        this.dataSource = new MatTableDataSource<UserModel>([]);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.dataSource = new MatTableDataSource(this.userList);

        this.dataLength = this.userList.length;

        if (this.paginator) this.dataSource.paginator = this.paginator;
        if (this.sort) this.dataSource.sort = this.sort;
    }

    ngAfterViewInit(): void {
        if (this.paginator) this.dataSource.paginator = this.paginator;
        if (this.sort) this.dataSource.sort = this.sort;

        console.log('La wareHouseList en wareHouseList', this.userList);
        console.log('La dataSource en wareHouseList', this.dataSource);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    public deleteItem(row: any) {
        this.action.emit(row);
    }

    public create() {
        const info = {
            action: {
                label: '',
                name: 'manage',
            },
            data: undefined,
        };
        this.action.emit(info);
    }

    /* public addWareHouse(row: any) {
      this.storeService.dispatch({
        action: { label: 'Ingreso de Almacen', name: 'manage' },
        data: { row },
      });
    } */

    public update(row: any) {
        const info = {
            action: {
                label: '',
                name: 'manage',
            },
            data: { row },
        };
        this.action.emit(info);
    }

    public detail(row: any) {
        const info = {
            action: {
                label: '',
                name: 'detail',
            },
            data: { row },
        };
        this.action.emit(info);
    }

    public delete(row: any) {
        const info = {
            action: {
                label: '',
                name: 'delete',
            },
            data: {
                row,
            },
        };
        this.action.emit(info);
    }

    public selectWarehouse(row: any) {
        const info = {
            action: {
                label: '',
                name: 'select',
            },
            data: {
                row,
            },
        };
        this.action.emit(info);
    }

    public dataRefresh() {
        /*  this.storeService.dispatch({
           action: { label: 'Recarga de Lista', name: 'refresh' },
           data: true,
         }); */
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
