import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { environment } from '@envs/environment';
import { map, Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

// COMPONENTS
import { BagRecipeManageComponent } from '../../components/bag-recipe-manage/bag-recipe-manage.component';
import { BagRecipeDesactivateComponent } from '../../components/bag-recipe-deactivate/bag-recipe-deactivate.component';
import { BagRecipeDeleteComponent } from '../../components/bag-recipe-delete/bag-recipe-delete.component';
import { BagRecipeDetailComponent } from '../../components/bag-recipe-detail/bag-recipe-detail.component';

// MODELOS
import { ResponseModel } from '@core/models/response.model';
import { BagRecipeModel } from '@core/models/bag-recipe.model';
import { BagRecipeItemModel } from '@core/models/bag-recipe-item.model';
import { CompanyModel } from '@core/models/company.model';
import { ProductDetailModel } from '@core/models/bag-recipe-product.model';
import { ModelMapper } from '@core/helpers/model.mapper';

// SERVICES
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BagRecipeService } from '@core/services/bag.recipe-service';
import { BagRecipeStoreService } from '@core/services/bagRecipe-store-services';
import { CompanyService } from '@core/services/company-service';
import { ProductService } from '@core/services/product-service';

// COMPONENTS
import { BagRecipeListComponent } from '../../components/bag-recipe-list/bag-recipe-list.component';

@Component({
	selector: 'app-bag-recipe-index',
	standalone: true,
	imports: [CommonModule, RouterModule, BagRecipeListComponent],
	templateUrl: './bag-recipe-index.component.html',
	styleUrl: './bag-recipe-index.component.scss',
	providers: [BagRecipeService, BagRecipeStoreService, CompanyService, ProductService],
})
export class BagRecipeIndexComponent implements OnInit {
	public bagRecipe!: BagRecipeModel;
	public bagRecipeList: BagRecipeModel[] = [];
	public imagePathServer = environment.server;
	public information: BagRecipeModel[] = [];
	public companyList: CompanyModel[] = [];
	public productsList: ProductDetailModel[] = [];
	public operatingExpense: number = 0;
	public maquila: number = 0;
	public tax: number = 0;
	public bagRecipeCount: number | undefined;
	public searchTittle: string | undefined;
	public columns: Array<any> = [];
	public isTblLoading: boolean | undefined;
	public itemsList: BagRecipeItemModel[] = [];
	public newMaquiladorsList: Array<any> = [];
	public valuePriceCost: any;
	public valueSalePrice: any;
	private destroy$ = new Subject<void>();
	public breadcrumbs = [
		{
			title: 'Todas las Recetas',
			items: ['Recetas'],
			active: 'Todas las Recetas',
		},
	];

	constructor(
		public dialogService: MatDialog,
		private snackBar: MatSnackBar,
		private bagRecipeService: BagRecipeService,
		private bagRecipeStoreService: BagRecipeStoreService,
		private productService: ProductService,
		private companyService: CompanyService,
	) {}

	ngOnInit(): void {
		this.fetchRecipeBagList();
		this.fetchCompanyList();
		this.fetchProductList();

		this.bagRecipeStoreService.action$.pipe(takeUntil(this.destroy$)).subscribe((info) => {
			console.log('Información que envio al index', info);
			if (!info) return;
			switch (info.action.name) {
				case 'manage':
					this.openManageDialog(info);
					break;
				case 'detail':
					this.openDetailDialog(info.data.id);
					break;
				/* case 'payment':
							this.openPaymentDialog(info.data.id);
							break; */
				case 'delete':
					this.openDeleteDialog(info.data);
					break;
				case 'desactive':
					this.openDeactiveDialog(info.data);
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

	public fetchRecipeBagList(): void {
		moment.locale('es');
		this.isTblLoading = true;
		this.bagRecipeCount = 0;
		this.bagRecipeList = [];
		this.bagRecipeService.list().subscribe((listRm: ResponseModel) => {
			const mappedList = ModelMapper.mapResponseToBagRecipeList(listRm.response);
			//console.log('Lista actual de las Recetas en Index.ts', mappedList);
			this.bagRecipeStoreService.setBagRecipeList(mappedList);
			this.bagRecipeStoreService.setSearchTitle('Filtrar Recetas');
		});
	}

	public fetchCompanyList(): void {
		this.companyService.list().subscribe({
			next: (rm: ResponseModel) => {
				this.companyList = rm.response;
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

	public fetchProductList(): void {
		this.productService.list().subscribe({
			next: (rm: ResponseModel) => {
				this.productsList = rm.response;
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
			let bagRecipeCurrent = info.data.id;
			this.bagRecipeService.byId(bagRecipeCurrent).subscribe({
				next: (rm: ResponseModel) => {
					this.bagRecipe = rm.response;
					console.log('Listado de recetas en index.ts', this.bagRecipe);
					const bagRecipeManage: MatDialogRef<BagRecipeManageComponent> = this.dialogService.open(BagRecipeManageComponent, {
						disableClose: true,
						data: {
							bagRecipe: this.bagRecipe,
							companyList: this.companyList,
							productList: this.productsList,
						},
					});

					// Capturamos el evento del componente hijo cuando se cierra la modal
					bagRecipeManage.componentInstance.closeRequest.subscribe(() => {
						setTimeout(() => {
							this.closeModal(bagRecipeManage);
						}, 0);
					});

					// Subscribe to Output
					bagRecipeManage.componentInstance.saveBagRecipe.subscribe((data: any) => this.saveChanges(data));
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
			// Maquiladors
			this.newMaquiladorsList = [];
			/* this.newMaquiladorsList.push(
				{
					amount: null,
					maquiladorMajor: true,
					company: {},
					maquilador: null,
				},
				{
					amount: null,
					maquiladorMajor: false,
					company: {},
					maquilador: null,
				},
			); */

			// Products
			this.itemsList = [];

			// Open Modal Manage
			const bagRecipeManage = this.dialogService.open(BagRecipeManageComponent, {
				disableClose: true,
				data: {
					companyList: this.companyList,
					productList: this.productsList,
					listMaquiladors: this.newMaquiladorsList,
				},
			});

			// Capturamos el evento del componente hijo cuando se cierra la modal
			bagRecipeManage.componentInstance.closeRequest.subscribe(() => {
				setTimeout(() => {
					this.closeModal(bagRecipeManage);
				}, 0);
			});

			// Subscribe to Output
			bagRecipeManage.componentInstance.saveBagRecipe.subscribe((data: any) => this.saveChanges(data));
		}
	}

	public openDeactiveDialog(bagRecipe: BagRecipeModel) {
		const bagRecipeDeactivate = this.dialogService.open(BagRecipeDesactivateComponent, {
			data: {
				bagRecipe: bagRecipe,
			},
		});

		// Subscribe to Output
		bagRecipeDeactivate.componentInstance.desactivateBagRecipe.subscribe((bagRecipe: BagRecipeModel) => this.deactivate(bagRecipe));
	}

	public openDeleteDialog(bagRecipe: BagRecipeModel) {
		const bagRecipeDelete = this.dialogService.open(BagRecipeDeleteComponent, {
			data: {
				bagRecipe: bagRecipe,
			},
		});

		// Subscribe to Output
		bagRecipeDelete.componentInstance.removeBagRecipe.subscribe((bagRecipeId: number) => this.remove(bagRecipeId));
	}

	public openDetailDialog(bagRecipeId: any) {
		this.bagRecipeService.detail(bagRecipeId).subscribe({
			next: (rm: ResponseModel) => {
				let bagRecipe = rm.response;
				this.bagRecipeList = rm.response;
				//console.log('Aqui la lista de los recipes en INDEX Detalle', this.bagRecipeList);
				let totalPayAmount = 0.0;
				rm.response.payments.forEach((p: { amount: number }) => {
					totalPayAmount += Number(p.amount);
				});
				const bagRecipeDetail = this.dialogService.open(BagRecipeDetailComponent, {
					data: {
						bagRecipe,
						totalPayAmount,
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

	/* public openPaymentDialog(bagRecipeId: any) {
		  this.bagRecipeService.detail(bagRecipeId).subscribe({
			  next: (rm: ResponseModel) => {
				  let payments = rm.response.payments;
				  this.bagRecipeList = rm.response;
				  let totalPayAmount = 0.0;
				  console.log('Aqui la lista de la receta en cuestion', this.bagRecipeList);
				  //console.log('Aqui la lista de los recipes en INDEX Detalle', payments);
				  rm.response.payments.forEach((p: { amount: number }) => {
					  totalPayAmount += Number(p.amount);
				  });
				  const BagRecipePayment = this.dialogService.open(
					  BagRecipePaymentRelationComponent,
					  {
						  width: '80vw', // o '1000px' si prefieres un ancho fijo
						  maxWidth: '85vw',
						  height: 'auto',
						  panelClass: 'custom-dialog-container', // opcional si usas estilos personalizados
						  data: {
							  bagRecipe: this.bagRecipeList,
							  payments,
							  totalPayAmount,
						  },
					  }
				  );
  
				  // Subscribe to Output
				  BagRecipePayment.componentInstance.saveBagRecipenPayments.subscribe((data: any) =>
					  this.saveChangesPayments(data)
				  );
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
	  } */

	public refresh(event: boolean) {
		if (event) {
			this.fetchRecipeBagList();
		}
	}
	
	public saveChanges(values: any) {
		const request = values.op == 'update' ? 'update' : 'create';
		let bagRecipeIdNew;
		let bagRecipeMaquiladors;
		let bagRecipeProducts;

		this.bagRecipeService[request](values.object).subscribe({
			next: (rm: ResponseModel) => {
				bagRecipeIdNew = rm.response.id;
				bagRecipeMaquiladors = values.object.maquiladors;
				bagRecipeProducts = values.object.products;

				// Save Maquiladors
				if (bagRecipeIdNew && bagRecipeMaquiladors !== undefined && bagRecipeMaquiladors.length > 0) {
					console.log('Estos son los Maquiladores a guardar', bagRecipeMaquiladors);
					this.bagRecipeService.saveMaquiladors(bagRecipeIdNew, bagRecipeMaquiladors).subscribe({
						next: (rm: ResponseModel) => {},
						error: (err) => {
							const error: ResponseModel = err.error;
							Swal.fire({
								title: error.message,
								icon: 'error',
							});
						},
					});
				} else {
					this.bagRecipeService.removeMaquiladors(bagRecipeIdNew).subscribe({
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

				// Save Products
				if (bagRecipeIdNew && bagRecipeProducts !== undefined && bagRecipeProducts.length > 0) {
					this.bagRecipeService.saveProducts(bagRecipeIdNew, bagRecipeProducts).subscribe({
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

				this.fetchRecipeBagList();
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

	public saveChangesPayments(values: any) {
		let bagRecipeIdNew = values.object.id;
		let bagRecipePayments = values.object.payments;

		// Save Payments
		if (bagRecipeIdNew && bagRecipePayments !== undefined && bagRecipePayments.length > 0) {
			this.bagRecipeService.savePayments(bagRecipeIdNew, bagRecipePayments).subscribe({
				next: (rm: ResponseModel) => {
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
		} else {
			this.bagRecipeService.removePayments(bagRecipeIdNew).subscribe({
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
	}

	public deactivate(bagRecipe: BagRecipeModel) {
		this.bagRecipeService.disableItem(bagRecipe).subscribe({
			next: (rm: ResponseModel) => {
				this.fetchRecipeBagList();
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

	public remove(bagRecipeId: number) {
		this.bagRecipeService.delete(bagRecipeId).subscribe({
			next: (rm: ResponseModel) => {
				this.fetchRecipeBagList();
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

	public closeModal(dialogRef: MatDialogRef<any>): void {
		this.snackBar
			.open('¿Está seguro de cerrar la ventana modal? Si ha realizado cambios y no los ha guardado, se perderán.', 'Sí', {
				duration: 5000,
				verticalPosition: 'top',
			})
			.onAction()
			.subscribe(() => {
				dialogRef.close();
			});
	}
}
