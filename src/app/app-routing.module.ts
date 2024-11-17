import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { ClubListComponent } from './club-list/club-list.component';
import { ClubComponent } from './club/club.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
const routes: Routes = [
  { path: 'signup', component: SignUpComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'clubs', component: ClubListComponent },
  { path: 'club/:clubName', component: ClubComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: '', redirectTo: '/signup', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
