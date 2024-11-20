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
    const clubName = this.route.snapshot.paramMap.get('clubName');
    if (clubName) {
      this.clubService.getClubs().subscribe((data) => {
        this.club = data.find((c) => c.clubName === clubName);
      });
    }
  }
}

