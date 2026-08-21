import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import Swal from 'sweetalert2';

// MODELS
import { ResponseModel } from '@core/models/response.model';
import { UserModel } from '@core/models/user.model';

// SERVICES
import { MatDialog } from "@angular/material/dialog";
import { UserService } from '@core/services/user.service';
import { UserStoreService } from '@core/services/user-store-services';

// components
import { UserListComponent } from "../../components/user-list/user-list.component";
import { UserManageComponent } from "../../components/user-manage/user-manage.component";
import { UserDetailComponent } from "../../components/user-detail/user-detail.component";
import { UserDeleteComponent } from "../../components/user-delete/user-delete.component";

@Component({
	selector: 'app-user-index',
	standalone: true,
	imports: [
		CommonModule,
		UserListComponent,
		UserManageComponent,
		UserDetailComponent,
		UserDeleteComponent
	],
	templateUrl: './user-index.component.html',
	styleUrl: './user-index.component.scss'
})

export class UserIndexComponent {
	public userList: UserModel[] = [];
	public user!: UserModel;
	public information: UserModel[] = [];
	public userCount: number | undefined;
	public searchTittle: string | undefined;
	public columns: Array<any> = [];
	public isTblLoading: boolean | undefined;
	public breadscrums = [
		{
			title: 'Todos los Usuarios',
			items: ['Usuarios'],
			active: 'Todos los Usuarios',
		},
	];

	constructor(
		public dialogService: MatDialog,
		private userService: UserService,
		private storeService: UserStoreService
	) { }

	ngOnInit(): void {
		console.log('Bienvenido al Componente de Almacenes');
		this.fetchUserList();
	}

	public actionCapture(info: any) {
		switch (info.action.name) {
			case 'manage': this.openManageDialog(info); break;
			case 'detail': this.openDetailDialog(info.data.row.id); break;
			case 'delete': this.openDeleteDialog(info.data.row); break;
			case 'select': this.storeService.setActiveUser(info.data.row); break;
		}
	}

	public fetchUserList(): void {
		moment.locale('es')
		this.isTblLoading = true
		this.userCount = 0;
		this.userService.list().subscribe({
			next: (rm: ResponseModel) => {
				this.userList = rm.response;
				this.userCount = this.userList.length;
				this.isTblLoading = false;
				this.searchTittle = 'Filtrar Usuarios';
				this.columns = [
					{ label: 'NOMBRE', name: 'firstName' },
					{ label: 'APELLIDO', name: 'lastName' },
					{ label: 'CORREO', name: 'email' },
					{ label: 'ACCION', name: 'actions' }
				];

				this.userList.forEach(i => {
					this.information.push({
						id: i.id,
						firstName: i.firstName,
						lastName: i.lastName,
						email: i.email
					});
				});
				console.log('Presentación de los Usuario en el Index', this.information);
			},
			error: err => {
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
			let userCurrent = info.data.row.id;
			this.userService.byId(userCurrent).subscribe({
				next: (rm: ResponseModel) => {
					this.user = rm.response;
					const userManage = this.dialogService.open(UserManageComponent, {
						data: {
							wareHouse: this.user
						}
					});

					// Subscribe to Output
					userManage
						.componentInstance
					//.saveUser.subscribe((data: any) => this.saveChanges(data));
				},
				error: err => {
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
			const userManage = this.dialogService.open(UserManageComponent, {
				data: {
				}
			});

			// Subscribe to Output
			userManage
				.componentInstance
			//.saveUser.subscribe((data: any) => this.saveChanges(data));
		}
	}

	public openDetailDialog(userId: any) {
		this.userService.detail(userId).subscribe({
			next: (rm: ResponseModel) => {
				let user = rm.response;
				const userDetails = this.dialogService.open(UserDetailComponent, {
					data: {
						user: user
					}
				});
			},
			error: err => {
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
		const request = (values.op === 'update') ? 'update' : 'create';
		let userIdNew;

		this.userService[request](values.object).subscribe({
			next: (rm: ResponseModel) => {
				console.log('Este es el objeto devuelto despues de actualizar o guardar', rm);
				userIdNew = rm.response.id;

				// Save Roles
				/* if (userIdNew && userRoles !== undefined && userRoles.length > 0) {
					console.log('Este es el usuario a guardar', userIdNew);
					console.log('Este son los roles a guardar', userRoles);
					this.userService.saveRoles(userIdNew, userRoles).subscribe({
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
					this.wareHouseService.removeRoles(userIdNew).subscribe({
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
		});
	}

	public openDeleteDialog(user: UserModel) {
		const userDelete = this.dialogService.open(UserDeleteComponent, {
			data: {
				user: user
			}
		});

		// Subscribe to Output
		userDelete
			.componentInstance
		//.removeUser.subscribe((userId: number) => this.remove(userId));
	}

	public remove(userId: number) {
		this.userService.delete(userId).subscribe({
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

	public refresh(event: boolean) {
		if (event) {
			this.fetchUserList();
		}
	}
}
