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
  visits$: Observable<any>;
  visitsYearly$: Observable<any>;
  planvisits$: Observable<any>;
  planVisitsYearly$: Observable<any>;
  selectedPeriod:string='Daily';
  constructor(private authService: AuthService,
  @Inject(GLOBALS) public g: Global,
  private visitService: VisitsService,
  private planVisitService: PlanVisitService) {

  }
  ngOnInit(): void {
    this.users$ = this.authService.getUsers();
    this.visits$ = this.visitService.getVisitsStatistics(this.selectedPeriod);
    this.planvisits$ = this.planVisitService.getPlanVisitsStatistics(this.selectedPeriod);
  }

  refreshStat(period:string){
    this.selectedPeriod = period;
    this.visits$ = this.visitService.getVisitsStatistics(period);
    this.planvisits$ = this.planVisitService.getPlanVisitsStatistics(period);
  }

  selectUser(user:User){
    this.selectedUser=user;
    return false;
  }
}
