export class Club {
    club_name: string = '';
    club_head: string = '';
    logo: string = '';
    description: string = '';
  
    constructor(club_name: string, club_head: string, logo: string, description: string) {
      this.club_name = club_name;
      this.club_head = club_head;
      this.logo = logo;
      this.description = description;
    }
  }
  