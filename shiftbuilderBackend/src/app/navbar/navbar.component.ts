import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { Auth, signOut } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
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
    this.authService.loginEvent.subscribe(() => {
      this.updateLoginStatus();
    });

    this.updateLoginStatus();
  }

  updateLoginStatus() {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      if (isAuthenticated) {
        this.authService.getUserProfile().subscribe(
          user => this.userName = user.firstName,
          error => console.error('Failed to fetch user profile', error)
        );
      } else {
        this.userName = '';
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}


