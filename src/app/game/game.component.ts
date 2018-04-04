import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router) {

  }

  ngOnInit() {
    this.afAuth.authState.subscribe(authState => {
      if (authState == null) {
        this.router.navigate(['/']);
      }
    });
  }

}
