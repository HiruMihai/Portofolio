import { Component, OnInit } from '@angular/core';
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

export class HomeComponent implements OnInit {
  shifts: any[] = [];
  bestMonth: string = '';
  bestMonthProfit: number | string = 0;
  upcomingShifts: any[] = [];
  pastWeekShifts: any[] = [];
  bestMonthShifts: any[] = [];

  constructor(private authService: AuthService) { }

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

      this.sortShiftsByDate();
      this.loadUpcomingShifts();
      this.loadPastWeekShifts();
      this.calculateBestMonth();
    });
  }

  sortShiftsByDate(): void {
    this.shifts.sort((a: any, b: any) => {
      const dateA: Date = new Date(a.date);
      const dateB: Date = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }

  loadUpcomingShifts(): void {
    const currentDate = new Date();
    this.upcomingShifts = this.shifts.filter(shift => new Date(shift.date) >= currentDate);
  }

  loadPastWeekShifts(): void {
    const currentDate = new Date();
    const pastWeekStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
    this.pastWeekShifts = this.shifts.filter(shift =>
      new Date(shift.date) >= pastWeekStartDate && new Date(shift.date) < currentDate
    );
  }

  calculateBestMonth(): void {
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

    this.bestMonthShifts = this.shifts.filter(shift => {
      const shiftMonthYear = new Date(shift.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      return shiftMonthYear === bestMonth;
    });
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