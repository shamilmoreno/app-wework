import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@envs/environment';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';

// MODELS
import { ProductModel } from '@core/models/product.model';
import { SubcategoryModel } from '@core/models/subcategory.model';
import { ResponseModel } from '@core/models/response.model';

// SERVICES
import { ProductService } from '@core/services/product-service';
import { SystemValuesService } from '@core/services/system-values.service';

// COMPONENTS
import { ProductManageComponent } from '../../components/product-manage/product-manage.component';
import { ProductStoreService } from '@core/services/product-store-services';
import { ModelMapper } from '@core/helpers/model.mapper';

@Component({
  selector: 'app-product-index',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './product-index.component.html',
  styleUrl: './product-index.component.scss',
  providers: [ProductService, ProductStoreService, SystemValuesService],
})
export class ProductIndexComponent implements OnInit {
  public product!: ProductModel;
  public productList: ProductModel[] = [];
  public information: ProductModel[] = [];
  public productCount: number | undefined;
  public locationList: SubcategoryModel[] = [];
  public unitMeasurecList: SubcategoryModel[] = [];
  public searchTittle: string | undefined;
  public columns: Array<any> = [];
  public isTblLoading: boolean | undefined;
  public surcharges: any = [];
  public valuePriceCost: any;
  public valueSalePrice: any;
  public imagePathServer = environment.server;
  private destroy$ = new Subject<void>();
  public breadscrums = [
    {
      title: 'Todos los productos',
      items: ['Productos'],
      active: 'Todos los productos',
    },
  ];

  constructor(
    public dialogService: MatDialog,
    private snackBar: MatSnackBar,
    private productService: ProductService,
    private productStoreService: ProductStoreService,
    private systemValuesService: SystemValuesService,
  ) {}

  ngOnInit(): void {
    this.fetchProductList();
    this.fetchLocationList();
    this.fetchUnitMeasurecList();

    this.productStoreService.action$.pipe(takeUntil(this.destroy$)).subscribe((info) => {
      console.log('Información que envio al index', info);
      if (!info) return;
      switch (info.action.name) {
        case 'manage':
          this.openManageDialog(info);
          break;
        case 'refresh':
          this.refresh(true);
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public fetchProductList(): void {
    moment.locale('es');
    this.isTblLoading = true;
    this.productCount = 0;
    this.productList = [];
    this.productService.list().subscribe((listRm: ResponseModel) => {
      const mappedList = ModelMapper.mapResponseToProductList(
        listRm.response,
        this.imagePathServer,
      );
      this.productStoreService.setProductList(mappedList);
      this.productStoreService.setSearchTitle('Filtrar Productos'); 

    });
  }

  //  All information is sought for the selection combos
  public fetchLocationList(): void {
    this.systemValuesService.getSubcategoriesByCategoryNem('ldp').subscribe({
      next: (rm: ResponseModel) => {
        this.locationList = rm.response.subcategories;
      },
      error: (err) => {
        // Guardo el error en una variable para mostrarlo posteriormente
        const error: ResponseModel = err.error;

        // Mostrando un mensaje de error
        Swal.fire({
          title: error.message,
          icon: 'info',
        });
      },
    });
  }

  public fetchUnitMeasurecList(): void {
    this.systemValuesService.getSubcategoriesByCategoryNem('tmp').subscribe({
      next: (rm: ResponseModel) => {
        this.unitMeasurecList = rm.response.subcategories;
      },
      error: (err) => {
        // Guardo el error en una variable para mostrarlo posteriormente
        const error: ResponseModel = err.error;

        // Mostrando un mensaje de error
        Swal.fire({
          title: error.message,
          icon: 'info',
        });
      },
    });
  }

  public openManageDialog(info: any) {
    if (info.data !== undefined) {
    } else {
      const productManage = this.dialogService.open(ProductManageComponent, {
        disableClose: true,
        data: {
          locationList: this.locationList,
          unitMeasurecList: this.unitMeasurecList,
        },
      });

      // Capturamos el evento del componente hijo cuando se cierra la modal
      productManage.componentInstance.closeRequest.subscribe(() => {
        setTimeout(() => {
          this.closeModal(productManage);
        }, 0);
      });

      // Subscribe to Output
      productManage.componentInstance.save.subscribe((data: any) => this.saveChanges(data));
    }
  }

  public saveChanges(values: any) {
    const request = values.op == 'update' ? 'update' : 'create';
    let productIdNew;

    this.productService[request](values.object).subscribe({
      next: (rm: ResponseModel) => {
        productIdNew = rm.response.id;
        this.fetchProductList();
        Swal.fire({
          title: rm.message,
          icon: 'success',
        });
      },
      error: (err) => {
        const error: ResponseModel = err.error;
        Swal.fire({
          title: error.message,
          icon: 'error',
        });
      },
    });
  }

  public remove(productId: number) {
    this.productService.delete(productId).subscribe({
      next: (rm: ResponseModel) => {
        this.fetchProductList();
      },
      error: (err) => {
        const error: ResponseModel = err.error;
        Swal.fire({
          title: error.message,
          icon: 'error',
        });
      },
    });
  }

  public refresh(event: boolean) {
    if (event) {
      this.fetchProductList();
    }
  }

  public closeModal(dialogRef: MatDialogRef<ProductManageComponent>): void {
    this.snackBar
      .open(
        '¿Está seguro de cerrar la ventana modal? Si ha realizado cambios y no los ha guardado, se perderán.',
        'Sí',
        {
          duration: 5000,
          verticalPosition: 'top',
        },
      )
      .onAction()
      .subscribe(() => {
        // Aquí puedes manejar la acción cuando el usuario hace clic en "Sí"
        dialogRef.close();
      });
  }
}
