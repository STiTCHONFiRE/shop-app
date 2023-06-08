import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "./service/auth.service";

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router)

  if (authService.isAdmin()) {
    return true;
  }

  return router.navigate([""]);
}

export const authGuard = () => {
  const authService = inject(AuthService);

  if (authService.isAuth()) {
    return true
  }

  return authService.login();
}
