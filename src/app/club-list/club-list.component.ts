import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../club.model';
@Component({
  selector: 'app-club-list',
  templateUrl: './club-list.component.html',
  styleUrl: './club-list.component.css'
})
export class ClubListComponent implements OnInit {
  clubs: Club[]=[];
  ngOnInit(): void {this.getClubs();}
  constructor(private clubService: ClubService){}
  getClubs():void{
    this.clubs=this.clubService.getClubs()
  }
}
