import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { OnInit } from '@angular/core';
import { AuthData } from '../auth/auth.data.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashBoardComponent implements OnInit {

  users$: Observable<any>;
  constructor(private authService: AuthService) {

  }
  ngOnInit(): void {
    this.users$ = this.authService.getUsers();
  }

}
