import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MainMasterComponent } from './main-master/main.component';
import { DashboardTeacherComponent } from './dashboard-teacher/dashboard.component';
import { DashboardStudentComponent } from './dashboard.studen/dashboard.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: 'main-master',
    component: MainMasterComponent,
  },
  {
    path: 'dashboard-teacher',
    component: DashboardTeacherComponent,
  },
  {
    path: 'dashboard-student',
    component: DashboardStudentComponent,
  },
  {
    path: 'dashboard2',
    component: Dashboard2Component,
  },
];
