import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AddshiftComponent } from './addshift/addshift.component';
import { EditShiftComponent } from './editshift/editshift.component';
import { ProfileComponent } from './profile/profile.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'editshift/:id', component: EditShiftComponent },
    { path: 'home', component: HomeComponent, },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'shifts', component: ShiftsComponent, },
    { path: 'addshift', component: AddshiftComponent, },
    { path: 'editshift', component: EditShiftComponent, },
    { path: 'profile', component: ProfileComponent, },
    { path: 'editshift/:id', component: EditShiftComponent, },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }