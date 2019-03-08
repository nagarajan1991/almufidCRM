import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { OnInit } from '@angular/core';
import { AuthData } from '../auth/auth.data.model';
import { Observable } from 'rxjs';
import { VisitsService } from '../visits/visits.service';
import { PlanVisitService } from '../visits/planvisit.service';
import { Inject } from '@angular/core';
import { GLOBALS, Global } from '../visits/global';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashBoardComponent implements OnInit {

  selectedUser:User;
  users$: Observable<any>;
  visitsMonthly$: Observable<any>;
  visitsYearly$: Observable<any>;
  planvisitsMonthly$: Observable<any>;
  planVisitsYearly$: Observable<any>;
  constructor(private authService: AuthService,
  @Inject(GLOBALS) public g: Global,
  private visitService: VisitsService,
  private planVisitService: PlanVisitService) {

  }
  ngOnInit(): void {
    this.users$ = this.authService.getUsers();
    this.visitsMonthly$ = this.visitService.getVisitsStatistics('Monthly');
    this.visitsYearly$ = this.visitService.getVisitsStatistics('Yearly');
    this.planvisitsMonthly$ = this.planVisitService.getPlanVisitsStatistics('Monthly');
    this.planVisitsYearly$ = this.planVisitService.getPlanVisitsStatistics('Yearly');
  }

  selectUser(user:User){
    this.selectedUser=user;
    return false;
  }
}
