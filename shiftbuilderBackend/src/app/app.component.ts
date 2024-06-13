import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FirebaseAppModule } from '@angular/fire/app';
import { DatabaseModule } from '@angular/fire/database';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { AuthModule } from '@angular/fire/auth';
import { EditShiftComponent } from './editshift/editshift.component';

@Component({ selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css', imports: [CommonModule, RouterOutlet, NavbarComponent, RouterOutlet, RouterLink, FirebaseAppModule, DatabaseModule, AuthModule]})
export class AppComponent {
  title = 'shiftbuilder';

  constructor() {}

}

const routes: Routes = [
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent,},
  { path: 'shifts', component: ShiftsComponent},
  { path: 'addshift', component: ShiftsComponent,},
  { path: 'editshift', component: ShiftsComponent,},
  { path: 'profile', component: ProfileComponent,},
  { path: 'editshift/:id', component: EditShiftComponent,},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}