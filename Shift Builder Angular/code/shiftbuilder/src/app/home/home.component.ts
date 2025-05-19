import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ShiftsComponent } from '../shifts/shifts.component';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { collection, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent {

  shifts: any[] = [];
  bestMonth: string = '';
  bestMonthProfit: number | string = 0;
  upcomingShifts: any[] = [];
  pastWeekShifts: any[] = [];
  bestMonthShifts: any[] = [];


  constructor(private authService: AuthService) { }

  
  ngOnInit() {
    this.loadShifts();
  }

 
  loadShifts() {
  
    this.authService.loadShiftsData().subscribe(
    
      (shifts: any[]) => {
        this.shifts = shifts;
        this.sortShiftsByDate();
        this.loadUpcomingShifts();
        this.loadPastWeekShifts();
        this.calculateBestMonth();
        this.shifts.forEach(shift => {
          shift.profit = this.calculateProfit(shift.start, shift.end, shift.wage);
        });
      },
      error => {
        console.error('Error loading shifts:', error);
      }
    );
  }
  
  sortShiftsByDate() {
    this.shifts.sort((a: any, b: any) => {
      const dateA: Date = new Date(a.Date);
      const dateB: Date = new Date(b.Date);
      return dateA.getTime() - dateB.getTime();
    });
  }

  loadUpcomingShifts() {
    const currentDate = new Date();
    this.upcomingShifts = this.shifts.filter(shift => new Date(shift.Date) >= currentDate);
  
    this.upcomingShifts.forEach(shift => {
      shift.profit = this.calculateProfit(shift.start, shift.end, shift.wage);
    });
  
    this.upcomingShifts.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
  }

  loadPastWeekShifts() {
    const currentDate = new Date();
    const pastWeekStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
    this.pastWeekShifts = this.shifts.filter(shift =>
      new Date(shift.Date) >= pastWeekStartDate && new Date(shift.Date) < currentDate
    );
  
    this.pastWeekShifts.forEach(shift => {
      shift.profit = this.calculateProfit(shift.start, shift.end, shift.wage);
    });
  
    this.pastWeekShifts.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
  }
  
  calculateBestMonth() {
    const monthlyProfits: { [key: string]: number } = {};
  
    this.shifts.forEach((shift) => {
      const month = new Date(shift.Date).toLocaleString('default', { month: 'long' });
  
      const start = this.convertTimeToNumber(shift.start);
      const end = this.convertTimeToNumber(shift.end);
      const wage = Number(shift.wage);
  
      if (!isNaN(start) && !isNaN(end) && !isNaN(wage)) {
        const profit = this.calculateProfit(shift.start, shift.end, shift.wage);
  
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
  
    const bestMonthNumeric = new Date(Date.parse('01 ' + this.bestMonth + ' 2000')).getMonth() + 1;
  
    this.bestMonthShifts = this.shifts.filter(shift => {
      const shiftMonth = new Date(shift.Date).getMonth() + 1;
      return shiftMonth === bestMonthNumeric;
    });
  
    this.bestMonthShifts.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
  }
  
  calculateProfit(start: string, end: string, wage: string): number {
    const startTime = this.convertTimeToNumber(start);
    const endTime = this.convertTimeToNumber(end);
    const hourlyWage = Number(wage);
  
    return Math.round((endTime - startTime) * hourlyWage);
  }
  
  convertTimeToNumber(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + minutes / 60;
  }
}
