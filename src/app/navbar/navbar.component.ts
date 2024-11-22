import { Component } from '@angular/core';
import { StudentService } from '../student.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(
    private studentService: StudentService
  ) {}
  
  logout(): void {
    this.studentService.logout(); // Assuming this returns the student object
  }
}
