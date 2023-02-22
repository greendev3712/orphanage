import { AfterViewInit, Component, ElementRef, Inject, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import * as React from 'react';
import * as ReactDom from 'react-dom'

import { GlobalService } from '../global.service'
import { DOCUMENT } from '@angular/common';
import { render } from 'creditcardpayments/creditCardPayments';
import { textChangeRangeIsUnchanged } from 'typescript';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { OrphonageService } from '../_service/orphonage.service';
import { TokenStorageService } from '../_service/token-storage.service';
import PaypalCompnent from '../../reactcomponent/paypalComponents';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['../app.component.scss']
})
export class PaypalComponent implements OnChanges, AfterViewInit, OnDestroy {
  title = "reactAngula"

  /*
    public rootId= 'rootId';
    public details: any 
    constructor(
      private _router: Router,
      private _activatedRoute: ActivatedRoute
    ) { }
  */
  rootId = 'rootId';
  amount = 50;
  constructor(public globalService: GlobalService,
    private orphonageService: OrphonageService, private tokenStorageService: TokenStorageService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render()
  }

  ngAfterViewInit(): void {
    /*
        this.details = history.state
          this.render();
    */
    this.render()

  }

  ngOnDestroy(): void {

  }


  /*private render(){
      ReactDom.render(React.createElement(PaymentCompnent,{orphanage:this.details}),document.getElementById(this.rootId))
*/
  public render() {
    console.log(this.amount);
    // ReactDom.render(React.createElement(PaymentCompnent,{merchantId:"BKAQRTWKE8RNL", amount: 102}),document.getElementById(this.rootId))
    // //  ReactDom.render(React.createElement(PaymentCompnent,{merchantId:this.orphonageService.orphonage.paypal_info.paypal_info, amount: this.amount, acttype:this.orphonageService.orphonage.acttype,actId:this.orphonageService.orphonage.actId}),document.getElementById(this.rootId))
    ReactDom.render(React.createElement(PaypalCompnent, { orphanage: this.orphonageService.orphonage, userDetails: this.tokenStorageService.getUser() }), document.getElementById(this.rootId))
    
  }

}
