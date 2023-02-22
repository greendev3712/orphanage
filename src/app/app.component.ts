import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';

import { GlobalService } from './global.service'
import { DOCUMENT } from '@angular/common';
import { render } from 'creditcardpayments/creditCardPayments';
import { PaypalService } from './_service/pay-pal-service.service';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { textChangeRangeIsUnchanged } from 'typescript';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'orphanage';
    cotisation = 102;
    public payPalConfig?: IPayPalConfig;
    @ViewChild('myPaypalButtons', { static: false })
    myPaypalButtons!: ElementRef;

    orphanage: any;

    constructor(public globalService: GlobalService, @Inject(DOCUMENT) private document: Document) { }

    ngOnInit(): void {
        this.globalService.currentMessage.subscribe(message => {
            this.orphanage = message;
            // this.initConfig(message);
            console.log(message)
        });


    }




    removeMenuSm() {
        this.globalService.showMenu = false;
        this.globalService.donate = false;
        // this.renderer.removeClass(this.document.body, 'overflow-hidden');
    }
    calcPourcentage() {
        return this.cotisation / 5;
    }
    renitialiseCotisation() {
        console.log(this.cotisation);
    }

    private initConfig(paypal_info: any): void {

        this.payPalConfig = {
            currency: 'USD',
            clientId: paypal_info,
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: '' + this.cotisation,
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: '' + this.cotisation
                            }
                        }
                    },
                    items: [{
                        name: 'Enterprise Subscription',
                        quantity: '1',
                        category: 'DIGITAL_GOODS',
                        unit_amount: {
                            currency_code: 'USD',
                            value: '' + this.cotisation,
                        },
                    }]
                }]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            onApprove: (data, actions) => {
                console.log('onApprove - transaction was approved, but not authorized', data, actions);

                this.globalService.donate = false;

            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);


            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
                this.globalService.donate = false;


            },
            onError: err => {
                console.log('OnError', err);
                this.globalService.donate = false;

            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);

            }
        };
    }

    opennewindow() {

        window.open("https://paypal.com/donate/?cmd=_donations&business=" + this.orphanage.paypal_info?.paypal_info, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes");
    }



}
