import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  user;
  name: string;
  authstate;

  constructor(private afAuth: AngularFireAuth) {
    this.authstate = this.afAuth.authState;

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        this.name = user.displayName;
      } else {
        this.user = null;
      }
      console.log(this.user);
    });
  }
}
