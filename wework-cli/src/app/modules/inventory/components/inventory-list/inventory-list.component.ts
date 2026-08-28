import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';

// ANGULAR MATERIAL
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

// MODELS
import { ActionEventModel } from '@core/models/action-event.model';
import { InventoryModel } from '@core/models/inventory.model';

// SERVICES
import { InventoryService } from '@core/services/inventory-service';
import { InventoryStoreService } from '@core/services/inventory-store-services';

// COMPONENTS
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-inventory-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatTabsModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatNativeDateModule,
    BreadcrumbComponent,
  ],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss',
 // providers: [InventoryService, InventoryStoreService]
})
export class InventoryListComponent {
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
  @ViewChild('filter', { static: true }) filter: ElementRef | undefined;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatMenuTrigger)
  public contextMenu: MatMenuTrigger | undefined;
  public contextMenuPosition = { x: '0px', y: '0px' };
  @Input() public showNew: boolean = true;
  @Input() public inventoryList: Array<any> = [];
  @Input() public searchTittle: string | undefined;
  @Input() public columns: Array<any> = [];
  @Output() public action = new EventEmitter<ActionEventModel>();
  @Output() public refresh = new EventEmitter();
  public isTblLoading: boolean | undefined;
  public inventory!: InventoryModel | null;
  public dataColumns = this.columns;
  public dataSource!: MatTableDataSource<InventoryModel>;
  public displayedColumns: string[] = [];
  public dataLength!: number;
  public searchControl: FormControl = new FormControl('');
  // Datos de ejemplo imitando la imagen de Odoo
  allCards: any[] = [
    {
      id: 1,
      warehouse: 'Main Street WH',
      operation: 'Ingresos',
      toProcess: 4,
      waiting: 0,
      late: 1,
      statusColor: 'rojo',
    },
    {
      id: 2,
      warehouse: 'Main Street WH',
      operation: 'Transferencias Internas',
      toProcess: 2,
      waiting: 0,
      late: 1,
      statusColor: 'azul',
    },
    {
      id: 3,
      warehouse: 'Main Street WH',
      operation: 'Órdenes de entrega',
      toProcess: 5,
      waiting: 3,
      late: 8,
      statusColor: 'rojo',
    },
    {
      id: 4,
      warehouse: 'Central Avenue WH',
      operation: 'Ingresos',
      toProcess: 3,
      waiting: 0,
      late: 3,
      statusColor: 'rojo',
    },
    {
      id: 5,
      warehouse: 'Central Avenue WH',
      operation: 'Transferencias Internas',
      toProcess: 1,
      waiting: 0,
      late: 1,
      statusColor: 'azul',
    },
    {
      id: 6,
      warehouse: 'Central Avenue WH',
      operation: 'Órdenes de entrega',
      toProcess: 7,
      waiting: 4,
      late: 11,
      statusColor: 'rojo',
    },
    {
      id: 7,
      warehouse: 'Cedar Lane Warehouse',
      operation: 'Ingresos',
      toProcess: 2,
      waiting: 0,
      late: 2,
      statusColor: 'rojo',
    },
    {
      id: 8,
      warehouse: 'Cedar Lane Warehouse',
      operation: 'Transferencias Internas',
      toProcess: 1,
      waiting: 0,
      late: 1,
      statusColor: 'azul',
    },
    {
      id: 9,
      warehouse: 'Cedar Lane Warehouse',
      operation: 'Pick',
      toProcess: 2,
      waiting: 0,
      late: 2,
      statusColor: 'amarillo',
    },
    // Otros ejemplos
    {
      id: 10,
      warehouse: 'Main Street WH',
      operation: 'Manufacturing',
      toProcess: 6,
      waiting: 0,
      late: 6,
      statusColor: 'amarillo',
    },
    {
      id: 11,
      warehouse: 'Central Avenue WH',
      operation: 'Repairs',
      toProcess: 0,
      waiting: 0,
      late: 0,
      statusColor: 'rojo',
    },
    {
      id: 12,
      warehouse: 'Central Avenue WH',
      operation: 'Manufacturing',
      toProcess: 3,
      waiting: 0,
      late: 3,
      statusColor: 'amarillo',
    },
  ];

  public filteredCards: any[] = this.allCards;
  public breadscrums = [
    {
      title: 'Inventario',
      items: ['Lista'],
      active: 'inventario',
    },
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public inventoryService: InventoryService,
    private store: InventoryStoreService,
    private snackBar: MatSnackBar,
  ) {
    //super();
  }

  ngOnInit(): void {
    this.columns = [
      { label: 'IMAGEN', name: 'imageUrl' },
      { label: 'SKU', name: 'sku' },
      { label: 'Producto', name: 'product' },
      { label: 'Stock', name: 'quantityProductStock' },
      { label: 'Acción', name: 'actions' },
    ];

    // Inicializas el dataSource vacío solo una vez
    this.dataSource = new MatTableDataSource<InventoryModel>([]);

    // Te suscribes al Store para actualizar los datos
    this.store.inventoryList$.subscribe((list) => {
      this.inventoryList = list;
      this.dataSource.data = list;
      this.dataLength = list.length;
    });

    this.store.searchTitle$.subscribe(title => {
      this.searchTittle = title;
    });


    this.displayedColumns = this.columns.map((column) => column.name);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public deleteItem(row: any) {
    this.action.emit(row);
  }

  public inventoryEntry() {
    const info = {
      action: {
        label: '',
        name: 'inventoryEntry',
      },
      data: undefined,
    };
    this.action.emit(info);
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

  public addInventory(row: any) {
    this.store.dispatch({
      action: { label: 'Ingreso de Inventario', name: 'manage' },
      data: { row },
    });
  }

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

  public listMovement(row: any) {
    this.store.dispatch({
      action: { label: 'Lista de Movimientos', name: 'listMovement' },
      data: { row },
    });
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
    this.store.dispatch({
      action: { label: 'Recarga de Lista', name: 'refresh' },
      data: true,
    });
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
