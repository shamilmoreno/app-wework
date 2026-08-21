import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyValidators } from './../../helpers/my-validators';
import Swal from 'sweetalert2';

// MODELS
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationModel } from '../../../core/models/authentication.model';
import { ResponseModel } from '@core/models/response.model';

// SERVICES
import { AuthenticationService } from '../../../core/services/authentication.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';


@Component({
    selector: 'app-change-password-form',
    standalone: true,
    imports: [
        CommonModule,
        LucideAngularModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './change-password-form.component.html',
    styleUrls: ['./change-password-form.component.scss'],
})
export class ChangePasswordFormComponent implements OnInit {
    public changePasswordForm!: FormGroup;
    public authenticationModel: AuthenticationModel = {};
    public submitted: boolean = false;
    public hide = true;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private lsService: LocalStorageService,
        private router: Router) { }

    ngOnInit() {
        this.buildForm();
    }

    get f(): any {
        return this.changePasswordForm.controls;
    }

    public buildForm(): void {
        this.changePasswordForm = this.formBuilder.group({
            newPassword: ['', [
                Validators.required,
                Validators.minLength(6)
            ]],
            confirmPassword: ['', Validators.required]
        }, {
            validator: MyValidators.mustMatch('newPassword', 'confirmPassword'),
        });
    }

    public changePassword(event: Event) {
        event.preventDefault();
        this.submitted = true;
        if (this.changePasswordForm.invalid) {
            this.changePasswordForm.markAllAsTouched();
            return;
        }

        // Set object
        this.authenticationModel.password = this.changePasswordForm.get('newPassword')?.value;

        // Send request
        this.authenticationService.changePassword(this.authenticationModel).subscribe({
            next: (rm: ResponseModel) => {
                this.lsService.clearStorage();
                Swal.fire({
                    title: rm.message,
                    icon: 'success'
                })
                setTimeout(() => {
                    this.router.navigate(['/auth']);
                }, 3000);
            },
            error: err => {
                const error: ResponseModel = err.error;
                Swal.fire({
                    title: err.message,
                    icon: 'error'
                })

            }
        });
    }
}
