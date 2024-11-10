import { Component } from '@angular/core';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';
import { Student } from '../student.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  student: Student=new Student('','','','');
  confirmPassword:string='';


  constructor(
    private studentService: StudentService,
    private router: Router
  ){}
  
  onSubmit(form: any) {
    if (!form.valid) {
      console.log('Form is invalid!');
      return;
    }

    if (this.student.password !== this.confirmPassword) {
      console.log('Passwords do not match!');
      return;
    }

    // Register the student
    this.studentService.registerStudent(this.student);

    // Redirect to the home page (or wherever you need)
    console.log('Registration Successful!');
    this.router.navigate(['/home']);
  }
}
