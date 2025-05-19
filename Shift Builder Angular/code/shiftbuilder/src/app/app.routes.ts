import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AddshiftComponent } from './addshift/addshift.component';
import { EditShiftComponent } from './editshift/editshift.component';
import { ProfileComponent } from './profile/profile.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { AuthGuard } from './auth.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent },
    { path: 'shifts', component: ShiftsComponent, canActivate: [AuthGuard] },
    { path: 'addshift', component: AddshiftComponent, canActivate: [AuthGuard] },
    { path: 'editshift', component: EditShiftComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'editshift/:id', component: EditShiftComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }