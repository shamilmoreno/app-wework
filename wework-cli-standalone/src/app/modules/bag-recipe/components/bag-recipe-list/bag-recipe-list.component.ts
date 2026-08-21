import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

// ANGULAR MATERIAL
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

// MODELS
import { BagRecipeModel } from '@core/models/bag-recipe.model';

// SERVICES
import { BagRecipeService } from '@core/services/bag.recipe-service';
import { BagRecipeStoreService } from '@core/services/bagRecipe-store-services';
import { PdfExportService } from '@core/services/pdf-export.service';

// COMPONENTS
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-bag-recipe-list',
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
  templateUrl: './bag-recipe-list.component.html',
  styleUrl: './bag-recipe-list.component.scss',
  providers: [
    provideNativeDateAdapter(), // 👈 AGREGA ESTA LÍNEA AQUÍ
  ],
})
export class BagRecipeListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
  @ViewChild('filter', { static: true }) filter: ElementRef | undefined;
  @ViewChild(MatMenuTrigger)
  public contextMenu: MatMenuTrigger | undefined;
  public contextMenuPosition = { x: '0px', y: '0px' };
  @Input() public showNew: boolean = true;
  @Input() public bagRecipeList: Array<any> = [];
  @Input() public searchTittle: string | undefined;
  @Input() public columns: Array<any> = [];
  @Output() public action = new EventEmitter();
  @Output() public refresh = new EventEmitter();
  public breadcrumbs = [
    {
      title: 'Todas las Recetas',
      items: ['Recetas'],
      active: 'Todas las Recetas',
    },
  ];

  public isTblLoading: boolean | undefined;
  public bagRecipe!: BagRecipeModel | null;
  public dataColumns = this.columns;
  public dataSource!: MatTableDataSource<BagRecipeModel>;
  public displayedColumns: string[] = [];
  public dataLength!: number;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public bagRecipeService: BagRecipeService,
    private store: BagRecipeStoreService,
    private snackBar: MatSnackBar,
    private pdfExportService: PdfExportService,
  ) {
    //super();
  }

  ngOnInit(): void {
    this.columns = [
      { label: 'Código de Receta', name: 'serialCode' },
      { label: 'Maquilador', name: 'maquiladorBag' },
      { label: 'Cantidad de Bolsas', name: 'numberBags' },
      { label: 'Mes Receta', name: 'monthRecipeBag' },
      { label: 'ACCION', name: 'actions' },
    ];

    // Inicializas el dataSource vacío solo una vez
    this.dataSource = new MatTableDataSource<BagRecipeModel>([]);

    this.store.bagRecipeList$.subscribe((list) => {
      this.bagRecipeList = list;
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

  public create() {
    this.store.dispatch({
      action: { label: 'Nueva Receta', name: 'manage' },
      data: undefined,
    });
  }

  public update(row: any) {
    this.store.dispatch({
      action: { label: 'Actrualizar Receta', name: 'manage' },
      data: row,
    });
  }

  public detail(row: any) {
    this.store.dispatch({
      action: { label: 'Detalle de Receta', name: 'detail' },
      data: row,
    });
  }

  public payment(row: any) {
    this.store.dispatch({
      action: { label: 'Pagos de Receta', name: 'payment' },
      data: row,
    });
  }

  public desactive(row: any) {
    this.store.dispatch({
      action: { label: 'Desactiva Receta', name: 'desactive' },
      data: row,
    });
  }

  public delete(row: any) {
    this.store.dispatch({
      action: { label: 'Eliminar Receta', name: 'delete' },
      data: row,
    });
  }

  public dataRefresh() {
    this.store.dispatch({
      action: { label: 'Refrescar Lista', name: 'refresh' },
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

  public exportToPDF(recipe: any) {
    this.pdfExportService.exportToPdfRecipe(recipe);
  }

  public exportToExcel(recipe: any) {
    this.pdfExportService.exportToExcelRecipe(recipe);
  }
}
