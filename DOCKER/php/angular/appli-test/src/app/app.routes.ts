import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { StudentLogbookComponent } from './components/student-logbook/student-logbook.component';
import { SearchFormComponent } from './components/dashboard/student-dashboard/search-form/search-form.component';
import { FactsheetsComponent } from './components/factsheets/factsheets.component';
import { SearchViewComponent } from './components/search/search-view/search-view.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'student-logbook/:id',
    component: StudentLogbookComponent,
    canActivate: [authGuard]
  },
  {
    path: 'search-form/:id',
    component: SearchFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'search-form',
    component: SearchFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'factsheets',
    component: FactsheetsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'search/:id/view',
    component: SearchViewComponent
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];