import { Component, OnInit, style } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Room } from '../models/room';
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
    private db: AngularFirestore) {

  }

  private roomCollection: AngularFirestoreCollection<any>;
  roomOb: Observable<any[]>;
  room = new Room();
  win: boolean;
  colorWin: string;
  roomId;

  ngOnInit() {

    this.roomId = this.route.snapshot.paramMap.get('id');
    this.afAuth.authState.subscribe((authState) => {
      if (authState == null) {
        this.router.navigate(['/']);
      }
      console.log(this.roomId);
    });

    this.db
      .doc<Room>('rooms/' + this.roomId)
      .valueChanges()
      .subscribe((room) => {
        this.room = room;

      });


  }



  changeTurn() {

    this.room.turn = this.room.turn === 0 ? 1 : 0;
    console.log(this.room.turn);
    this.db.doc<Room>('rooms/' + this.roomId).update(this.room);
  }

  play(col) {
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
      this.changeTurn();
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
            console.log('align', align, 'en', i + 1, m + 1);
          } else {
            align = 0;
          }
          if (align > 0 && align < 4) {
            iBis = i + 1;
            mBis = m + 1;
            console.log('test', align, 'en', iBis + 1, mBis + 1);
            while (align > 0 && align < 4) {
              console.log(iBis, mBis);
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
            console.log('align', align, 'en', i + 1, m + 1);
          } else {
            align = 0;
          }
          if (align > 0 && align < 4) {
            iBis = i + 1;
            mBis = m - 1;

            while (align > 0 && align < 4) {
              console.log('test', align, 'en', iBis + 1, mBis + 1);
              if (iBis < this.room.grid.length && mBis >= 0 && this.room
                .grid[iBis].line[mBis] === color && align < 4) {
                align = align + 1;
                mBis = mBis - 1;
                iBis = iBis + 1;
                console.log('align', align);
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
      console.log(color + 'WIN !');
      this.colorWin = color;
      this.win = true;
    }
  }








}
