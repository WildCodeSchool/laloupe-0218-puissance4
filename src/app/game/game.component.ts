import { Component, OnInit, style } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Room } from '../models/room';
import { Subscription, TimeInterval } from 'rxjs/Rx';
import { AuthService } from './../auth.service';
import { timeout } from 'rxjs/operator/timeout';
import { timeoutWith, timeInterval } from 'rxjs/operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore,
    private authService: AuthService) {

  }

  private authSubscription: Subscription;
  private roomCollection: AngularFirestoreCollection<any>;
  roomOb: Observable<any[]>;
  room: Room;

  win: boolean;
  colorWin: string;
  roomId;
  yourTurn;
  user;
  numPlayer;

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');

    this.authService.authstate.take(1).subscribe((authstate) => {
      if (!authstate) {
        return;
      }
      this.db
        .doc<Room>('rooms/' + this.roomId)
        .valueChanges()
        .subscribe((room) => {
          this.room = room;
        });

      this.db
        .doc('users/' + this.authService.user.uid)
        .valueChanges()
        .subscribe((user) => {
          this.user = user;
          if (this.room.players[0].name === this.authService.name.replace(/\s/g, '')) {
            this.numPlayer = 0;
            console.log('numPlayer = 0');
          } else {
            this.numPlayer = 1;
            console.log('numPlayer = 1');
          }

        });
    });
  }

  ngOnDestroy() {
    if (this.room.end && !this.room.players[this.numPlayer].finish) {
      console.log('test');
      this.user.nbrGame = this.user.nbrGame + 1;
      this.room.players[this.numPlayer].finish = true;

      if (this.room.players[this.room.turn].name === this.room.players[this.numPlayer].name) {
        this.user.nbrWins = this.user.nbrWins + 1;
      } else {
        this.user.nbrLoose = this.user.nbrLoose + 1;
      }
      this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
      this.db.doc('users/' + this.authService.user.uid).update(this.user);
    }

  }

  changeTurn() {
    this.room.turn = this.room.turn === 0 ? 1 : 0;

    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
  }

  play(col) {

    if (this.room.players[this.room.turn].name === 
    this.authService.name.replace(/\s/g, '') && this.room.winner 
    === -1 && this.room.players.length > 1) {
      const i = 0;
      let m = this.room.grid.length - 1;
      let ok = false;
      if (this.room.grid[0].line[col] !== 'vide') {
        console.log('You can\'t play here');
      } else {
        while (!ok) {
          if (this.room.grid[m].line[col] !== 'vide' && m > 0) {
            m = m - 1;

          } else {
            ok = true;

          }
        }
        if (this.room.turn === 0) {
          this.room.grid[m].line[col] = 'red';
        } else {
          this.room.grid[m].line[col] = 'yellow';
        }
        this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
        this.verifvictory();

      }
    }
  }

  verifvictory() {
    let color;
    let align = 0;
    let i = 0;
    let m = 0;
    if (this.room.turn === 0) {
      color = 'red';
    } else {
      color = 'yellow';
    }

    // vertical win

    while (this.room.grid[0].line.length > m && align < 4) {
      align = 0;
      i = 0;
      while (this.room.grid.length > i && align < 4) {

        if (this.room.grid[i].line[m] === color && align < 4) {
          align = align + 1;
        } else {
          align = 0;
        }
        i = i + 1;

      }
      m = m + 1;

    }

    i = 0;
    m = 0;

    // horizontal win

    while (this.room.grid.length > i && align < 4) {
      align = 0;
      m = 0;
      while (this.room.grid[0].line.length > m && align < 4) {

        if (this.room.grid[i].line[m] === color && align < 4) {
          align = align + 1;
        } else {
          align = 0;
        }
        m = m + 1;

      }
      i = i + 1;

    }

    // diago win
    if (align < 4) {
      align = 0;
      i = 0;
      m = 0;
      let iBis = 0;
      let mBis = 0;
      while (this.room.grid.length > i && align < 4) {

        m = 0;
        while (this.room.grid[0].line.length > m && align < 4) {

          if (this.room.grid[i].line[m] === color && align < 4) {
            align = align + 1;

          } else {
            align = 0;
          }
          if (align > 0 && align < 4) {
            iBis = i + 1;
            mBis = m + 1;

            while (align > 0 && align < 4) {

              if (iBis < this.room.grid.length && this.room
                .grid[iBis].line[mBis] === color && align < 4) {
                align = align + 1;
                mBis = mBis + 1;
                iBis = iBis + 1;
              } else {
                align = 0;
              }
            }
          }
          m = m + 1;

        }
        i = i + 1;

      }
    }


    if (align < 4) {
      align = 0;
      i = 0;
      m = 0;
      let iBis = 0;
      let mBis = 0;
      while (this.room.grid.length > i && align < 4) {

        m = 0;
        while (this.room.grid[0].line.length > m && align < 4) {

          if (this.room.grid[i].line[m] === color && align < 4) {
            align = align + 1;

          } else {
            align = 0;
          }
          if (align > 0 && align < 4) {
            iBis = i + 1;
            mBis = m - 1;

            while (align > 0 && align < 4) {

              if (iBis < this.room.grid.length && mBis >= 0 && this.room
                .grid[iBis].line[mBis] === color && align < 4) {
                align = align + 1;
                mBis = mBis - 1;
                iBis = iBis + 1;

              } else {
                align = 0;
              }
            }
          }
          m = m + 1;

        }
        i = i + 1;

      }
    }

    if (align >= 4) {
      this.room.end = true;
      this.room.winner = this.room.turn;
      this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
      console.log(this.room.players[this.room.winner].name + 'WIN !');
    } else {
      this.changeTurn();
    }
  }

  menu() {
    this.router.navigate(['mainmenu']);
  }

  stat() {
    console.log(this.user.nbrGame);
    this.user.nbrGame = this.user.nbrGame + 1;
    if (this.room.players[this.room.turn].name === this.authService.name.replace(/\s/g, '')) {
      this.user.nbrWins = this.user.nbrWins + 1;
    } else {
      this.user.nbrLoose = this.user.nbrLoose + 1;
    }
    this.db.doc('users/' + this.user.uid).update(this.user);

  }






}
