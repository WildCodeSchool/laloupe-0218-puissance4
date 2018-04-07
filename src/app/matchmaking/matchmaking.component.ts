import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Player } from './../models/player';
import { Room } from './../models/room';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent implements OnInit {
  items: Observable<any[]>;
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore) { this.items = db.collection('items').valueChanges(); }

  ngOnInit() {
    this.afAuth.authState.subscribe((authState) => {
      if (authState == null) {
        this.router.navigate(['/']);
      }
      this.getRooms();
    });
  }

  getRooms() {
    const roomCollection = this.db.collection<Room>('rooms');

    const snapshot = roomCollection.snapshotChanges().take(1).subscribe((snapshot) => {
      const player = new Player();
      player.name = 'user' + Math.floor(Math.random() * 1000);

      for (const snapshotItem of snapshot) {
        const roomId = snapshotItem.payload.doc.id;
        const room = snapshotItem.payload.doc.data() as Room;

        if (room.players.length === 1) {
          room.players.push(player);
          this.db.doc('rooms/' + roomId).update(JSON.parse(JSON.stringify(room)));
          this.router.navigate(['game', roomId, player.name]);
          return;
        }
      }

      const room = new Room();
      room.players = [player];
      this.db.collection('rooms')
        .add(JSON.parse(JSON.stringify(room)))
        .then((doc) => {
          this.router.navigate(['game', doc.id, player.name]);
        });
    });
  }

  mainMenu() {
    this.router.navigate(['mainmenu']);
  }
}
