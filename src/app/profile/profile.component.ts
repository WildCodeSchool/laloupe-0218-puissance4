import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  items: Observable<any[]>;
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore,
      ) { this.items = db.collection('items').valueChanges(); }

  user;
  nbrGame;
  nbrWins;
  nbrLoose;
  userId;

  ngOnInit() {
    this.afAuth.authState.subscribe((authState) => {
      this.userId = authState.uid;
      if (authState == null) {
        this.router.navigate(['/']);
      }
      
      this.db
      .doc('users/' + this.userId)
      .valueChanges()
      .subscribe((user) => {
        this.user = user;
        this.nbrGame = '' + this.user.nbrGame;
        this.nbrWins = '' + this.user.nbrWins;
        this.nbrLoose = '' + this.user.nbrLoose;
      });
      
    });
  }

  mainMenu() {
    this.router.navigate(['mainmenu']);
  }
}
