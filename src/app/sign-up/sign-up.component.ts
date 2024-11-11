import { Component } from '@angular/core';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';
import { Student } from '../student.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  student: Student = new Student('', '', '', '');
  confirmPassword: string = '';

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  onSubmit(form: any) {
  if (form.valid && this.student.password === this.confirmPassword) {
    console.log({
      username: this.student.username, 
      password: this.student.password,
      firstName: this.student.firstName,
      lastName: this.student.lastName
    });    
    this.studentService.registerStudent({
      username: this.student.username, 
      password: this.student.password,
      firstName: this.student.firstName,
      lastName: this.student.lastName
    }).subscribe({
      next: (response) => {
        console.log('Registration successful!', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      }
    });
  } else {
    console.log('Form is invalid or passwords do not match!');
  }
}

}
