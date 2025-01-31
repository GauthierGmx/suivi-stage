import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { FactsheetsComponent } from './components/factsheets/factsheets.component';
import { AddSearchFormComponent } from './components/add-search-form/add-search-form';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'factsheets',
    component: FactsheetsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard/add-search-form',
    component: AddSearchFormComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];