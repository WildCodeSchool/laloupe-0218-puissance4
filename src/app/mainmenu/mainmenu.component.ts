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

  idUser;
  user;
  ok;

  ngOnInit() {

    this.afAuth.authState.subscribe((authState) => {
      if (authState == null) {
        this.router.navigate(['/']);
      }
      this.idUser = authState.uid;
      this.db
        .doc('users/' + authState.uid)
        .valueChanges()
        .subscribe((user) => {
          this.user = user;
          this.ok = true;
        });

    });
  }

  googleSignIn() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  signOut() {
    this.afAuth.auth.signOut();
  }

  createGame() {
    if (this.ok === true) {
      this.takeData();
      this.router.navigate(['matchmaking']);
    }
  }
  profile() {
    if (this.ok === true) {
      this.takeData();
      this.router.navigate(['profile']);
    }
  }

  takeData() {
    if (!this.user) {
      const user = {
        name: this.authService.user.displayName,
        img: this.authService.user.photoURL,
        uid: this.authService.user.uid,
        nbrGame: 0,
        nbrWins: 0,
        nbrLoose: 0,
        nbrEqual: 0,
        levels: 1,
      };
      this.db.doc('users/' + this.authService.user.uid).set(user);
    }
  }
}
