import { AuthService } from './../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { User } from '../models/user';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css'],
})
export class MainmenuComponent implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService,
    private db: AngularFirestore,
  ) {
  }

  user = new User();

  ngOnInit() {
    this.afAuth.authState.subscribe((authState) => {
      if (authState == null) {
        this.router.navigate(['/']);
      }
    });
    this.takeData()
  }

  googleSignIn() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  signOut() {
    this.afAuth.auth.signOut();
  }

  createGame() {
    this.router.navigate(['matchmaking']);
  }
  profile() {
    this.router.navigate(['profile']);
  }

  takeData() {
    this.user.name = this.authService.name;
    this.user.img = this.authService.img;
    this.user.uid = this.authService.uid;
    this.user.nbrGame = 0;
    this.user.nbrWins = 0;
    this.user.nbrLoose = 0;
    this.db.doc('users/' + this.user.uid).update(JSON.parse(JSON.stringify(this.user)));
  }
}
