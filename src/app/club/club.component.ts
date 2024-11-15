import { Component , OnInit} from '@angular/core';
import { Club } from '../club.model';
import { ClubService } from '../club.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrl: './club.component.css'
})
export class ClubComponent implements OnInit{
  club: Club | undefined;

  constructor(private route: ActivatedRoute, private clubService: ClubService){}

  ngOnInit():void{
    const clubName=this.route.snapshot.paramMap.get('clubName');

    if (clubName){
      this.club=this.clubService.getClubs().find(c => c.clubName === clubName);
    }
  }
}
