import { Injectable } from '@angular/core';
import { Auth, reauthenticateWithCredential } from '@angular/fire/auth';
import { EmailAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { Observable, Subject, catchError, from, map, of, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = "http://localhost:3000/api"
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private auth: Auth) { }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('token');
    return new Observable(observer => {
      if (token) {
        this.http.get(`${this.apiUrl}/verifyToken`, { headers: { Authorization: `Bearer ${token}` } }).subscribe(
          () => observer.next(true),
          () => observer.next(false)
        );
      } else {
        observer.next(false);
      }
    });
  }

  loginEvent = new Subject<void>();

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.loginEvent.next();
        }
      })
    );
  }

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/profile`, { headers: { Authorization: `Bearer ${token}` } });
  }

  updateUserProfile(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/profile`, data, { headers: { Authorization: `Bearer ${token}` } });
  }

  deleteUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/profile`, { headers: { Authorization: `Bearer ${token}` } });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/profile/change-password`, { oldPassword, newPassword }, { headers: { Authorization: `Bearer ${token}` } });
  }


  getShiftById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/shifts/${id}`, { headers });
  }

  updateShift(id: string, shiftData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/shifts/${id}`, shiftData, { headers });
  }

  deleteShift(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/shifts/${id}`, { headers });
  }

  getShifts(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return of([]);
    }

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + `${token}`);
    console.log('Token:', token);
    console.log('Headers:', headers);

    const url = `${this.baseUrl}/shifts`;

    return this.http.get<any[]>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error loading shifts:', error);
        return of([]);
      })
    );
  }

  addShift(shiftData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': 'Bearer ' + token || '' };
    return this.http.post(`${this.baseUrl}/addShift`, shiftData, { headers });
  }

  register(user: { email: string, password: string, firstName: string, lastName: string, birthDate: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  authStateChange: any;

  updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user && user.email) {
      const credentials = EmailAuthProvider.credential(user.email, oldPassword);
      return reauthenticateWithCredential(user, credentials)
        .then(() => updatePassword(user, newPassword));
    } else {
      return Promise.reject(new Error('No authenticated user or user email is null'));
    }
  }
}
