import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';

import { NgForm } from '@angular/forms';
import { VisitsService } from '../visits.service';
import { ActivatedRoute, ParamMap  } from '@angular/router';
import { Subscription } from 'rxjs';
import { Visit } from '../visit.model';
import { AuthService } from 'src/app/auth/auth.service';
import { MapsAPILoader } from '@agm/core';

@Component ({
  selector: 'app-visit-create',
  templateUrl: './visit-create.component.html',
  styleUrls : ['./visit-create.component.css']
})


export class VisitCreateComponent implements OnInit, OnDestroy {




  visit: Visit;
  isLoading = false;
  private mode = 'create';
  private visitId: string;
  private authStatusSub: Subscription;

  lat: any;
  lng: any;

  constructor (
    public visitsService: VisitsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    public mapsAPILoader: MapsAPILoader


    ) {
      if (navigator)
      {
      navigator.geolocation.getCurrentPosition( pos => {
          this.lng = +pos.coords.longitude;
          this.lat = +pos.coords.latitude;
        });
      }
    }


  ngOnInit() {

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );


    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('visitId')) {
        this.mode = 'edit';
        this.visitId = paramMap.get('visitId');
        this.isLoading = true;
        this.visitsService.getVisit(this.visitId).subscribe(visitData => {
          this.isLoading = false;
          this.visit = {
            id: visitData._id,
            customer: visitData.customer,
            contact_no: visitData.contact_no,
            remarks: visitData.remarks,
            date: null,
            lat: visitData.lat,
            lng: visitData.lng,
            creator: visitData.creator };
        });
      } else {
        this.mode = 'create';
        this.visitId = null;
      }
    });
  }


  onSaveVisit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.visitsService.addVisit(form.value.customer, form.value.contact_no, form.value.remarks, null,
        this.lat, this.lng, form.value.creator);
    } else {
      /* this.visitsService.updateVisit(this.visitId, form.value.customer, form.value.contact_no, form.value.remarks,
        null, this.lat, this.lng, form.value.creator);*/
    }
  }

  ngOnDestroy ()  {
    this.authStatusSub.unsubscribe();
  }
}


