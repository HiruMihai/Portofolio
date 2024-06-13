import { Component, OnInit } from '@angular/core';
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

export class ShiftsComponent implements OnInit {
  shifts: any[] = [];
  bestMonth: string = '';
  bestMonthProfit: number | string = 0;
  searchForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      workplace: ['any'],
      start: [''],
      end: ['']
    });
  }

  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts(): void {
    this.authService.getShifts().subscribe(data => {
      this.shifts = data.map(shift => {
        const start = this.convertTimeToNumber(shift.start);
        const end = this.convertTimeToNumber(shift.end);
        const wage = Number(shift.wage);
        const profit = !isNaN(start) && !isNaN(end) && !isNaN(wage) ? (end - start) * wage : 0;
        return {
          ...shift,
          formattedDate: new Date(shift.date).toLocaleDateString(),
          profit: profit.toFixed(0)
        };
      });

      this.shifts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      this.calculateBestMonth();
    });
  }



  filterShifts() {
    const filters = this.searchForm.value;
    this.authService.getShifts().subscribe(
      (shifts: any[]) => {
        const allShifts = shifts.map(shift => {
          const start = this.convertTimeToNumber(shift.start);
          const end = this.convertTimeToNumber(shift.end);
          const wage = Number(shift.wage);
          const profit = !isNaN(start) && !isNaN(end) && !isNaN(wage) ? (end - start) * wage : 0;
          return {
            ...shift,
            formattedDate: new Date(shift.date).toLocaleDateString(),
            profit: profit.toFixed(0)
          };
        });

        this.shifts = allShifts.filter(shift => {
          const matchesWorkplace = filters.workplace === 'any' || shift.workplace === filters.workplace;
          const startDateMatch = !filters.start || new Date(shift.date) >= new Date(filters.start);
          const endDateMatch = !filters.end || new Date(shift.date) <= new Date(filters.end);
          return matchesWorkplace && startDateMatch && endDateMatch;
        });

        this.shifts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },
      error => {
        console.error('Error loading shifts:', error);
      }
    );
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
    this.router.navigate(['/editshift', shift._id]);
  }

  deleteShift(shift: any) {
    this.authService.deleteShift(shift._id).subscribe(
      () => {
        this.shifts = this.shifts.filter(s => s._id !== shift._id);
        this.calculateBestMonth();
      },
      error => {
        console.error(`Error deleting shift: ${error.message}`);
      }
    );
  }

  calculateBestMonth() {
    const monthlyProfits: { [key: string]: number } = {};

    this.shifts.forEach(shift => {
      const date = new Date(shift.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' }); // Get month and year for better differentiation

      if (!monthlyProfits[monthYear]) {
        monthlyProfits[monthYear] = 0;
      }

      const profit = parseFloat(shift.profit) || 0;
      monthlyProfits[monthYear] += profit;
    });

    let bestMonth = '';
    let maxProfit = 0;
    for (const monthYear in monthlyProfits) {
      if (monthlyProfits[monthYear] > maxProfit) {
        maxProfit = monthlyProfits[monthYear];
        bestMonth = monthYear;
      }
    }

    this.bestMonth = bestMonth;
    this.bestMonthProfit = maxProfit.toFixed(0);
  }

  convertTimeToNumber(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + minutes / 60;
  }
}