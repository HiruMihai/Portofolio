import { Component } from '@angular/core';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { routes } from '../app.routes';
import { AuthService } from '../auth.service';
import { Auth, signOut } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  isLoggedIn!: boolean;
  userName: string = '';
  isNavbarVisible: boolean = true;

  constructor(public authService: AuthService, private router: Router, private auth: Auth) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isNavbarVisible = !['/login', '/register'].includes(event.url);
      }
    });
  }

  ngOnInit() {
    this.authService.authStateChange.subscribe((isAuthenticated: boolean) => {
      this.isLoggedIn = isAuthenticated;
  
      if (isAuthenticated) {
        const user = this.auth.currentUser;
        if (user) {
          this.authService.getFormData(user.uid).then(formData => {
            if (formData) {
              this.userName = formData.firstName;
            }
          });
        }
      } else {
        this.userName = '';
      }
    });
  }
  
  logout() {
    from(signOut(this.auth))
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }
}
