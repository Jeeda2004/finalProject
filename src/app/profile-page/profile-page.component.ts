import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  clubs: any[] = [];

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    console.log('ProfilePageComponent initialized'); // Check if component initializes
  
    const storedStudent = this.studentService.getSession();
    console.log('Stored student:', storedStudent); // Check LocalStorage retrieval
  
    if (storedStudent) {
      this.firstName = storedStudent.firstName;
      this.lastName = storedStudent.lastName;
      this.username = storedStudent.username;
      console.log('Profile data:', this.firstName, this.lastName, this.username);
  
      // Fetch clubs joined by the student using the username
      this.studentService.getStudentClubs(this.username).subscribe(
        (response) => {
          this.clubs = response;
          console.log('Clubs:', this.clubs); // Verify if clubs are retrieved
        },
        (error) => {
          console.log('Error fetching clubs:', error);
        }
      );
    } else {
      console.log('No stored student found');
    }
  }
  
  
  
}
