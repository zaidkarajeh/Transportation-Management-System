import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const token = localStorage.getItem('APITocken');

    if (token) return true;

    router.navigate(['/auth/login']);
    return false;
};
