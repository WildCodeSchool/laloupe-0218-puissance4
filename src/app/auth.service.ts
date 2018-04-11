import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    user;
  name: string;
  

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        // this.uid = user.uid;
        this.name = user.displayName;
        // this.img = user.photoURL;
        this.user.nbrGame = 0;
        this.user.nbrWins = 0;
        this.user.nbrLoose = 0;
      } else {
        this.user = null;
        // this.uid = null;
        // this.name = null;
      }
    });
  }
}
