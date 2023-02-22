import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  public actType: any;
  public orphenage: any;
  constructor(private router: Router) {
    this.orphenage = this.router.getCurrentNavigation()?.extras.state ? this.router.getCurrentNavigation()?.extras.state : {};
    this.actType = this.router.getCurrentNavigation()?.extras.state ? this.router.getCurrentNavigation()?.extras.state?.acttype : 'paypal';

    // console.log("this.orphenage : ", this.orphenage);
    // console.log("this.actType : ", this.actType);
  }

  ngOnInit(): void {
  }

}
