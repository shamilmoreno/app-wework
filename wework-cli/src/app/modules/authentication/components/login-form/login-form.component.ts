import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas básicas
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// HELPERS Y MODELOS
import { MyValidators } from '@shared/helpers/my-validators'; // Ajustado a tu nueva carpeta shared
import { AuthenticationModel } from '@core/models/authentication.model'; // Cambiado .module por .model
import { LocalStorageService } from '@core/services/local-storage.service';

// MATERIAL (Importa solo lo que uses en el HTML)
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  @Output() public loginEvent = new EventEmitter<AuthenticationModel>();

  public loginForm!: FormGroup;
  public authentication: Partial<AuthenticationModel> = {}; // Partial por seguridad de tipos
  public hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Redirección si ya hay sesión (Lógica de Guard básica)
    const currentUser = this.localStorageService.getValue('currentUser');
    if (currentUser) {
      this.router.navigate(['/admin']);
    }

    this.buildForm();
  }

  // Getter para facilitar el acceso a controles en el HTML
  get f() {
    return this.loginForm.controls;
  }

  public buildForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, MyValidators.validateEmail]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
   /*  this.loginForm = this.formBuilder.group({
      email: ['shamilmoreno@gmail.com', [Validators.required, MyValidators.validateEmail]],
      password: ['holamundo', [Validators.required, Validators.minLength(6)]],
    }); */
  }

  public login(event: Event): void {
    event.preventDefault();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Emitimos directamente el valor del formulario
    this.loginEvent.emit(this.loginForm.value);
  }
}
