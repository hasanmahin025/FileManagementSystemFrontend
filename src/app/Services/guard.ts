import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. Check if the user has a token (is logged in)
  const token = localStorage.getItem('token');

  if (token) {
    // 2. If they ARE logged in, kick them to the Dashboard
    console.log('User is already logged in. Redirecting to Dashboard...');
    router.navigate(['/dashboard']);
    return false; // Block access to the requested page (e.g. Login)
  }

  // 3. If NOT logged in, allow them to see the page
  return true;
};