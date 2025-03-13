import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['role'];

  const user = await firstValueFrom(authService.getAuthenticatedUser());

  if (!user) {
    return router.createUrlTree(['/dashboard']);
  }

  const currentUserRole = authService.isStudent(user)
    ? 'STUDENT'
    : authService.isStaff(user)
    ? 'INTERNSHIP_MANAGER'
    : null;

  if (expectedRole && currentUserRole !== expectedRole) {
    if (currentUserRole === 'INTERNSHIP_MANAGER') {
      const selectedStudent = sessionStorage.getItem('selectedStudent');
      if (selectedStudent) {
        const selectedStudentId = JSON.parse(selectedStudent).idUPPA;
        const idSearch = route.paramMap.get('idSearch');
        return router.createUrlTree([`/dashboard/student-dashboard/${selectedStudentId}/search-details/${idSearch}`]);
      }
    }
    return router.createUrlTree(['/dashboard']);
  }

  return true;
}