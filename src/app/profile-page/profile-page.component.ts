import { Component } from '@angular/core';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  
  constructor(private studentService: StudentService) {}

  ngOnInit() {
    // First check if student data is in localStorage
    const storedStudent = this.studentService.getSession(); 
    
    if (storedStudent) {
      // Use the data from localStorage if it exists
      this.firstName = storedStudent.firstName;
      this.lastName = storedStudent.lastName;
      this.username = storedStudent.username;
    } else {
      // If no session, fetch from backend
      this.studentService.getCurrentStudent().subscribe(
        (response) => {
          // Assuming your response contains first_name, last_name, username
          this.firstName = response.first_name;
          this.lastName = response.last_name;
          this.username = response.username;
        },
        (error) => {
          // Handle the error (no student is logged in)
          console.log('No student logged in', error);
        }
      );
    }
  }
}

