import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FirebaseApp, FirebaseAppModule } from '@angular/fire/app';
import { FormGroup } from '@angular/forms';
import { Form } from '@angular/forms';
import { DatabaseModule } from '@angular/fire/database';
import { Router } from '@angular/router';
import { EmailAuthCredential, User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { AuthModule } from '@angular/fire/auth';
import { EditShiftComponent } from './editshift/editshift.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, RouterOutlet, RouterLink, FirebaseAppModule, DatabaseModule, AuthModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'shiftbuilder';

  constructor() {}

}

const routes: Routes = [
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'shifts', component: ShiftsComponent, canActivate: [AuthGuard] },
  { path: 'addshift', component: ShiftsComponent, canActivate: [AuthGuard] },
  { path: 'editshift', component: ShiftsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'editshift/:id', component: EditShiftComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}