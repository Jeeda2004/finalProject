import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from './student.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:5000'; // URL to web api

  constructor(private http: HttpClient, private router: Router) {}

  registerStudent(student: Student): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, student);
  }

  loginStudent(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, {username, password});
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students`);
  }

  getCurrentStudent(): Student | null {
    const studentData = localStorage.getItem('currentStudent');
    return studentData ? JSON.parse(studentData) as Student : null;
  }

  setSession(student: any): void {
    localStorage.setItem('currentStudent', JSON.stringify(student));
  }

  logout(): void {
    localStorage.removeItem('currentStudent');
    this.router.navigate(['/login']);
  }
}
