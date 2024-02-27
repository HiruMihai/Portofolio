
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationStart, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})


export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {

  
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.authService.authStateChange.pipe(
      take(1),
      map((user) => {
        const isAuthenticated = !!user || this.checkLocalStorage();

        if (isAuthenticated || state.url === '/register') {
          console.log('Allow access.');
          return true;
        }

        if (state.url !== '/login') {
          this.router.navigate(['/login']);
        }
        return false;
      })
    );
  }

  private checkLocalStorage(): boolean {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return isAuthenticated === 'true';
  }
}
