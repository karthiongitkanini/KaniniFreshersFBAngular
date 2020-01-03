import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/services/flight.sevice';
import { FlightModel } from 'src/models/flightsearch.model';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { ThrowStmt, TemplateParseError } from '@angular/compiler';
import { Fly } from 'src/models/fly.model';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
// import { AppDateAdapter, APP_DATE_FORMATS } from 'src/date.adapter';
import { LoginService } from 'src/services/login.service';
function openNav() {
  document.getElementById("mySidenav").style.width = "240px";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}


@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
  providers: []
})

export class SearchPageComponent implements OnInit {

  places: string[];
  place: any
  selectSource: string = '';
  selectDestination: string = '';
  selectDate: string = '';
  selectcount: number;
  flightshow: FlightModel[];
  result: string;
  fly: number;
  flyno: number;
  price: any;
  public hide: boolean = false;
  public showCancel: boolean = false;
  message: string
  value: number;
  token: string = '';
  username = '';
  temp:string;
  // -----for userDeatils and Logout-----
  tokenExists: boolean = false;
  dummyVar = 'hello';

  public show: boolean = false;
  public buttonName: any = 'Show';
  dialog: any;

  constructor(private flightService: FlightService, public router: Router, private loginservice: LoginService) {
    this.flightService.getAllPlacesFromAPI().subscribe(res => {
      this.place = res;

      // console.log(this.place);
    })
  }
  minDate = new Date(2019, 11, 2);
  maxDate = new Date(2019, 11, 31);

  getUrl() {
    return "url(' ')";
  }
  userEmptyOrNot() {
    // if (this.token == null) {
    //   this.tokenExists = true;
    // }
    // else { this.tokenExists = true; }
  }

  selectedSource(event: any) {
    this.selectSource = event.target.value;
  }
  selectedDestination(event: any) {
    this.selectDestination = event.target.value;
  }
  
  selectedDate(event:any,date,source,destination,temp)
  {
    this.selectDate = event.target.value;
    console.log(this.selectDate);
    if(this.selectSource!='' && this.selectDestination!='')
    {
      this.temp='true';
   this.flightService.getPrice(this.selectDate,this.selectSource,this.selectDestination,this.temp).subscribe(res=>{
     this.price=res;
     console.log(this.price);
   })
  }
  }
  selectedPassengercount(event: any) {
    this.selectcount = event.target.value;
    console.log(this.selectcount);
    localStorage.setItem("value", this.selectcount.toString());
  }
  goToLogin() {
    // localStorage.removeItem('userToken');
    // localStorage.removeItem('value');

    this.router.navigateByUrl("/User");
  }
  logOut() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('value');
    this.router.navigateByUrl("/Home");
    window.location.reload();
  }
  goToRegister() {
    this.router.navigateByUrl("/homeicons");
  }
  closeNavbu() {
    closeNav();
  }
  goToCancel() {
    //cancellation
    this.router.navigateByUrl("/cancelticket");
  }
  goToLoginSignup() {
    this.router.navigateByUrl("/signlog");
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(PopupComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  goToHomePageWithIcons() {
    this.router.navigateByUrl("/homeicons");
  }
  openNavbu() {
    openNav();
  }
  // goToCancel(){  
  //   this.showCancel=!this.showCancel;
  // }
  submit() {

    if (this.selectDestination == this.selectSource || this.selectDate == '' || this.selectSource == ''
      || this.selectDestination == '' || this.selectcount == null) {
      if (this.selectcount == null) {
        this.result = "Please fill passenger count"
      }
      if (this.selectSource == '' && this.selectDestination != '' && this.selectDate != '') {
        this.result = "Please fill the Source"

      }
      if (this.selectDestination == '' && this.selectSource != '' && this.selectDate != '') {
        this.result = "Please fill Destination"

      }
      if (this.selectSource == '' && this.selectDestination == '' && this.selectDate == '') {
        this.result = "Please fill the above field";
      }
      if (this.selectDate == '' && this.selectDestination != '' && this.selectSource != '' && this.selectSource !== this.selectDestination) {
        this.result = "Please fill Date"
      }
      if ((this.selectDestination == this.selectSource && this.selectDate != '' && this.selectSource != '' && this.selectDestination != '')) {
        this.result = "Source and destination cannot be same";
      }
      if (this.selectSource == '' && this.selectDate == '' && this.selectDestination != '') {
        this.result = "Please fill Source and Date"
      }
      if (this.selectSource != '' && this.selectDate == '' && this.selectDestination == '') {
        this.result = "Please fill Destination and Date"
      }
      if (this.selectDestination == this.selectSource && this.selectSource != '' && this.selectDestination != '' && this.selectDate == '') {
        this.result = "Same location and no date really??"
      }
    }
    else {
      this.flightService.httpRequest(this.selectDate, this.selectSource, this.selectDestination).subscribe((dat => {
        // console.log(dat)
        this.flightshow = dat
        this.value = this.flightshow.length;
        if (this.value == 0) {
          //console.log(this.value);
          this.message = "false";
        }
        //  console.log(this.message);
        // this.message="false"; 
        this.hide = !this.hide;
        this.show = !this.show;

        // CHANGE THE NAME OF THE BUTTON.
        if (this.show)
          this.buttonName = "Hide";
        else
          this.buttonName = "Show";

      }))
    }
  }
  bookNow(temp) {
    this.token = localStorage.getItem('userToken');
    console.log(this.token)
    if (this.token == null) {
      this.router.navigateByUrl('/User')

    }

    else {
      this.loginservice.getUserClaims().subscribe((data: any) => {
        // console.log(data.Username);
        console.log(data.Username)
        console.log(temp)

        this.fly = data.Username;
        this.flyno = temp;

        this.flightService.httpPost(this.flyno, this.fly);
        this.router.navigate(['/displayAfterBooknow']);
        //  console.log(this.flyno);
        //console.log(this.fly);
      })
    }

  }
  userName() {
    this.token = localStorage.getItem('userToken');
    console.log(this.token)
    if (this.token != null) {
      this.loginservice.getUserClaims().subscribe((data: any) => {
        // console.log(data.Username);
        console.log(data);
        this.username = data.Firstname;
        //console.log(data.Firstname);
      })
    }

  }
  changePassword()
  {
    this.router.navigate(['/changepassword']);

  }

  ngOnInit() {
    // if(localStorage.getItem('userToken')!=null)
    this.userName();
    console.log(localStorage.getItem('userToken'))
  }
}

