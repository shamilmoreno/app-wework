import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '@envs/environment';
import { Subject, takeUntil } from 'rxjs';
import { ModelMapper } from '@core/helpers/model.mapper';
import { MyValidators } from '@core/helpers/my-validators';
import { MovementType } from '@shared/enums/movement-type.enum';
import Swal from 'sweetalert2';
import moment from 'moment';

// MODELS
import { InventoryModel } from '@core/models/inventory.model';
import { UserModel } from '@core/models/user.model';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// SERVICES
import { ProductService } from '@core/services/product-service';
import { LocalStorageService } from '@core/services/local-storage.service';
import { InventoryService } from '@core/services/inventory-service';
import { InventoryStoreService } from '@core/services/inventory-store-services';
import { ResponseModel } from '@core/models/response.model';
import { RouterModule } from '@angular/router';

// COMPONENTS
import { InventoryManageComponent } from '../../components/inventory-manage/inventory-manage.component';
import { InventoryMovementListComponent } from '../../components/inventory-movement-list/inventory-movement-list.component';

// ANGULAR MATERIAL

@Component({
  selector: 'app-inventory-index',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './inventory-index.component.html',
  styleUrl: './inventory-index.component.scss',
  providers: [InventoryService, InventoryStoreService, ProductService, LocalStorageService],
})
export class InventoryIndexComponent {
  public inventory!: InventoryModel;
  public inventoryList: InventoryModel[] = [];
  public inventoryMovementList: InventoryModel[] = [];
  public information: InventoryModel[] = [];
  public informationMovement: InventoryModel[] = [];
  public inventoryCount: number | undefined;
  public inventoryMovementCount: number | undefined;
  public searchTittle: string | undefined;
  public columns: Array<any> = [];
  public isTblLoading: boolean | undefined;
  public breadscrums = [
    {
      title: 'Todos los inventarios',
      items: ['Inventario'],
      active: 'Todos los inventarios',
    },
  ];
  public currentUser: UserModel | null | undefined;
  public imagePathServer = environment.server;
  private destroy$ = new Subject<void>();

  constructor(
    public dialogService: MatDialog,
    private snackBar: MatSnackBar,
    private inventoryService: InventoryService,
    private inventoryStoreService: InventoryStoreService,
    private productServices: ProductService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.localStorageService.getCurrentUser();
    this.fetchInventoryList();

    this.inventoryStoreService.action$.pipe(takeUntil(this.destroy$)).subscribe((info) => {
      console.log('Información que envio al index', info);
      if (!info) return;
      switch (info.action.name) {
        case 'manage':
          this.openManageDialog(info);
          break;
        case 'listMovement':
          this.openMovementListByProduct(info.data.row);
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

  public fetchInventoryList(): void {
    moment.locale('es');
    this.isTblLoading = true;
    this.inventoryCount = 0;
    this.inventoryList = [];

    this.inventoryService.list().subscribe((listRm: ResponseModel) => {
      const mappedList = ModelMapper.mapResponseToInventoryList(
        listRm.response,
        this.imagePathServer,
      );
      this.inventoryStoreService.setInventoryList(mappedList);
      this.inventoryStoreService.setSearchTitle('Filtrar Productos'); 

      //console.log('Lista del inventario en fechInventarory', mappedList);
    });
  }

  public openManageDialog(info: any) {
    const inventoryManage = this.dialogService.open(InventoryManageComponent, {
      disableClose: true,
      data: {
        inventoryStockId: info.data.row.id,
        productId: info.data.row.productId,
        productName: info.data.row.product,
        unitMeasurecId: info.data.row.unitMeasurecId,
        responsibleUser: `${this.currentUser?.firstName!} ${this.currentUser?.lastName}`,
      },
    });

    // Capturamos el evento del componente hijo cuando se cierra la modal
    inventoryManage.componentInstance.closeRequest.subscribe(() => {
      setTimeout(() => {
        this.closeModal(inventoryManage);
      }, 0);
    });

    // Subscribe to Output
    inventoryManage.componentInstance.saveBagRecipe.subscribe((data: any) =>
      this.saveChanges(data),
    );
  }

  public openMovementListByProduct(info: any) {
    moment.locale('es');
    this.isTblLoading = true;
    this.inventoryMovementCount = 0;
    this.inventoryMovementList = [];
    this.informationMovement = [];
    this.inventoryService.listOfMovements(info.id).subscribe({
      next: (rm: ResponseModel) => {
        this.inventoryMovementList = rm.response;
        this.inventoryMovementCount = this.inventoryMovementList.length;
        if (this.inventoryMovementList.length === 0) {
          Swal.fire({
            title: 'Este producto no posee un historial de movimientos',
            icon: 'info',
          });
        } else {
          // Format data-
          this.inventoryMovementList.forEach((i) => {
            this.informationMovement.push({
              id: i.id,
              responsibleUser: i.responsibleUser,
              description: i.description,
              date: moment(i.date).format('L'),
              guideNumber: i.guideNumber,
              destination: i.destination,
              quantityProductMoved: MyValidators.numberFormat(i.quantityProductMoved),
              stockAfterMovement: MyValidators.numberFormat(i.stockAfterMovement),
              movementType:
                i.movementType == MovementType.RETURN
                  ? 'Retorno Stock'
                  : i.movementType == MovementType.INCOME
                    ? 'Ingreso Stock'
                    : i.movementType == MovementType.OUTPUT
                      ? 'Salida Stock'
                      : 'Apertura Stock',
            });
          });

          const inventoryMovementHistory = this.dialogService.open(InventoryMovementListComponent, {
            disableClose: true,
            data: {
              inventoryListMovements: this.informationMovement,
              product: info.product,
            },
          });

          // Subscribe to Output
          inventoryMovementHistory.componentInstance;
        }
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

  public saveChanges(values: any) {
    const request = values.op == 'update' ? 'update' : 'create';
    let inventoryIdNew;
    this.inventoryService[request](values.object).subscribe({
      next: (rm: ResponseModel) => {
        inventoryIdNew = rm.response.id;
        this.fetchInventoryList();
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

  public remove(inventoryId: number) {
    this.inventoryService.delete(inventoryId).subscribe({
      next: (rm: ResponseModel) => {
        this.fetchInventoryList();
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
      this.fetchInventoryList();
    }
  }

  public closeModal(dialogRef: MatDialogRef<any>): void {
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
