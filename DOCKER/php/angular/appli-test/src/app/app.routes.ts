import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { AddSearchFormComponent } from './components/add-search-form/add-search-form.component';
import { FactsheetsComponent } from './components/factsheets/factsheets.component';
import { SearchDetailsComponent } from './components/search-details/search-details.component';
import { UpdateSearchComponent } from './components/update-search/update-search.component';
import { StudentDashboardManagerComponent } from './components/student-dashboard-manager/student-dashboard-manager.component';
import { AddFactsheetComponent } from './components/add-factsheet/add-factsheet.component';
import { UpdateFactsheetComponent } from './components/update-factsheet/update-factsheet.component';

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
    path: 'dashboard/search-details/:idSearch',
    component: SearchDetailsComponent,
    canActivate: [authGuard],
    data: { role: 'STUDENT' }
  },
  {
    path: 'dashboard/student-dashboard/:idStudent/search-details/:idSearch',
    component: SearchDetailsComponent,
    canActivate: [authGuard],
    data: { role: 'INTERNSHIP_MANAGER' }
  },
  {
    path: 'dashboard/update-search/:id',
    component: UpdateSearchComponent,
    canActivate: [authGuard]
  },
  {
    path: 'factsheets/update-factsheet/:id',
    component: UpdateFactsheetComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard/student-dashboard/:id',
    component: StudentDashboardManagerComponent,
    canActivate: [authGuard]
  },
  {
    path: 'factsheets/add-factsheet',
    component: AddFactsheetComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];