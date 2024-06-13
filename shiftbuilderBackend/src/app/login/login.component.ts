import { Component, OnInit } from '@angular/core';
import { AuthCredential } from 'firebase/auth';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginComponent, ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  loginForm: FormGroup;
  message: string = '';

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private auth: Auth) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe(
        (response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.message = 'Authentication successful';
            this.router.navigate(['/home']);
          } else {
            this.message = 'Authentication failed';
          }
        },
        (error) => {
          this.message = 'Authentication failed';
        }
      );
    }
  }

  onLoginSuccess() {
    this.router.navigate(['/home']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}