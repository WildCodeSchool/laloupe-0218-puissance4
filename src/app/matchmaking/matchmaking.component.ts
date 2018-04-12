import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Player } from '../models/player';
import { Room } from '../models/room';
import 'rxjs/add/operator/take';
import { AuthService } from './../auth.service';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css'],
})
export class MatchmakingComponent implements OnInit {
  items: Observable<any[]>;
  constructor(
    private authService: AuthService,
    public afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore) { }

  private authSubscription: Subscription;

  idUser;
  user;
  ok;

  ngOnInit() {
    this.afAuth.authState.subscribe((authState) => {
      if (authState == null) {
        this.router.navigate(['/']);
      }


      this.idUser = authState.uid;
      this.db
        .doc('users/' + this.idUser)
        .valueChanges()
        .take(1)
        .subscribe((user) => {
          this.user = user;
          this.getRooms();
        });

    });
  }

  getRooms() {
    const roomCollection = this.db.collection<Room>('rooms');

    const snapshot = roomCollection.snapshotChanges().take(1).subscribe((snapshot) => {
      const player = new Player();
      player.name = this.authService.name.replace(/\s/g, '');

      for (const snapshotItem of snapshot) {
        const roomId = snapshotItem.payload.doc.id;
        const room = snapshotItem.payload.doc.data() as Room;

        if (room.players.length === 1) {
          room.players.push(player);
          room.players[1].id = this.user.uid;
          this.db.doc('rooms/' + roomId).update(JSON.parse(JSON.stringify(room)));
          this.router.navigate(['game', roomId, player.name]);
          return;
        }
      }

      const room = new Room();
      room.players = [player];
      room.players[0].finish = false;
      room.turn = 0;
      room.grid = this.createGrid(6, 7);
      room.winner = -1;
      room.end = false;
      room.token = ['./assets/img/red-frog.png', './assets/img/yellow-frog.png'];
      room.players[0].id = this.user.uid;
      room.chat = ['Good luck !'];

      this.db.collection('rooms')
        .add(JSON.parse(JSON.stringify(room)))
        .then((doc) => {
          this.router.navigate(['game', doc.id, player.name]);
        });
    });

  }
  createGrid(lin, col) {
    const grid = [];
    let i = 0;
    while (i < lin) {
      grid[i] = { line: [] };
      let m = 0;
      while (m < col) {

        grid[i].line[m] = 'vide';
        m = m + 1;
      }
      i = i + 1;
    }
    console.log('grid');
    return grid;
  }

  mainMenu() {
    this.router.navigate(['mainmenu']);
  }

}

