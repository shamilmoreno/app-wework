import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// COMPONENTS
import { NavHeaderComponent } from '../../components/nav-header/nav-header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RightSidebarComponent } from '../../components/right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-administrator.component',
  standalone: true,
  imports: [
    RouterOutlet,
    NavHeaderComponent, 
    SidebarComponent,
    RightSidebarComponent
  ],
    templateUrl: './administrator.component.html'
})
export class AdministratorComponent {}
