import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { GameComponent } from './game/game.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';


const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'mainmenu', component: MainmenuComponent },
  { path: 'matchmaking', component: MatchmakingComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'game/:id/:username', component: GameComponent },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainmenuComponent,
    GameComponent,
    MatchmakingComponent,
    ProfileComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true },
    ),
    FormsModule,
  ],
  providers: [AngularFireAuth, AngularFirestore, AuthService],
  bootstrap: [AppComponent],



})
export class AppModule { }
