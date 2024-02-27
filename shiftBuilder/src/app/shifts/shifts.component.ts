import { Component } from '@angular/core';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { AuthService } from '../auth.service';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FirestoreModule } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [NgFor, CommonModule, FirestoreModule, ReactiveFormsModule],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent {
  shifts: any[] = []; 
  currentUser: any;
  bestMonth: string = ''; 
  bestMonthProfit: number | string = 0; 
  searchForm: FormGroup; 

  constructor(private authService: AuthService, private firestore: Firestore, private router: Router, private fb: FormBuilder, private auth: Auth) {
    this.searchForm = this.fb.group({ 
      workplace: ['any'], 
      start: [''], 
      end: [''] 
    });
  }

  filterShifts() {
    const filters = this.searchForm.value; 

    this.loadShifts().then(() => {
      this.shifts = this.shifts.filter(shift => {
        const matchesWorkplace = filters.workplace === 'any' || shift.workplace === filters.workplace; 

        const startDateMatch = !filters.start || new Date(shift.Date) >= new Date(filters.start); 
        const endDateMatch = !filters.end || new Date(shift.Date) <= new Date(filters.end); 

        return matchesWorkplace && startDateMatch && endDateMatch;
      });
    });
  }

  clearSearch() { 
    this.searchForm.reset({
      workplace: 'any',
      start: '',
      end: ''
    });

    this.loadShifts();
  }

  editShift(shift: any) { 
    this.router.navigate(['/editshift', shift.id]);
  }

  async deleteShift(shift: any) {
    try {
      const user = this.auth.currentUser;
  
      if (user) {
        const userId = user.uid;
        const shiftDocRef = doc(this.firestore, `users/${userId}/shifts/${shift.id}`);
        await deleteDoc(shiftDocRef);
  
        this.shifts = this.shifts.filter(s => s.id !== shift.id);
  
        this.calculateBestMonth();
      } else {
        console.error('No authenticated user');
      }
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  }
  

  ngOnInit() { 
    this.loadShifts();
  }

  async loadShifts() {
    try {
      const user = this.auth.currentUser;
  
      if (user) {
        const userId = user.uid;
        const shiftsCollectionRef = collection(this.firestore, `users/${userId}/shifts`);
        const querySnapshot = await getDocs(shiftsCollectionRef);
  
        this.shifts = [];
  
        querySnapshot.forEach((doc) => {
          const shiftData: any = { id: doc.id, ...doc.data() };
          shiftData.profit = Math.round((this.convertTimeToNumber(shiftData.end) - this.convertTimeToNumber(shiftData.start)) * Number(shiftData.wage));
          this.shifts.push(shiftData);
        });
  
        this.shifts.sort((a: any, b: any) => {
          const dateA: Date = new Date(a.Date);
          const dateB: Date = new Date(b.Date);
          return dateA.getTime() - dateB.getTime();
        });
  
        this.calculateBestMonth();
      }
    } catch (error) {
      console.error('Error loading shifts:', error);
    }
  }
  

  calculateBestMonth() { 
    const monthlyProfits: { [key: string]: number } = {};

    this.shifts.forEach((shift) => { 
      const month = new Date(shift.Date).toLocaleString('default', { month: 'long' }); 

      const start = this.convertTimeToNumber(shift.start);
      const end = this.convertTimeToNumber(shift.end); 
      const wage = Number(shift.wage); 

      if (!isNaN(start) && !isNaN(end) && !isNaN(wage)) { 
        const profit = (end - start) * wage;

        if (monthlyProfits[month]) {
          monthlyProfits[month] += profit;
        } else {
          monthlyProfits[month] = profit;
        }
      }
    });

    let maxProfit = 0;
    let bestMonth = ''; 
    for (const month in monthlyProfits) { 
      if (monthlyProfits[month] > maxProfit) {
        maxProfit = monthlyProfits[month]; 
        bestMonth = month; 
      }
    }

    this.bestMonth = bestMonth; 
    this.bestMonthProfit = maxProfit;
  }

  convertTimeToNumber(timeString: string): number { 
    const [hours, minutes] = timeString.split(':').map(Number); 
    return hours + minutes / 60;
  }
}
