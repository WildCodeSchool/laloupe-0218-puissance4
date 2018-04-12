import { Component, OnInit, style, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Room } from '../models/room';
import { Subscription, TimeInterval } from 'rxjs/Rx';
import { AuthService } from './../auth.service';
import { timeout } from 'rxjs/operator/timeout';
import { timeoutWith, timeInterval, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit, OnDestroy {

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
  userAdvers;
  numPlayer;
  numAdvers;

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
          if (this.room.players[0].name === this.authService.name.replace(/\s/g, '')) {
            this.numPlayer = 0;
            this.numAdvers = 1;
            console.log('numPlayer = 0');
          } else {
            this.numPlayer = 1;
            this.numAdvers = 0;
            console.log('numPlayer = 1');
          }
          console.log(this.numAdvers);
          console.log(this.room.players[0].id);
          if (this.room.players.length > 1) {
            console.log(this.room.players[this.numAdvers].id);
            this.db
              .doc('users/' + this.room.players[this.numAdvers].id)
              .valueChanges()
              .subscribe((user) => {
                this.userAdvers = user;

              });
          }
        });


      this.db
        .doc('users/' + this.authService.user.uid)
        .valueChanges()
        .subscribe((user) => {
          console.log('test');
          this.user = user;

        });
    });
  }

  ngOnDestroy() {
    console.log('ngdestroy');
    if (this.room.players.length !== 2) {
      this.room.players[1] = {
        finish: false,
        name: 'undefind',
        id: 'undefind',
      };


    }
    if (this.room.end && !this.room.players[this.numPlayer].finish) {
      console.log('test');
      this.addStats();
      this.user.nbrGame = this.user.nbrGame + 1;
      this.room.players[this.numPlayer].finish = true;

    }
    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
    this.db.doc('users/' + this.authService.user.uid).set(this.user);
    
  }

  changeTurn() {
    this.room.turn = this.room.turn === 0 ? 1 : 0;

    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
  }

  play(col) {

    if (this.room.players[this.room.turn].name ===
      this.authService.name.replace(/\s/g, '') && !this.room.end && this.room.players.length > 1) {
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

    // vérif égalité 

    let tr = 0;
    let verif = 0;
    while (tr < this.room.grid[0].line.length) {
      if (this.room.grid[0].line[tr] !== 'vide') {
        verif = verif + 1;
      }
      if (verif === this.room.grid[0].line.length) {
        this.room.end = true;
        this.db.doc<Room>('rooms/' + this.roomId).update(this.room);

      }
      tr = tr + 1;
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

  chat(text) {

    console.log(text);

    this.room.chat[this.room.chat.length] = this.room.players[this.numPlayer].name + ' : ' + text;
    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);

  }

  changeToken(img) {
    if (img !== this.room.token[this.numAdvers]) {
      this.room.token[this.numPlayer] = img;
      this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
    } else {
      alert('This token is already selected by your opponent.');
    }
  }

  backMenu() {
    if (this.room.players.length !== 2) {
      this.room.players[1] = {
        finish: false,
        name: 'undefind',
        id: 'undefind',
      };
    }
    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
    this.router.navigate(['mainmenu']);
  }

  addStats() {

    if (this.room.players[this.room.turn].name === this.room.players[this.numPlayer].name) {
      this.user.nbrWins = this.user.nbrWins + 1;
    } else if (this.room.winner === -1) {
      this.user.nbrEqual = this.user.nbrEqual + 1;
    } else {
      this.user.nbrLoose = this.user.nbrLoose + 1;
    }



    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
    this.db.doc('users/' + this.authService.user.uid).update(this.user);
  }

  verifLevels() {
    let nbw;
    nbw = this.user.nbrWins;

    switch (nbw) {
      case nbw < 1:
        this.user.levels = 1;
        break;
      case 1 < nbw && nbw < 3:
        this.user.levels = 2;
        break;
      case 3 < nbw && nbw < 6:
        this.user.levels = 3;
        break;
      case 6 < nbw && nbw < 10:
        this.user.levels = 4;
        break;
      case 10 < nbw && nbw < 15:
        this.user.levels = 5;
        break;
      case 15 < nbw && nbw < 20:
        this.user.levels = 6;
        break;
      case 20 < nbw && nbw < 27:
        this.user.levels = 7;
        break;
      case 27 < nbw && nbw < 35:
        this.user.levels = 8;
        break;
      case 35 < nbw && nbw < 45:
        this.user.levels = 9;
        break;
      case 45 < nbw && nbw < 55:
        this.user.levels = 10;
        break;
      case 55 < nbw && nbw < 65:
        this.user.levels = 11;
        break;
      case 65 < nbw && nbw < 80:
        this.user.levels = 12;
        break;
      case 80 < nbw && nbw < 100:
        this.user.levels = 13;
        break;
      case 100 < nbw && nbw < 120:
        this.user.levels = 14;
        break;
      case 120 < nbw && nbw < 150:
        this.user.levels = 15;
        break;
      case 150 < nbw && nbw < 180:
        this.user.levels = 16;
        break;
      case 180 < nbw && nbw < 210:
        this.user.levels = 17;
        break;
      case 210 < nbw && nbw < 250:
        this.user.levels = 18;
        break;
      case 250 < nbw && nbw < 500:
        this.user.levels = 19;
        break;
      case 500 < nbw:
        this.user.levels = 20;
        break;
      default:
        this.user.levels = this.user.levels;
        this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
    }
  }

}
