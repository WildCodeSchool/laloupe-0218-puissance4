import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';


const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'mainmenu', component: MainmenuComponent },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainmenuComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  providers: [AngularFireAuth],
  bootstrap: [AppComponent],



})
export class AppModule { }
