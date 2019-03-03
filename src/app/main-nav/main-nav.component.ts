import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { AuthService } from '../auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false;
  email: string;
  private authListenerSubs: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  fullname: any;

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

get user(): any {
    return localStorage.getItem('email');
}


get userrole(): any {
  return localStorage.getItem('userrole');
}

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
