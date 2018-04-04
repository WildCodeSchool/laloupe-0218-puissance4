import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
  ) { }
  ngOnInit() {
    this.afAuth.authState.subscribe((authState) => {
      if (authState) {
        this.router.navigate(['mainmenu']);
        document.getElementById('invisible').style.display = 'signin';
      }
      if (authState == null) {
        document.getElementById('signout').style.display = 'none';
      }
    });
  }
  googleSignIn() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    const signout = document.getElementById('messagesUtilisateur');
  }
  signOut() {
    this.afAuth.auth.signOut();
  }
}


