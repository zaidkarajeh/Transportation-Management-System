import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
    const router = inject(Router);
    const role = localStorage.getItem('userRole');

    if (role === 'Admin') return true;

    // لو مش Admin، رجعه للـ Dashboard
    router.navigate(['/']);
    return false;
};
