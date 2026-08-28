import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UnsubscribeOnDestroyAdapter } from '@shared/helpers/UnsubscribeOnDestroyAdapter';

// MODELS
import { ProductModel } from '@core/models/product.model';

// ANGULAR MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

// SERVICES
import { ProductService } from '@core/services/product-service';

// COMPONENTS
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ProductStoreService } from '@core/services/product-store-services';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
  @ViewChild('filter', { static: true }) filter: ElementRef | undefined;
  @ViewChild(MatMenuTrigger)
  public contextMenu: MatMenuTrigger | undefined;
  public contextMenuPosition = { x: '0px', y: '0px' };
  @Input() public breadscrums: Array<any> = [];
  @Input() public showNew: boolean = true;
  @Input() public productList: ProductModel[] = [];
  @Input() public searchTittle: string | undefined;
  @Input() public columns: Array<any> = [];
  @Output() public action = new EventEmitter();
  @Output() public refresh = new EventEmitter();
  public isTblLoading: boolean | undefined;
  public product!: ProductModel | null;
  public dataColumns = this.columns;
  public dataSource!: MatTableDataSource<ProductModel>;
  public displayedColumns: string[] = [];
  public dataLength!: number;
  public breadcrumbs = [
    {
      title: 'Todos los Productos',
      items: ['Productos'],
      active: 'Todos los Productos',
    },
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public productService: ProductService,
    private productStoreService: ProductStoreService,
    private snackBar: MatSnackBar,
  ) {
    //super();
  }

  ngOnChanges(): void {
    this.isTblLoading = true;
    this.dataSource = new MatTableDataSource(this.productList);
    this.displayedColumns = this.columns.map((column) => column.name);
    this.dataLength = this.productList.length;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.columns = [
      { label: 'IMAGEN', name: 'imageUrl' },
      { label: 'SKU', name: 'sku' },
      { label: 'Producto', name: 'name' },
    ];

    // Inicializas el dataSource vacío solo una vez
    this.dataSource = new MatTableDataSource<ProductModel>([]);

    this.productStoreService.productList$.subscribe((list) => {
      this.productList = list;
      this.dataSource.data = list;
      this.dataLength = list.length;
    });

     this.productStoreService.searchTitle$.subscribe(title => {
      this.searchTittle = title;
    });

  
    this.displayedColumns = this.columns.map((column) => column.name);
    console.log('Lista de productos resultantes', this.dataSource.data);
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
    const info = {
      action: {
        label: '',
        name: 'manage',
      },
      data: {
        row,
      },
    };
    this.action.emit(info);
  }

  public update(row: any) {
    const info = {
      action: {
        label: '',
        name: 'manage',
      },
      data: {
        row,
      },
    };
    this.action.emit(info);
  }

  public detail(row: any) {
    const info = {
      action: {
        label: '',
        name: 'detail',
      },
      data: {
        row,
      },
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
