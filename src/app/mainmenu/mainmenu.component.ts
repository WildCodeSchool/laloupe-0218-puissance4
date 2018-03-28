import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router ) {
  }

  ngOnInit() {
    $("#credits").click(function () {
      $("#panel").toggle("slide");
    });
    
    this.afAuth.authState.subscribe(authState => {
      if(authState == null){
        this.router.navigate(['/']);
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
