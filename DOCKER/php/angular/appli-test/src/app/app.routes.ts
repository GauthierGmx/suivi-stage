import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { FactsheetsComponent } from './components/factsheets/factsheets.component';
import { AddSearchFormComponent } from './components/add-search-form/add-search-form';
import { SearchDetailsComponent } from './components/search-details/search-details.component';
import { UpdateSearchComponent } from './components/update-search/update-search.component';
import { AddFactsheetComponent } from './components/add-factsheet/add-factsheet.component';

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
  {
    path: 'dashboard/search-details/:id',
    component: SearchDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard/update-search/:id',
    component: UpdateSearchComponent,
    canActivate: [authGuard]
  },
  {
    path: 'add-factsheet',
    component: AddFactsheetComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];