import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { doc, setDoc } from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-editshift',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule,],
  templateUrl: './editshift.component.html',
  styleUrl: './editshift.component.css'
})

export class EditShiftComponent implements OnInit {
  shiftForm: FormGroup;
  shiftId!: string;
  message: string = '';
  successClass: boolean = false;
 
  constructor(private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute, private router: Router, private auth: Auth, private firestore: Firestore) {

    this.shiftForm = this.fb.group({
      Date: [''],
      start: [''],
      end: [''],
      wage: [''],
      workplace: [''],
      name: [''],
      comments: [''],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.shiftId = idParam !== null ? idParam : '';
      this.loadShiftData();
    });
  }

  async loadShiftData() {
    try {
      if (this.shiftId) {
        const shift = await this.authService.getShiftById(this.shiftId);
        if (shift) {
    
          this.shiftForm.patchValue({
            Date: shift['Date'] || '', 
            start: shift['start'] || '',
            end: shift['end'] || '', 
            wage: shift['wage'] || '', 
            workplace: shift['workplace'] || '',
            name: shift['name'] || '',
            comments: shift['comments'] || '',
          });

        } else {
          console.error('Shift not found');
        }
      }
    } catch (error) {
      console.error('Error loading shift data:', error);
    }
  }

  onSubmit() {
    if (this.shiftForm.valid) {
      const shiftData = this.shiftForm.value;
      const userId = this.auth.currentUser?.uid;
      const shiftDocRef = doc(this.firestore, `users/${userId}/shifts/${this.shiftId}`);
  
      setDoc(shiftDocRef, shiftData)
        .then(() => {
          this.message = 'Shift saved successfully';
          this.successClass = true;
  
          setTimeout(() => {
            this.successClass = false;
            this.shiftForm.reset();
            this.router.navigate(['/shifts']);
          }, 2000);
        })
        .catch((error: any) => {
          this.message = `Error saving shift: ${error.message}`;
        });
    }
  }
}
