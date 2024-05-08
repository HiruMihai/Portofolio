import { Component, NgModule } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { AppRoutingModule } from '../app.routes';
import { AuthGuard } from '../auth.guard';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, NgIf, CommonModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registerForm: FormGroup;
  message: string = '';

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]], 
      confirmPassword: ['', [Validators.required]], 
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required, this.ageValidator]],
    }, { validators: this.passwordMatchValidator });
  }

  onSubmit() {

    const passwordControl = this.registerForm.get('password');
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
  
    if (passwordControl?.value === confirmPasswordControl?.value) {
      if (this.registerForm.valid) {
        const { email, password, firstName, lastName, birthDate } = this.registerForm.value;
  
        this.authService.register(email, password, firstName, lastName, birthDate)
          .then(
            (userCredential) => {
              this.message = 'Registration successful';
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 2000);
            },
            (error) => {
              this.message = 'Registration failed';
            }
          );
      }
    } else {
      this.registerForm.setErrors({ passwordMismatch: true });
    }
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');
  
    if (passwordControl && confirmPasswordControl) {
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;
  
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
  
    return null;
  }
  
  ageValidator(control: { value: string }) {
    const birthDate = new Date(control.value);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    if (age < 6 || age > 130) {
      return { invalidAge: true };
    }
    return null;
  }
}

