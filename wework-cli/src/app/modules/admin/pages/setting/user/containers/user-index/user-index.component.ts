import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import Swal from 'sweetalert2';

// MODULES
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// MODELS
import { ResponseModel } from '@core/models/response.model';
import { UserModel } from '@core/models/user.model';
import { SubcategoryModel } from '@core/models/subcategory.model';

//SERVICES
import { UserService } from '@core/services/user.service';
import { SystemValuesService } from '@core/services/system-values.service';
import { RoleService } from '@core/services/role.service';

// COMPONENTS
import { UserManageComponent } from '../../components/user-manage/user-manage.component';
import { UserDeleteComponent } from '../../components/user-delete/user-delete.component';
import { UserDetailComponent } from '../../components/user-detail/user-detail.component';
import { UserListComponent } from '../../components/user-list/user-list.component';


@Component({
	selector: 'app-user-index',
	standalone: true,
	imports: [
		MatDialogModule, 
		UserListComponent,
		UserManageComponent,
		UserDetailComponent,
		UserDeleteComponent
	],
	templateUrl: './user-index.component.html',
	styleUrls: ['./user-index.component.scss']
})
export class UserIndexComponent implements OnInit {
	public userList: UserModel[] = [];
	public user!: UserModel;
	public information: UserModel[] = [];
	public genreList!: SubcategoryModel[];
	public roleList!: SubcategoryModel[];
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
		private roleService: RoleService,
		private systemValuesService: SystemValuesService
	) { }

	ngOnInit(): void {
		this.fetchUserList();
		this.fetchRoleList();
		this.fetchGenreList();
	}

	public actionCapture(info: any) {
		switch (info.action.name) {
			case 'manage': this.openManageDialog(info); break;
			case 'detail': this.openDetailDialog(info.data.row.id); break;
			case 'delete': this.openDeleteDialog(info.data.row); break;
		}
	}

	public fetchGenreList(): void {
		this.systemValuesService.getSubcategoriesByCategoryNem('gen').subscribe({
			next: (rm: ResponseModel) => {
				this.genreList = rm.response.subcategories;
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

	public fetchRoleList(): void {
		this.roleService.list().subscribe({
			next: (rm: ResponseModel) => {
				this.roleList = rm.response;
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

	public fetchUserList(): void {
		moment.locale('es')
		console.log('Si refresque la tabla');
		this.isTblLoading = true
		this.userCount = 0;
		this.userList = [];
		this.information = [];
		this.userService.list().subscribe({
			next: (rm: ResponseModel) => {
				this.userList = rm.response;
				this.userCount = this.userList.length;
				this.isTblLoading = false;
				this.searchTittle = 'Filtrar Embarque';
				this.columns = [
					{ label: 'NOMBRE', name: 'firstName' },
					{ label: 'APELLIDO', name: 'lastName' },
					{ label: 'CORREO', name: 'email' },
					{ label: 'ACCION', name: 'actions' }
				];

				// Format data-
				this.userList.forEach(i => {
					this.information.push({
						id: i.id,
						firstName: i.firstName,
						lastName: i.lastName,
						email: i.email,
						gender: i.gender,
						userRoles: i.userRoles
					});
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

	public openManageDialog(info: any) {
		if (info.data !== undefined) {
			let userCurrent = info.data.row.id;
			this.userService.byId(userCurrent).subscribe({
				next: (rm: ResponseModel) => {
					this.user = rm.response;
					const userManage = this.dialogService.open(UserManageComponent, {
						data: {
							user: this.user,
							genreList: this.genreList,
							roleList: this.roleList
						}
					});

					// Subscribe to Output
					userManage
						.componentInstance
						.saveUser.subscribe((data: any) => this.saveChanges(data));
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
					genreList: this.genreList,
					roleList: this.roleList
				}
			});

			// Subscribe to Output
			userManage
				.componentInstance
				.saveUser.subscribe((data: any) => this.saveChanges(data));
		}
	}

	public openDeleteDialog(user: UserModel) {
		const userDelete = this.dialogService.open(UserDeleteComponent, {
			data: {
				user
			}
		});

		// Subscribe to Output
		userDelete
			.componentInstance
			.removeUser.subscribe((userId: number) => this.remove(userId));
	}

	public openDetailDialog(userId: any) {
		this.userService.detail(userId).subscribe({
			next: (rm: ResponseModel) => {
				let user = rm.response;
				const userDetails = this.dialogService.open(UserDetailComponent, {
					data: {
						user
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
		let userRoles;

		this.userService[request](values.object).subscribe({
			next: (rm: ResponseModel) => {
				console.log('Este es el objeto devuelto despues de actualizar o guardar', rm);
				userIdNew = rm.response.id;
				userRoles = values.object.roles

				// Save Roles
				if (userIdNew && userRoles !== undefined && userRoles.length > 0) {
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
					this.userService.removeRoles(userIdNew).subscribe({
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
		});/* 


		this.userService[request](values.object).subscribe({
			next: (rm: ResponseModel) => {
				userIdNew = rm.response.id;
				userRoles = values.object.roles;
				console.log('Estos es el usuario nuevo', userIdNew);
				console.log('Estos son los roles a guardar', userRoles);

				// Save Roles
				if (userIdNew && userRoles !== undefined && userRoles.length > 0) {
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
					this.userService.removeRoles(userIdNew).subscribe({
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
