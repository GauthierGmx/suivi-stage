import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['role'];
  const currentUser = authService.getCurrentUser();
  let currentUserRole;

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.isStudent(currentUser)) {
    currentUserRole = 'STUDENT';
  }
  else if (authService.isStaff(currentUser)) {
    currentUserRole = 'INTERNSHIP_MANAGER';
  }

  if (expectedRole && currentUserRole !== expectedRole) {
    let selectedStudentId;
    if (currentUserRole === 'INTERNSHIP_MANAGER') {
      const selectedStudent = sessionStorage.getItem('selectedStudent');
      if (selectedStudent) {
        selectedStudentId = JSON.parse(selectedStudent).idUPPA;
      }
      const idSearch = route.paramMap.get('idSearch');
      const idSheet = route.paramMap.get('idSheet');
      const isDashboardRoute = state.url.includes('/dashboard');
      const isFactsheetRoute = state.url.includes('/factsheets');
      if(isDashboardRoute){
        return router.createUrlTree([`/dashboard/student-dashboard/${selectedStudentId}/search-details/${idSearch}`]);
      } 
      if (isFactsheetRoute){
        return router.createUrlTree([`/factsheets/student-factsheets/${selectedStudentId}/sheet-details/${idSheet}`]);
      }
      
    }
    else {
      return router.createUrlTree(['/dashboard']);
    }
  }

  return true;
};