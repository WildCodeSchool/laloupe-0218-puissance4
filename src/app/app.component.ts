import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Puissance 4 ';

  constructor(public afAuth: AngularFireAuth) {
  }

  googleSignIn(){
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}


