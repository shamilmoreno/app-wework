import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

// ANGULAR MATERIAL
import { MatDialog } from '@angular/material/dialog';

// MODELS
import { ResponseModel } from '@core/models/response.model';
import { WareHouseModel } from '@core/models/wareHouse.model';

//SERVICES
import { WareHouseService } from '@core/services/wareHouse.service';
import { WareHouseStoreService } from '@core/services/wareHouse-store-services';

// COMPONENTS
import { WareHouseListComponent } from '../../components/warehouse-list/warehouse-list.component';
import { WareHouseManageComponent } from '../../components/warehouse-manage/warehouse-manage.component';
import { WareHouseDetailComponent } from '../../components/warehouse-detail/warehouse-detail.component';
import { WareHouseDeleteComponent } from '../../components/warehouse-delete/warehouse-delete.component';
import { Subject, takeUntil } from 'rxjs';
import { ModelMapper } from '@core/helpers/model.mapper';

@Component({
  selector: 'app-warehouse-index',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    WareHouseListComponent,
    WareHouseManageComponent,
    WareHouseDetailComponent,
    WareHouseDeleteComponent,
  ],
  templateUrl: './warehouse-index.component.html',
  styleUrls: ['./warehouse-index.component.scss'],
  providers: [ 
    WareHouseService,
    WareHouseStoreService 
  ],
})

export class WareHouseIndexComponent implements OnInit {
  public wareHouseList: WareHouseModel[] = [];
  public wareHouse!: WareHouseModel;
  public information: WareHouseModel[] = [];
  public warehouseCount: number | undefined;
  public searchTittle: string | undefined;
  public columns: Array<any> = [];
  public isTblLoading: boolean | undefined;
private destroy$ = new Subject<void>();

  public breadscrums = [
    {
      title: 'Todos los Almacenes',
      items: ['Almacenes'],
      active: 'Todos los Almacenes',
    },
  ];

  constructor(
    public dialogService: MatDialog,
    private wareHouseService: WareHouseService,
    private wareHouseStoreService: WareHouseStoreService,
  ) {}

  ngOnInit(): void {
    this.fetchWareHouseList();

    this.wareHouseStoreService.action$.pipe(takeUntil(this.destroy$)).subscribe((info) => {
      console.log('Información que envio al index', info);
      if (!info) return;
      switch (info.action.name) {
        case 'manage':
          this.openManageDialog(info);
          break;
        /* case 'detail':
							this.openDetailDialog(info.data.id);
							break;
						case 'payment':
							this.openPaymentDialog(info.data.id);
							break;*/
        case 'delete':
          this.openDeleteDialog(info.data);
          break;
        case 'refresh':
          this.refresh(true);
          break;
      }
    });
  }

  /*  public actionCapture(info: any) {
    switch (info.action.name) {
      case 'manage':
        this.openManageDialog(info);
        break;
      case 'detail':
        this.openDetailDialog(info.data.row.id);
        break;
      case 'delete':
        this.openDeleteDialog(info.data.row);
        break;
      case 'select':
        this.storeService.setActiveWarehouse(info.data.row);
        break;
    }
  } */

  public fetchWareHouseList(): void {
    moment.locale('es');
		this.isTblLoading = true;
		this.warehouseCount = 0;
		this.wareHouseList = [];
		this.information = [];
		this.wareHouseService.list().subscribe((listRm: ResponseModel) => {
		  const mappedList = ModelMapper.mapResponseToWareHouseList(listRm.response);
		  //console.log('Lista actual de las Recetas en Index.ts', mappedList);
		  this.wareHouseStoreService.setWareHouseList(mappedList);
      this.wareHouseStoreService.setSearchTitle('Filtrar Almacenes'); 
		});
  }

  public openManageDialog(info: any) {
    if (info.data !== undefined) {
      let wareHouseCurrent = info.data.row.id;
      this.wareHouseService.byId(wareHouseCurrent).subscribe({
        next: (rm: ResponseModel) => {
          this.wareHouse = rm.response;
          const wareHouseManage = this.dialogService.open(WareHouseManageComponent, {
            data: {
              wareHouse: this.wareHouse,
            },
          });

          // Subscribe to Output
          wareHouseManage.componentInstance;
          //.saveWareHouse.subscribe((data: any) => this.saveChanges(data));
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
    } else {
      const wareHouseManage = this.dialogService.open(WareHouseManageComponent, {
        data: {},
      });

      // Subscribe to Output
      wareHouseManage.componentInstance;
      //.saveWareHouse.subscribe((data: any) => this.saveChanges(data));
    }
  }

  public openDetailDialog(wareHouseId: any) {
    this.wareHouseService.detail(wareHouseId).subscribe({
      next: (rm: ResponseModel) => {
        let wareHouse = rm.response;
        const wareHouseDetails = this.dialogService.open(WareHouseDetailComponent, {
          data: {
            wareHouse,
          },
        });
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
    console.log('Estos son los datos a guardar', values);
    const request = values.op === 'update' ? 'update' : 'create';
    let wareHouseIdNew;

    this.wareHouseService[request](values.object).subscribe({
      next: (rm: ResponseModel) => {
        console.log('Este es el objeto devuelto despues de actualizar o guardar', rm);
        wareHouseIdNew = rm.response.id;

        // Save Roles
        /* if (wareHouseIdNew && userRoles !== undefined && userRoles.length > 0) {
					console.log('Este es el usuario a guardar', wareHouseIdNew);
					console.log('Este son los roles a guardar', userRoles);
					this.userService.saveRoles(wareHouseIdNew, userRoles).subscribe({
						next: (rm: ResponseModel) => {
						},
						error: err => {
							const error: ResponseModel = err.error;
							Swal.fire({
								title: error.message,
								icon: 'error'
							})
						}
					})
				} else {
					this.wareHouseService.removeRoles(wareHouseIdNew).subscribe({
						next: (rm: ResponseModel) => {
						},
						error: err => {
							const error: ResponseModel = err.error;
							Swal.fire({
								title: error.message,
								icon: 'error'
							})
						}
					})
				} */

        this.fetchWareHouseList();
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
    }); /* 


		this.userService[request](values.object).subscribe({
			next: (rm: ResponseModel) => {
				wareHouseIdNew = rm.response.id;
				userRoles = values.object.roles;
				console.log('Estos es el usuario nuevo', wareHouseIdNew);
				console.log('Estos son los roles a guardar', userRoles);

				// Save Roles
				if (wareHouseIdNew && userRoles !== undefined && userRoles.length > 0) {
					this.userService.saveRoles(wareHouseIdNew, userRoles).subscribe({
						next: (rm: ResponseModel) => {
						},
						error: err => {
							const error: ResponseModel = err.error;
							Swal.fire({
								title: error.message,
								icon: 'error'
							})
						}
					})
				} else {
					this.userService.removeRoles(wareHouseIdNew).subscribe({
						next: (rm: ResponseModel) => {
						},
						error: err => {
							const error: ResponseModel = err.error;
							Swal.fire({
								title: error.message,
								icon: 'error'
							})
						}
					})
				}
				this.fetchUserList()
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
		}); */
  }

  public openDeleteDialog(wareHouse: WareHouseModel) {
    const wareHouseDelete = this.dialogService.open(WareHouseDeleteComponent, {
      data: {
        wareHouse,
      },
    });

    // Subscribe to Output
    wareHouseDelete.componentInstance;
    //.removeWareHouse.subscribe((wareHouseId: number) => this.remove(wareHouseId));
  }

  public remove(wareHouseId: number) {
    this.wareHouseService.delete(wareHouseId).subscribe({
      next: (rm: ResponseModel) => {},
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
      this.fetchWareHouseList();
    }
  }
}
