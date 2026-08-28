import { Router, NavigationEnd } from '@angular/router';
import { Component, Inject, ElementRef, OnInit, Renderer2, HostListener, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ROUTES } from './sidebar-items';
import Swal from 'sweetalert2';

// MODULES
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TranslateModule } from '@ngx-translate/core';

// SERVICES
import { AuthenticationService } from '@core/services/authentication.service';
import { LocalStorageService } from '@core/services/local-storage.service';

// MODELS
import { ResponseModel } from '@core/models/response.model';
import { UserModel } from '@core/models/user.model';
import { MyTraslatePipe } from '@shared/pipes/my-traslate.pipe';
import { LanguageService } from '@core/services/language.service';
//import { Role } from '@core/models/role';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports:[
        CommonModule,
        RouterModule,
        NgScrollbarModule,
        TranslateModule
    ],
    encapsulation: ViewEncapsulation.None, 
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    providers: [MyTraslatePipe]
})
export class SidebarComponent implements OnInit {
    public sidebarItems: any[] = [];
    public level1Menu = '';
    public level2Menu = '';
    public level3Menu = '';
    public innerHeight: any;
    public bodyTag: any;
    public listMaxHeight!: string;
    public listMaxWidth!: string;
    public userFullName!: string;
    public userImg!: string | undefined;
    public userType!: any;
    public headerHeight = 60;
    public currentRoute!: string;
    public routerObj: any | null;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        public elementRef: ElementRef,
        private authService: AuthenticationService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private myTraslate: MyTraslatePipe,
        private languageService: LanguageService
    ) {
        const body = this.elementRef.nativeElement.closest('body');
        this.routerObj = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // logic for select active menu in dropdown
                const role = ['admin', 'teacher', 'student'];
                const currenturl = event.url.split('?')[0];
                const firstString = currenturl.split('/').slice(1)[0];

                if (role.indexOf(firstString) !== -1) {
                    this.level1Menu = currenturl.split('/')[2];
                    this.level2Menu = currenturl.split('/')[3];
                } else {
                    this.level1Menu = currenturl.split('/')[1];
                    this.level2Menu = currenturl.split('/')[2];
                }
                console.log('Muestro level1', this.level1Menu)
                console.log('Muestro level2', this.level2Menu)
                // close sidebar on mobile screen after menu select
                this.renderer.removeClass(this.document.body, 'overlay-open');
            }
        });
    }

    ngOnInit(): void {
        const currentUser = this.localStorageService.getCurrentUser();
            console.log('¿Qué recibió el Sidebar?:', currentUser);


        if (currentUser) {
            const userRole: string[] = [];
            currentUser.userRoles?.forEach((r: any) => {
                userRole.push(r.role.name);
                this.sidebarItems = this.sidebarItems.concat(ROUTES.filter((x) => x.role?.indexOf(r.role.name) !== -1));
                this.userType = userRole;
                this.userImg = 'assets/images/user/userPng.png';

                // SE VERIFICA QUE TIPO DE ROLES TIENE EL USUARIO
                /*witch (r.name) {
                    case "Administrador":
                        this.userType  = 'Administrador';
                        break;
                    case "Empleado":
                        this.userType = 'Empleado';
                        break;
                    default:
                        break;
                }*/
            });

            this.userFullName = currentUser.firstName + ' ' + currentUser.lastName;

            //this.userImg = currentUser.img;
            /*console.log(currentUser.roles.name);
            switch ("Administrador") {
                case "Administrador":
                    this.userType = 'Administrador';
                    break;
                case "Empleado":
                    this.userType = 'Empleado';
                    break;
                default:
                    break;
            }*/

            /*if (userRole === 'Administrador') {
                this.userType = 'Administrador';
            }else if (userRole === IRole.Teacher) {
                this.userType = IRole.Teacher;
            } else if (userRole === IRole.Student) {
                this.userType = IRole.Student;
            } else {
                this.userType = IRole.Admin;
            }*/
        }

        this.initLeftSidebar();
        this.bodyTag = this.document.body;
    }

    ngOnDestroy() {
        //this.routerObj.unsubscribe();
    }

    public async getTraslate(key: string) {
        return await this.languageService.getContent(key);
    }

    @HostListener('window:resize', ['$event'])
    public windowResizecall(_event: any) {
        this.setMenuHeight();
        this.checkStatuForResize(false);
    }

    @HostListener('document:mousedown', ['$event'])
    public onGlobalClick(event: any): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.renderer.removeClass(this.document.body, 'overlay-open');
        }
    }

    public callLevel1Toggle(event: any, element: any) {
        if (element === this.level1Menu) {
            this.level1Menu = '0';
        } else {
            this.level1Menu = element;
        }
        const hasClass = event.target.classList.contains('toggled');
        if (hasClass) {
            this.renderer.removeClass(event.target, 'toggled');
        } else {
            this.renderer.addClass(event.target, 'toggled');
        }
    }

    public callLevel2Toggle(_event: any, element: any) {
        if (element === this.level2Menu) {
            this.level2Menu = '0';
        } else {
            this.level2Menu = element;
        }
    }

    public callLevel3Toggle(_event: any, element: any) {
        if (element === this.level3Menu) {
            this.level3Menu = '0';
        } else {
            this.level3Menu = element;
        }
        console.log('Como es el level 3', this.level3Menu);
    }

    public initLeftSidebar() {
        const _this = this;
        // Set menu height
        _this.setMenuHeight();
        _this.checkStatuForResize(true);
    }

    public setMenuHeight() {
        this.innerHeight = window.innerHeight;
        const height = this.innerHeight - this.headerHeight;
        this.listMaxHeight = height + '';
        this.listMaxWidth = '500px';
    }

    public isOpen() {
        return this.bodyTag.classList.contains('overlay-open');
    }

    public checkStatuForResize(_firstTime: any) {
        if (window.innerWidth < 1170) {
            this.renderer.addClass(this.document.body, 'ls-closed');
        } else {
            this.renderer.removeClass(this.document.body, 'ls-closed');
        }
    }

    public mouseHover(e: any) {
        const body = this.elementRef.nativeElement.closest('body');
        if (body.classList.contains('submenu-closed')) {
            this.renderer.addClass(this.document.body, 'side-closed-hover');
            this.renderer.removeClass(this.document.body, 'submenu-closed');
        }
    }

    public mouseOut(e: any) {
        const body = this.elementRef.nativeElement.closest('body');
        if (body.classList.contains('side-closed-hover')) {
            this.renderer.removeClass(this.document.body, 'side-closed-hover');
            this.renderer.addClass(this.document.body, 'submenu-closed');
        }
    }

    public logout() {
        this.authService.logout().subscribe({
            next: (rm: ResponseModel) => {
                this.localStorageService.clearStorage();
                // Mostrando un mensaje de exito
                Swal.fire({
                    title: 'Sesión cerrada',
                    text: rm.message,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    this.localStorageService.clearStorage();
                    this.router.navigate(['/auth/login']);
                });
            },
            error: err => {
                // Guardo el error en una variable para mostrarlo posteriormente
                const error: ResponseModel = err.error;
                this.localStorageService.clearStorage();

                // Mostrando un mensaje de error
                Swal.fire({
                    title: error.message,
                    icon: 'info'
                })
            }
        });
    }
}
