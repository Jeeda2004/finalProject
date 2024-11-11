import { Component } from '@angular/core';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  onSubmit(form: any) {
    if (form.valid) {
      console.log({
        username: this.username,
        password: this.password
      });

      // Send login request to the backend
      this.studentService.loginStudent(this.username, this.password).subscribe({
        next: (response) => {
          console.log('Login successful!', response);

          // Store the student data in localStorage after successful login
          const studentData = {
            firstName: response.first_name,
            lastName: response.last_name,
            username: response.username
          };

          // Store the session in localStorage
          localStorage.setItem('currentStudent', JSON.stringify(studentData));

          // Navigate to home page on successful login
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Show an error message or alert
        }
      });
    } else {
      console.log('Form is invalid!');
    }
  }
}
