import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// MODULES
import { LucideAngularModule } from 'lucide-angular';

// MODELOS
import { AuthenticationModel } from '@core/models/authentication.model';
import { ResponseModel } from '@core/models/response.model';
import { UserModel } from '@core/models/user.model';

// SERVICIOS
import { AuthenticationService } from '@core/services/authentication.service';
import { LocalStorageService } from '@core/services/local-storage.service';

// COMPONENTES HIJOS
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public currentUser: Partial<UserModel> = {};

  constructor(
    private authenticationService: AuthenticationService,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  public authenticate(event: AuthenticationModel): void {
    this.authenticationService.login(event).subscribe({
      next: (rm: ResponseModel) => {
        const userResponse = rm.response.user;
        console.log('Usuario que se responde de el response', userResponse);
        console.log('Este es el Response completo', rm.response);

        // Construimos el objeto de usuario mapeando los almacenes
        const userData: UserModel = {
          id: userResponse.id,
          firstName: userResponse.firstName,
          lastName: userResponse.lastName,
          email: userResponse.email,
          token: userResponse.token,
          userRoles: userResponse.userRoles,
          warehouses:
            userResponse.userWarehouses?.map((w: any) => ({
              id: w.warehouse?.id,
              name: w.warehouse?.name,
              address: w.warehouse?.address,
            })) ?? [],
          activeWarehouseId: userResponse.activeWarehouseId || null,
        };

        // Establecemos el almacén activo por defecto
        if (userData.warehouses && userData.warehouses.length > 0) {
          userData.activeWarehouseId = userData.warehouses[0]?.id;
        }

        // Guardamos en LocalStorage
        this.localStorageService.setValue('currentUser', JSON.stringify(userData));

        // Mensaje de éxito y redirección
        Swal.fire({
          //position: 'top-end',
          title: rm.message,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          this.handleNavigation(userData);
        });
      },
      error: (err) => {
        const errorData: ResponseModel = err.error;
        Swal.fire({
          title: errorData?.message || 'Error de conexión',
          icon: 'error',
          text: errorData?.message || 'Error de conexión',
        });
      },
    });
  }

  private handleNavigation(user: UserModel): void {
    if (!user.token || !user.userRoles || user.userRoles.length === 0) {
      this.router.navigate(['/admin/not-found']);
      return;
    }

    // Extraemos el nombre del rol (manejando ambas estructuras posibles)
    const roleName = user.userRoles?.[0]?.name || '';

    const routesMap: { [key: string]: string } = {
      Administrator: '/welcome',
      'Recipe Manager': '/welcome',
      'Inventory Manager': '/welcome',
      'Import Manager': '/welcome',
    };

    // Buscamos la ruta o mandamos al dashboard por defecto
    const targetRoute = routesMap[roleName] || '/welcome';

    console.log('Navegando a:', targetRoute); // Esto te ayudará a ver si el rol coincide
    this.router.navigate([targetRoute]);
  }
}
