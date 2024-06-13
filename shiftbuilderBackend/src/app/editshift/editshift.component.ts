import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';
import { Firestore, getDoc } from '@angular/fire/firestore';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.shiftForm = this.fb.group({
      date: [''],
      start: [''],
      end: [''],
      wage: [''],
      workplace: [''],
      name: [''],
      comments: [''],
    });
  }

  ngOnInit(): void {
    this.shiftId = this.route.snapshot.paramMap.get('id')!;
    this.loadShift();
  }

  loadShift() {
    this.authService.getShiftById(this.shiftId).subscribe(
      (shift) => {
        this.shiftForm.patchValue({
          date: new Date(shift.date).toISOString().substring(0, 10),
          start: shift.start,
          end: shift.end,
          wage: shift.wage,
          workplace: shift.workplace,
          name: shift.name,
          comments: shift.comments
        });
      },
      (error) => {
        this.message = `Error loading shift: ${error.message}`;
      }
    );
  }

  onSubmit() {
    if (this.shiftForm.valid) {
      const shiftData = this.shiftForm.value;
      this.authService.updateShift(this.shiftId, shiftData).subscribe(
        () => {
          this.message = 'Shift saved successfully';
          this.successClass = true;

          setTimeout(() => {
            this.successClass = false;
            this.router.navigate(['/shifts']);
          }, 2000);
        },
        (error) => {
          this.message = `Error saving shift: ${error.message}`;
        }
      );
    }
  }

  onDelete() {
    this.authService.deleteShift(this.shiftId).subscribe(
      () => {
        this.message = 'Shift deleted successfully';
        this.successClass = true;

        setTimeout(() => {
          this.successClass = false;
          this.router.navigate(['/shifts']);
        }, 2000);
      },
      (error) => {
        this.message = `Error deleting shift: ${error.message}`;
      }
    );
  }
}