import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from './student.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient, private router: Router) {}

  // Register a new student
  registerStudent(student: Student): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, student)
      .pipe(
        tap((response: any) => {
          if (response && response.message === 'Student registered successfully') {
            // Set the session on the backend after successful registration
            const studentData = {
              firstName: response.first_name,
              lastName: response.last_name,
              username: response.username
            };
            // Save student data to localStorage
            localStorage.setItem('currentStudent', JSON.stringify(studentData));
          }
        })
      );
  }

  // Login student and store session
  loginStudent(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap((response: any) => {
          if (response && response.message === 'Login successful') {
            // On successful login, store the student data in localStorage
            const studentData = {
              firstName: response.first_name,
              lastName: response.last_name,
              username: response.username
            };
            localStorage.setItem('currentStudent', JSON.stringify(studentData)); // Store student data in localStorage
          
          }
        })
      );
  }

  // Fetch current logged-in student
  // Angular service method to get current student
  getCurrentStudent(): Observable<any> {
    return this.http.get<Student>(`http://localhost:5000/current_student`, { withCredentials: true });
  }


  // Retrieve current student session from localStorage
  getSession(): Student | null {
    const studentData = localStorage.getItem('currentStudent');
    return studentData ? JSON.parse(studentData) : null;
  }

  // Logout student
  logout(): void {
    localStorage.removeItem('currentStudent'); // Remove the session data from localStorage
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Retrieve all students (if needed)
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students`);
  }
}
