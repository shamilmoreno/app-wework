import { Component, Inject, ElementRef, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from '@shared/helpers/UnsubscribeOnDestroyAdapter';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
const document: any = window.document;

// MODULES
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LucideAngularModule } from 'lucide-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButtonModule } from '@angular/material/button';


// INTERFACES
import { RoleModel } from '@core/models/role.model';
import { WareHouseModel } from '@core/models/wareHouse.model';

//SERVICES
import { AuthenticationService } from '@core/services/authentication.service';
import { ConfigService } from '@core/services/config.service';
import { LanguageService } from '@core/services/language.service';
import { RightSidebarService } from '@core/services/rightsidebar.service';
import { LocalStorageService } from '@core/services/local-storage.service';
import { UserModel } from '@core/models/user.model';
import { ResponseModel } from '@core/models/response.model';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-nav-header',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        LucideAngularModule,
        NgbDropdownModule,
        NgScrollbarModule,
        NgbCollapseModule,
        MatMenuModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './nav-header.component.html',
    styleUrls: ['./nav-header.component.scss'],
})
export class NavHeaderComponent
    extends UnsubscribeOnDestroyAdapter
    implements OnInit, AfterViewInit {
    public config: any = {};
    public userImg!: string;
    public homePage!: string;
    public isNavbarCollapsed = true;
    public flagvalue: any;
    public countryName: any;
    public langStoreValue: string | null | undefined;
    public defaultFlag!: string;
    public isOpenSidebar!: boolean;
    public userName!: string;
    public userwarehouses: WareHouseModel[] = [];
    public userRole!: string;

    // 2. El array de datos reales
    /*   warehouses: WareHouseModel[] = [
      {
        id: 1,
        name: 'Sede Principal',
        address: 'Centro Histórico',
      },
      {
        id: 2,
        name: 'Bodega Norte',
        address: 'Zona Industrial',
      },
    ];
   */
    // CORRECTO: Asignamos el PRIMER OBJETO del array, no la interfaz.
    public activeWarehouse: WareHouseModel = this.userwarehouses[0];
    public listLang = [
        { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
        { text: 'Spanish', flag: 'assets/images/flags/spain.svg', lang: 'es' },
        { text: 'German', flag: 'assets/images/flags/germany.svg', lang: 'de' },
    ];

    public notifications: any[] = [
        {
            message: 'Please check your mail',
            time: '14 mins ago',
            icon: 'mail',
            color: 'nfc-green',
            status: 'msg-unread',
        },
        {
            message: 'New Patient Added..',
            time: '22 mins ago',
            icon: 'person_add',
            color: 'nfc-blue',
            status: 'msg-read',
        },
        {
            message: 'Your leave is approved!! ',
            time: '3 hours ago',
            icon: 'event_available',
            color: 'nfc-orange',
            status: 'msg-read',
        },
        {
            message: 'Lets break for lunch...',
            time: '5 hours ago',
            icon: 'lunch_dining',
            color: 'nfc-blue',
            status: 'msg-read',
        },
        {
            message: 'Patient report generated',
            time: '14 mins ago',
            icon: 'description',
            color: 'nfc-green',
            status: 'msg-read',
        },
        {
            message: 'Please check your mail',
            time: '22 mins ago',
            icon: 'mail',
            color: 'nfc-red',
            status: 'msg-read',
        },
        {
            message: 'Salary credited...',
            time: '3 hours ago',
            icon: 'paid',
            color: 'nfc-purple',
            status: 'msg-read',
        },
    ];

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        public elementRef: ElementRef,
        private localStorageService: LocalStorageService,
        private rightSidebarService: RightSidebarService,
        private configService: ConfigService,
        private authService: AuthenticationService,
        private router: Router,
        public languageService: LanguageService,
    ) {
        super();
        this.config = this.configService.configData;
    }

    ngOnInit(): void {
        const currentUser = this.localStorageService.getCurrentUser();

        if (currentUser) {
            this.userName = `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim();
            this.userwarehouses = this.localStorageService.getWarehouses();

            // === AQUÍ SELECCIONAMOS EL ALMACÉN DE INICIO ===
            if (this.userwarehouses && this.userwarehouses.length > 0) {
                // Prioridad 1: Buscar si el usuario ya había seleccionado uno manualmente antes
                const savedWarehouseId = localStorage.getItem('selectedWarehouseId');
                let foundWh = null;

                if (savedWarehouseId) {
                    foundWh = this.userwarehouses.find(wh => wh.id?.toString() === savedWarehouseId);
                }

                // Prioridad 2: Si no hay selección previa, buscar el almacén por defecto asignado al usuario
                // (Ajusta 'isDefault' o 'main' según el nombre exacto de la propiedad en tu objeto)
                if (!foundWh) {
                    foundWh = this.userwarehouses.find(wh => wh.isDefault === true || wh.default === 1);
                }

                // Prioridad 3: Si no cumple ninguna de las anteriores, tomar el primero de la lista
                this.activeWarehouse = foundWh || this.userwarehouses[0];
            }
            // ===============================================

            const userRole = 'Administrator';
            this.userImg = 'assets/images/user/userPng.png';

            const roleRoutes: { [key: string]: string } = {
                Administrator: 'admin/dashboard/main',
                'Recipe Manager': 'admin/bag-recipe/summary-dashboard',
            };
            this.homePage = roleRoutes[userRole || ''] || 'admin/dashboard/main';
        } else {
            this.router.navigate(['/auth/login']);
        }

        // ... (Tu lógica de idioma se mantiene igual abajo)
    }


    /* public ngAfterViewInit() {
      // set theme on startup
      if (this.localStorageService.getValue('theme')) {
        this.renderer.removeClass(this.document.body, this.config.layout.variant);
        this.renderer.addClass(
          this.document.body,
          this.localStorageService.getValue('theme') || '{}',
        );
      } else {
        this.renderer.addClass(this.document.body, this.config.layout.variant);
      }
  
      if (this.localStorageService.getValue('menuOption')) {
        this.renderer.addClass(
          this.document.body,
          this.localStorageService.getValue('menuOption') || '{}',
        );
      } else {
        this.renderer.addClass(
          this.document.body,
          'menu_' + this.config.layout.sidebar.backgroundColor,
        );
      }
  
      if (this.localStorageService.getValue('choose_logoheader')) {
        this.renderer.addClass(
          this.document.body,
          this.localStorageService.getValue('choose_logoheader') || '{}',
        );
      } else {
        this.renderer.addClass(
          this.document.body,
          'logo-' + this.config.layout.logo_bg_color,
        );
      }
  
      if (this.localStorageService.getValue('sidebar_status')) {
        if (this.localStorageService.getValue('sidebar_status') === 'close') {
          this.renderer.addClass(this.document.body, 'side-closed');
          this.renderer.addClass(this.document.body, 'submenu-closed');
        } else {
          this.renderer.removeClass(this.document.body, 'side-closed');
          this.renderer.removeClass(this.document.body, 'submenu-closed');
        }
      } else {
        if (this.config.layout.sidebar.collapsed === true) {
          this.renderer.addClass(this.document.body, 'side-closed');
          this.renderer.addClass(this.document.body, 'submenu-closed');
        }
      }
    } */

    public ngAfterViewInit() {
        // 1. Manejo del Tema
        const theme = this.localStorageService.getValue('theme');
        if (theme) {
            this.renderer.removeClass(this.document.body, this.config.layout.variant);
            this.renderer.addClass(this.document.body, theme);
        } else {
            this.renderer.addClass(this.document.body, this.config.layout.variant);
        }

        // 2. Opción de Menú
        const menuOption = this.localStorageService.getValue('menuOption');
        if (menuOption) {
            this.renderer.addClass(this.document.body, menuOption);
        } else {
            this.renderer.addClass(
                this.document.body,
                'menu_' + this.config.layout.sidebar.backgroundColor,
            );
        }

        // 3. Logo Header
        const logoHeader = this.localStorageService.getValue('choose_logoheader');
        if (logoHeader) {
            this.renderer.addClass(this.document.body, logoHeader);
        } else {
            this.renderer.addClass(this.document.body, 'logo-' + this.config.layout.logo_bg_color);
        }

        // 4. Estado del Sidebar
        const sidebarStatus = this.localStorageService.getValue('sidebar_status');
        if (sidebarStatus) {
            if (sidebarStatus === 'close') {
                this.renderer.addClass(this.document.body, 'side-closed');
                this.renderer.addClass(this.document.body, 'submenu-closed');
            } else {
                this.renderer.removeClass(this.document.body, 'side-closed');
                this.renderer.removeClass(this.document.body, 'submenu-closed');
            }
        } else if (this.config.layout.sidebar.collapsed) {
            this.renderer.addClass(this.document.body, 'side-closed');
            this.renderer.addClass(this.document.body, 'submenu-closed');
        }
    }

    public callFullscreen() {
        if (
            !document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement
        ) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    public setLanguage(text: string, lang: string, flag: string) {
        this.countryName = text;
        this.flagvalue = flag;
        this.langStoreValue = lang;
        this.languageService.setLanguage(lang);
    }

    public mobileMenuSidebarOpen(event: any, className: string) {
        const hasClass = event.target.classList.contains(className);
        if (hasClass) {
            this.renderer.removeClass(this.document.body, className);
        } else {
            this.renderer.addClass(this.document.body, className);
        }
    }

    public callSidemenuCollapse() {
        const hasClass = this.document.body.classList.contains('side-closed');
        if (hasClass) {
            this.renderer.removeClass(this.document.body, 'side-closed');
            this.renderer.removeClass(this.document.body, 'submenu-closed');
        } else {
            this.renderer.addClass(this.document.body, 'side-closed');
            this.renderer.addClass(this.document.body, 'submenu-closed');
        }
    }

    public setActiveWarehouse(wh: any): void {
        this.activeWarehouse = wh;
        localStorage.setItem('selectedWarehouseId', wh.id.toString());
    }

    public logout() {
        this.authService.logout().subscribe({
            next: (rm: ResponseModel) => {
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
            error: (err) => {
                console.error('El servidor rechazó el logout (posiblemente token vencido):', err);

                // 1. Limpiamos el almacenamiento local de todos modos
                this.localStorageService.clearStorage();

                // 2. En lugar de mostrar un modal de error confuso, lo redirigimos directo al login de forma limpia
                this.router.navigate(['/auth/login']).then(() => {
                    window.location.reload();
                });
            },
        });
    }

}
