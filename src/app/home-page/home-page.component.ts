import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { Student } from '../student.model';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  fullName: string = ''; // Variable to store the full name of the current student

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    // Retrieve the current student from the service
    const currentStudent: Student | null = this.studentService.getCurrentStudent();

    // If a current student exists, set their full name
    if (currentStudent) {
      this.fullName = `${currentStudent.firstName} ${currentStudent.lastName}`;
    } else {
      this.fullName = 'Guest'; // Fallback for when no student is logged in
    }
  }
}