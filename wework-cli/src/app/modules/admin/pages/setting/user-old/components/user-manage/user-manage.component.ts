import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

// MODULES
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

// MODELS
import { UserModel } from '@core/models/user.model';

// SERVICES

// COMPONENTS

@Component({
    selector: 'app-user-manage',
    standalone: true,
    imports: [
        CommonModule,
        MatStepperModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogModule 
    ],
    templateUrl: './user-manage.component.html',
    styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit {
    @Output() public saveUser = new EventEmitter();
    public isLinear = false;
    public isEditable = false;
    public action: string | undefined;
    public dialogTitle!: string;
    public userForm!: FormGroup;
    public generalInformationForm!: FormGroup;
    public user: UserModel = new UserModel;
    public userList: any = [{}];
    public roleList: any[] = [];
    public genreList: any;
    public minDate: Date = new Date();
    public isStep1Completed = false;
    public isStep2Completed = false;
    public hide = true;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<UserManageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        // Build data
        this.buildData();

        // Build form
        this.buildForm();
    }

    get f() { return this.userForm.controls; };

    // Method to validate all steps and mark them as completed
    public validateSteps() {
        this.isStep1Completed = this.userForm.get('generalInformationForm')!.valid;
        this.isStep2Completed = this.userForm.get('generalRoleForm')!.valid;
    }

    // Method to handle step change event
    public stepperSelectionChange(event: any) {
        const currentIndex = event.selectedIndex;
        const previousIndex = event.previouslySelectedIndex;

        switch (currentIndex) {
            case 1:
                if (!this.isStep1Completed) {
                    event.selectedIndex = previousIndex;
                }
                break;
            case 2:
                if (!this.isStep2Completed) {
                    event.selectedIndex = previousIndex;
                }
                break;
            // Add cases for additional steps if needed
            default:
                break;
        }
    }

    public capture(event: any) {
        this.userForm.get('generalRoleForm')?.get('role')?.valueChanges.subscribe(role => { });
    }

    public buildForm() {
        this.userForm = this.formBuilder.group({
            generalInformationForm: this.formBuilder.group({
                firstName: ['', [
                    Validators.minLength(2),
                    Validators.required]
                ],
                lastName: ['', [
                    Validators.minLength(2),
                    Validators.required]
                ],
                gender: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]]
            }),
            generalRoleForm: this.formBuilder.group({
                role: ['', [Validators.required]],
            })
        });

        if (this.user.id === undefined) {
            this.userForm.markAsUntouched();
            this.userForm.reset();
        } else {
            this.userForm.get('generalInformationForm')?.get('firstName')?.setValue(this.user.firstName);
            this.userForm.get('generalInformationForm')?.get('lastName')?.setValue(this.user.lastName);
            this.userForm.get('generalInformationForm')?.get('gender')?.setValue(this.user.gender.id);
            this.userForm.get('generalInformationForm')?.get('email')?.setValue(this.user.email);
            this.userForm.get('generalRoleForm')?.get('role')?.setValue(this.user.userRoles);
        }
    }

    public buildData() {
        this.dialogTitle = (this.data.user !== undefined) ? 'Editar Usuario' : 'Nuevo Usuario';
        if (this.data.user !== undefined) {
            this.user = this.data.user;
        }
        this.genreList = this.data.genreList;
        this.roleList = this.data.roleList;
    }

    public submit() {
        // emppty stuff
    }

    public saveChanges(event: Event): void {
        event.preventDefault();
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        // Estableciendo los datos del usuario
        this.user.firstName = this.userForm.get('generalInformationForm')?.get('firstName')?.value;
        this.user.lastName = this.userForm.get('generalInformationForm')?.get('lastName')?.value;
        this.user.gender = this.userForm.get('generalInformationForm')?.get('gender')?.value;
        this.user.email = this.userForm.get('generalInformationForm')?.get('email')?.value;
        this.user.userRoles = this.userForm.get('generalRoleForm')?.get('role')?.value;

        console.log('Este es el objeto de USer a guardar o actualizar', this.user);

        // Enviar la información al componente padre
        this.saveUser.emit({
            op: (this.user.id !== undefined) ? 'update' : 'create',
            object: this.user
        });
    }

    public closeDialog() {
        this.dialogRef.close();
    }
}
