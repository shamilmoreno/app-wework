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
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// MODELS
import { WareHouseModel } from '@core/models/wareHouse.model';
import { ActionEventModel } from '@core/models/action-event.model';

// SERVICES
import { WareHouseService } from '@core/services/wareHouse.service';
import { WareHouseStoreService } from '@core/services/wareHouse-store-services';

// COMPONENTS
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginator,
    MatMenuTrigger,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSort,
    BreadcrumbComponent,
  ],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.scss',
})
export class WareHouseListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
  @ViewChild('filter', { static: true }) filter: ElementRef | undefined;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  @Output() public action = new EventEmitter<ActionEventModel>();
  @Input() public showNew: boolean = true;
  @Input() public wareHouseList: Array<any> = [];
  @Input() public searchTittle: string = '';
  @Input() public columns: Array<any> = [];
  //@Input() public breadscrums: any = null;
  public breadscrums = [
    {
      title: 'Todos los Almacenes',
      items: ['Almacenes'],
      active: 'Todos los Almacenes',
    },
  ];

  public dataSource!: MatTableDataSource<WareHouseModel>;
  public displayedColumns: string[] = [];
  public dataLength!: number;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
	private wareHouseStoreService: WareHouseStoreService
  ) {
    super();
  }

  ngOnInit(): void {
    this.columns = [
      { label: 'CÓDIGO', name: 'code' },
      { label: 'ALMACÉN', name: 'name' },
      { label: 'UBICACIÓN', name: 'address' },
      { label: 'Acción', name: 'actions' },
    ];

    // Inicializas el dataSource vacío solo una vez
    this.dataSource = new MatTableDataSource<WareHouseModel>([]);

    this.wareHouseStoreService.warehouseList$.subscribe((list) => {
      this.wareHouseList = list;
      this.dataSource.data = list;
      this.dataLength = list.length;
    });

    this.wareHouseStoreService.searchTitle$.subscribe(title => {
      this.searchTittle = title;
    });

    this.displayedColumns = this.columns.map((column) => column.name);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.wareHouseList);

    this.dataLength = this.wareHouseList.length;

    // Vincula el paginador y ordenamiento de forma segura
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;

    console.log('La wareHouseList en wareHouseList', this.wareHouseList);
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

  public dataRefresh() {
    this.wareHouseStoreService.dispatch({
      action: { label: 'Refrescar Lista', name: 'refresh' },
    });
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

  /*   public dataRefresh() {
	  this.storeService.dispatch({
		action: { label: 'Recarga de Lista', name: 'refresh' },
		data: true,
	  });
	} */

  public showNotification(colorName: any, text: any, placementFrom: any, placementAlign: any) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
