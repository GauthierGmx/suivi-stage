import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { StudentLogbookComponent } from './components/student-logbook/student-logbook.component';
import { FactsheetsComponent } from './components/factsheets/factsheets.component';

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
    path: 'factsheets',
    component: FactsheetsComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];