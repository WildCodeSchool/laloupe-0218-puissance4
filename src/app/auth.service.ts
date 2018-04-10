import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  uid: string;
  name: string;
  img: string;
  nbrGame: number;
  nbrWins: number;
  nbrLoose: number;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.name = user.displayName;
        this.img = user.photoURL;
        this.nbrGame = 0;
        this.nbrWins = 0;
        this.nbrLoose = 0;
      } else {
        this.uid = null;
        this.name = null;
      }
    });
  }

  get authState() {
    return this.afAuth.authState;
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
