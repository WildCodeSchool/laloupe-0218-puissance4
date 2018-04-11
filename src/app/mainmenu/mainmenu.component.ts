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

  ngOnInit() {

    this.afAuth.authState.subscribe((authState) => {
      if (authState == null) {
        this.router.navigate(['/']);
      }
      this.idUser = authState.uid;
      this.db
        .doc('users/' + this.idUser)
        .valueChanges()
        .subscribe((user) => {
          this.user = user;
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
    this.takeData()
    this.router.navigate(['matchmaking']);
  }
  profile() {
    this.router.navigate(['profile']);
  }

  takeData() {
    if (this.user.nbrGame === 0) {
      var user = { name: '', img: '', uid: '', nbrGame: '', nbrWins: '', nbrLoose: '' };

      user.name = this.authService.user.displayName;
      user.img = this.authService.user.photoURL;
      user.uid = this.authService.user.uid;
      user.nbrGame = this.authService.user.nbrGame;;
      user.nbrWins = this.authService.user.nbrWins;
      user.nbrLoose = this.authService.user.nbrLoose;
      this.db.doc('users/' + this.authService.user.uid).set(user);
    }
  }
}
