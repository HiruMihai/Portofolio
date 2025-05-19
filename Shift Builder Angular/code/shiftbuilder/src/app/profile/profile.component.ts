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

  ngOnInit() {
    const currentUser = this.auth.currentUser;

    if (currentUser) {
      this.currentUser = currentUser;
      this.populateForm();
    }
  }

  populateForm() {
    this.authService.getFormData(this.currentUser.uid).then(formData => {
      setTimeout(() => {
        this.profileForm.patchValue({
          email: formData.email || this.currentUser.email,
          firstName: formData.firstName || this.currentUser.firstName || '',
          lastName: formData.lastName || this.currentUser.lastName || '',
          birthDate: formData.birthDate || this.currentUser.birthDate || '',
        });
      });
    });
  }
  
  onUpdate() {
    if (this.profileForm.valid) {
      const { email, firstName, lastName, birthDate } = this.profileForm.value;
      const userId = this.currentUser.uid;

      const userDocRef = doc(this.firestore, 'users', userId);
      const formDataCollectionRef = collection(this.firestore, `users/${userId}/formData`);
      const formDataDocRef = doc(formDataCollectionRef, userId);

      Promise.all([
        setDoc(userDocRef, { email, firstName, lastName, birthDate }, { merge: true }),
        setDoc(formDataDocRef, { email, firstName, lastName, birthDate }, { merge: true })
      ])
        .then(() => {
          this.message = 'Profile updated successfully';
          setTimeout(() => {
            this.message = '';
          }, 2000);
        })
        .catch(error => {
          this.message = 'Failed to update profile';
        });
    } else {
      this.markFormFieldsAsTouched(this.profileForm);
    }
  }


  onDelete() {
    const performDeletion = async () => {
      try {
        if (this.currentUser && this.currentUser.uid) {
          const shiftsCollectionRef = collection(this.firestore, `users/${this.currentUser.uid}/shifts`);
          const shiftsQuerySnapshot = await getDocs(shiftsCollectionRef);

          for (const docSnapshot of shiftsQuerySnapshot.docs) {
            await deleteDoc(docSnapshot.ref);
          }

          const formDataCollectionRef = collection(this.firestore, `users/${this.currentUser.uid}/formData`);
          const formDataQuerySnapshot = await getDocs(formDataCollectionRef);

          for (const docSnapshot of formDataQuerySnapshot.docs) {
            await deleteDoc(docSnapshot.ref);
          }

          const userDocRef = doc(this.firestore, `users/${this.currentUser.uid}`);
          await deleteDoc(userDocRef);

          if (this.auth.currentUser) {
            await this.auth.currentUser.delete();
          }

          this.currentUser = null;
          this.profileForm.reset();
          this.message = 'Account deleted successfully';
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 1000);
        }
      } catch (error) {
        this.message = 'Failed to delete account';
      }
    };

    performDeletion();
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
      const oldPasswordControl = this.passwordForm.get('oldPassword');

      if (oldPasswordControl) {
        const { oldPassword, newPassword } = this.passwordForm.value;

        this.authService.updatePassword(oldPassword, newPassword)
          .then(() => {
            this.message = 'Password changed successfully';

            setTimeout(() => {
              this.message = '';
              this.passwordForm.reset();
              this.toggleChangePasswordMode();
            }, 2000);
          })
          .catch(error => {
            oldPasswordControl.setErrors(null);
            oldPasswordControl.setErrors({ incorrectPassword: true });
          });
      }
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
