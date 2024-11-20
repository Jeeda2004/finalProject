import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Club } from './club.model'; // Adjust the path to your interface

@Injectable({
    providedIn: 'root',
})
export class ClubService {
    private apiUrl = 'http://localhost:5000/clubs';

    constructor(private http: HttpClient) {}

    getClubs(): Observable<Club[]> {
        return this.http.get<Club[]>(this.apiUrl);
    }

    getClubByName(club_name: string): Observable<Club> {
        return this.http.get<Club>(`${this.apiUrl}/${club_name}`);
    }
}



