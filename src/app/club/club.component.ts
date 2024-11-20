import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClubService } from '../club.service';
import { Club } from '../club.model';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css'],
})
export class ClubComponent implements OnInit {
  club: Club | undefined;

  constructor(
    private clubService: ClubService,
    private route: ActivatedRoute
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

}

