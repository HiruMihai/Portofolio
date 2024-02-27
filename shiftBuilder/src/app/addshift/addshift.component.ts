import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ShiftsComponent } from '../shifts/shifts.component';
import { AuthService } from '../auth.service';
import { LoginComponent } from '../login/login.component';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-addshift',
  standalone: true,
  imports: [ShiftsComponent, FormsModule, ReactiveFormsModule, LoginComponent, NgClass, CommonModule],
  templateUrl: './addshift.component.html',
  styleUrl: './addshift.component.css'
})
export class AddshiftComponent {
  shiftForm: FormGroup;
  message: string = '';
  successClass: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private auth: Auth, private firestore: Firestore) {

    this.shiftForm = this.fb.group({
      Date: ['', Validators.required],        
      start: ['', Validators.required],       
      end: ['', Validators.required],        
      wage: ['', Validators.required],       
      workplace: ['', Validators.required],   
      name: ['', Validators.required],        
      comments: ['', Validators.required],    
    });
  }

  onSubmit() {
    if (!this.shiftForm.valid) {
      return;
    }
  
    const userId = this.auth.currentUser?.uid;
    const shiftsCollectionRef = collection(this.firestore, `users/${userId}/shifts`);
    const shiftData = this.shiftForm.value;
  
    addDoc(shiftsCollectionRef, shiftData)
      .then(() => {
        this.handleSuccess();
      })
      .catch((error) => {
        this.handleError(new Error('Failed to save shift data'));
      });
  }
  
  private handleSuccess() {
    this.message = 'Shift saved successfully';
    this.successClass = true;
  
    setTimeout(() => {
      this.successClass = false;
      this.shiftForm.reset();
      this.message = '';
    }, 2000);
  }
  
  private handleError(error: any) {
    this.message = `Error saving shift: ${error.message}`;
  }
}  