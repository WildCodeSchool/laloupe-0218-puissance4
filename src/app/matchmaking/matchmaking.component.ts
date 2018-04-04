import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css']
})
export class MatchmakingComponent implements OnInit {
  items: Observable<any[]>;
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    db: AngularFirestore) { this.items = db.collection('items').valueChanges(); }

  ngOnInit() {
    this.afAuth.authState.subscribe(authState => {
      if (authState == null) {
        this.router.navigate(['/']);
      }
    });

  }
}
