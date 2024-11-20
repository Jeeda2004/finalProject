import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../club.model';

@Component({
    selector: 'app-club-list',
    templateUrl: './club-list.component.html',
    styleUrls: ['./club-list.component.css']
})
export class ClubListComponent implements OnInit {
    clubs: Club[] = [];

    constructor(private clubService: ClubService) {}

    ngOnInit() {
        this.clubService.getClubs().subscribe((data: Club[]) => {
            this.clubs = data; // No TS2696 error now
        });
    }
}

