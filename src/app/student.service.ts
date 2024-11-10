import { Injectable, OnInit } from '@angular/core';
import { Student } from './student.model';
@Injectable({
  providedIn: 'root'
})
export class StudentService{
  private students: Student[]=[];
  private currentStudent: Student | null=null;
  constructor(){}

  setCurrentStudent(student: Student): void {
    this.currentStudent = student;
  }

  getCurrentStudent(): Student | null {
    return this.currentStudent;
  }


  registerStudent(student: Student): string {
    this.students.push(student); // Add the student to the array
    this.setCurrentStudent(student);
    console.log('Mock Registration Successful!', student);
    return 'Mock Registration Successful!';
  }
  
  getAllStudents(): Student[] {
    return this.students;
  }

  getStudentByEmail(email: string): Student | undefined {
    return this.students.find((student) => student.email === email);
  }


  getStudentFullName(email: string): string | undefined {
    const student = this.getStudentByEmail(email);
    return student ? `${student.firstName} ${student.lastName}` : undefined;
  }
}
