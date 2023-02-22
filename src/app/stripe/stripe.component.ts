import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Appearance, StripeCardElementChangeEvent, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { StripePaymentService } from '../_service/stripe.service';
import { TokenStorageService } from '../_service/token-storage.service';
import { OrphonageService } from '../_service/orphonage.service';
import { environment } from 'src/environments/environment';
import { byCountry } from 'country-code-lookup';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss']
})

export class StripePaymentComponent implements OnInit {
  @Input() orphanageData: any;
  @ViewChild(StripeCardComponent)
  card!: StripeCardComponent;
  donationAmount: any = 10;
  donorName: string = '';
  email: string = '';
  message: string = '';
  cardholdername: String = '';
  cardDetailsError: boolean = false;
  stripeAccountInvalid: boolean = false;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#000000',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#494444',
        },
      },
    },
    hidePostalCode: true,
    iconStyle: 'solid'
  };

  cardAppearance: Appearance = {
    theme: 'none',
    labels: 'floating'
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    loader: 'auto',
    appearance: this.cardAppearance
  };

  stripePaymentForm: FormGroup;
  paymentSuccess: boolean = false;
  paymentFailed: boolean = false;
  paymentFailureError: any = '';

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private stripePayService: StripePaymentService,
    private tokenStorageService: TokenStorageService,
    private orphonageService: OrphonageService
  ) {
    this.stripePaymentForm = this.fb.group({
      donorName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: '',
      name: ['', [Validators.required]],
      amount: [this.donationAmount, [Validators.required, Validators.pattern(/\d+/)]],
    });
  }
  ngOnInit(): void {
    this.stripeService.changeKey(environment.stripe_key, {
      stripeAccount: this.orphanageData.actId
    })

    if (this.tokenStorageService.getUser()?.is_admin) {
      this.getPaymentHistory();
    }
  }

  onChange(event: StripeCardElementChangeEvent) {
    const displayError = document.getElementById('card-errors');

    if (displayError) {
      if (event.error) {
        displayError.textContent = event.error.message;
        this.cardDetailsError = true;
      } else {
        displayError.textContent = '';
        this.cardDetailsError = false;
      }
    }

  }

  setDonationAmount(amount: number) {
    this.donationAmount = amount
  }

  pay(): void {
    if (this.stripePaymentForm.valid) {
      let countryData: any;
      if (this.orphanageData.country && this.orphanageData.country.length > 2) {
        countryData = byCountry(this.orphanageData.country);
      }

      let country = 'US';
      if (countryData) {
        country = countryData.internet;
      }

      let addressObj = {
        line1: this.orphanageData.location || 'Sample',
        postal_code: '12345',
        city: 'Sample',
        state: 'Sample',
        country: country,
      }

      // this.stripePayService.createPaymentIntent(this.stripePaymentForm.controls['amount'].value, 
      // `Donation to Orphanage ${this.orphanageData.name.toUpperCase()}`, 
      // this.orphanageData.actId)
      //   .pipe(
      //     switchMap((pi: any) => 
      //       this.stripeService.confirmCardPayment(pi.client_secret, {
      //         payment_method: {
      //           card: this.card.element,
      //           billing_details: {
      //             name: this.stripePaymentForm.controls['name'].value,
      //             email: this.orphanageData.email || '',
      //             address: addressObj
      //           },
      //         }
      //       })
      //     )
      //   )
      //   .subscribe((result: any) => {
      //     console.log(result);
      //     if (result.error) {
      //       this.paymentFailed = true;
      //       console.log(result.error.message);
      //       this.paymentFailureError = result.error.message;
      //     } else {
      //       // The payment has been processed!
      //       if (result.paymentIntent.status === 'succeeded') {
      //         this.paymentSuccess = true;
      //         this.insertStripePayment();
      //       }
      //     }
      //   });


      this.stripePayService
        .createPaymentIntent(
          this.stripePaymentForm.controls['amount'].value,
          `Donation to Orphanage ${this.orphanageData.name.toUpperCase()}`,
          this.orphanageData.actId,
          this.stripePaymentForm.controls['donorName'].value,
          this.stripePaymentForm.controls['email'].value,
          this.stripePaymentForm.controls['message'].value,
        )
        .subscribe((pi) => {
          if (pi && pi.client_secret) {
            this.stripeService
              .confirmCardPayment(pi.client_secret, {
                payment_method: {
                  card: this.card.element,
                  billing_details: {
                    name: this.stripePaymentForm.controls['name'].value,
                    email: this.orphanageData.email || '',
                    address: addressObj,
                  },
                },
              })
              .subscribe((result: any) => {
                console.log(result);
                if (result.error) {
                  this.paymentFailed = true;
                  console.log(result.error.message);
                  this.paymentFailureError = result.error.message;
                } else {
                  // The payment has been processed!
                  if (result.paymentIntent.status === 'succeeded') {
                    this.paymentSuccess = true;
                    this.insertStripePayment();
                  }
                }
              });
          } else {
            this.stripeAccountInvalid = true;
          }
        });

    } else {
      console.log(this.stripePaymentForm);
    }
  }

  private insertStripePayment(): void {
    let userDetails = this.tokenStorageService.getUser();
    let paymentObj = {
      username: userDetails.username ? userDetails.username : 'Anonymous',
      amount: Number(this.donationAmount),
      orphanage_name: this.orphanageData.name
    }

    this.stripePayService.recordPayment(paymentObj).subscribe((result: any) => {
      if (result) {
        console.log('payment recorded successfully');
      }
    })
  }

  private getPaymentHistory() {
    this.orphonageService.orphanage_donations(this.orphanageData).subscribe((result) => {
      console.log(`Payment History for Orphane id : ${this.orphanageData.id} is as below`, result);
    })
  }

}
