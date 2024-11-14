import { Injectable } from '@angular/core';
import { Club } from './club.model';
@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor() { }
  
  getClubs(): Club[]{
    const Clubs: Club[] =[
      {clubName:'yMath', clubHead: 'Farkh Leka', logo:'assets/logos/math.jpg',description:'This is a math club'},
      {clubName:'cScience', clubHead: 'Sara Zako', logo:'assets/logos/science.jpg',description:'This is a science club'}
    ] 
      return Clubs;
  }

}
