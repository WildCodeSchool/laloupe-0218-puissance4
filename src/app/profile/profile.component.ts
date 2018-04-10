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
    private db: AngularFirestore) { this.items = db.collection('items').valueChanges(); }


  ngOnInit() {
    this.afAuth.authState.subscribe((authState) => {
      if (authState == null) {
        this.router.navigate(['/']);
      }
    });
  }
  mainMenu() {
    this.router.navigate(['mainmenu']);
  }
}
