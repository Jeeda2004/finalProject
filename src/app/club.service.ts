import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Club } from './club.model';

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(`${this.apiUrl}/clubs`);
  }

  getClubByName(club_name: string): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/clubs/${club_name}`);
  }

  joinClub(clubName: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/join_club/${clubName}`, { username: username });
  }

  getClubMembers(club_name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clubs/${club_name}/members`);
  }
  


}
