import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './../auth.service';
import { User } from './../models/user';
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
      }
      if (authState == null) {
        document.getElementById('signout').style.display = 'none';
      }
    });
  }
  googleSignIn() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  signOut() {
    this.afAuth.auth.signOut();
  }
}


