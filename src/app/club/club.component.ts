import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClubService } from '../club.service';
import { Club } from '../club.model';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css'],
})
export class ClubComponent implements OnInit {
  club: Club | undefined;

  constructor(
    private clubService: ClubService,
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const club_name = this.route.snapshot.paramMap.get('club_name');
    if (club_name) {
      this.clubService.getClubByName(club_name).subscribe(
        (data) => {
          this.club = data;
        },
        (error) => {
          console.error('Error fetching club:', error);
        }
      );
    }
  }

 
  joinClub(): void {
    const student = this.studentService.getSession(); // Assuming this returns the student object
    if (!student || !student.username) {
        alert('Please log in to join the club.');
        return;
    }

    if (this.club?.club_name) {
      this.clubService.joinClub(this.club.club_name, student.username).subscribe({
        next: (response) => alert('You have successfully joined the club!'),
        error: (error) => alert('Error joining club: ' + error.message)
      });
    }
  }
}
