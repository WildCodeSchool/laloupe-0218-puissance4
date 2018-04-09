import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Room } from '../models/room';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore) {

  }

  ngOnInit() {
    this.afAuth.authState.subscribe((authState) => {
      if (authState == null) {
        this.router.navigate(['/']);
      }
      const roomCollection = this.db.collection<Room>('rooms');
      console.log(this.db.collection<Room>('rooms'));
    });

    
  }

  

}
