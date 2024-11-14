export class Club {
    clubName: string = '';
    clubHead: string = '';
    logo: string = '';
    description: string = '';
  
    constructor(clubName: string, clubHead: string, logo: string, description: string) {
      this.clubName = clubName;
      this.clubHead = clubHead;
      this.logo = logo;
      this.description = description;
    }
  }
  