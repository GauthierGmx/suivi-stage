import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { AddSearchFormComponent } from './components/add-search-form/add-search-form';
import { FactsheetsComponent } from './components/factsheets/factsheets.component';
import { SearchDetailsComponent } from './components/search-details/search-details.component';
<<<<<<< HEAD
=======
import { UpdateSearchComponent } from './components/update-search/update-search.component';
>>>>>>> origin/main

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
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];