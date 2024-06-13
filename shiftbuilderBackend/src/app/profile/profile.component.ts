import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})


export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  message: string = '';
  currentUser: any;
  changePasswordMode = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private auth: Auth, private firestore: Firestore, private router: Router) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required, this.ageValidator]],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(
      user => {
        this.currentUser = user;
        this.profileForm.patchValue({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          birthDate: new Date(user.birthDate).toISOString().substring(0, 10)
        });
      },
      error => {
        console.error('Failed to fetch user profile', error);
      }
    );
  }

  onUpdate() {
    if (this.profileForm.valid) {
      const { email, firstName, lastName, birthDate } = this.profileForm.value;
      this.authService.updateUserProfile({ email, firstName, lastName, birthDate }).subscribe(
        () => {
          this.message = 'Profile updated successfully';
          setTimeout(() => {
            this.message = '';
          }, 2000);
        },
        error => {
          this.message = 'Failed to update profile';
        }
      );
    } else {
      this.markFormFieldsAsTouched(this.profileForm);
    }
  }

  onDelete() {
    this.authService.deleteUserProfile().subscribe(
      () => {
        this.message = 'Account deleted successfully';
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 1000);
      },
      error => {
        this.message = 'Failed to delete account';
      }
    );
  }

  ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const birthDate = new Date(control.value);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 6 && age <= 130 ? null : { ageRange: true };
  }

  toggleChangePasswordMode() {
    this.changePasswordMode = !this.changePasswordMode;

    if (!this.changePasswordMode) {
      this.passwordForm.reset();
      this.message = '';
    }
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      const { oldPassword, newPassword } = this.passwordForm.value;
      this.authService.changePassword(oldPassword, newPassword).subscribe(
        () => {
          this.message = 'Password changed successfully';
          setTimeout(() => {
            this.message = '';
            this.passwordForm.reset();
            this.toggleChangePasswordMode();
          }, 2000);
        },
        error => {
          this.passwordForm.get('oldPassword')?.setErrors({ incorrectPassword: true });
        }
      );
    } else {
      this.markFormFieldsAsTouched(this.passwordForm);
    }
  }

  private markFormFieldsAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
