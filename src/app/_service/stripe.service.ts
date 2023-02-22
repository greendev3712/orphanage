import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentIntent } from '@stripe/stripe-js';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {

  constructor(private http: HttpClient) { }

  createPaymentIntent(amount: number, description: String, actId: String, name: String, email: String, message: String): Observable<PaymentIntent> {
    console.log('calling createPaymentIntent method..');
    return this.http.post<PaymentIntent>(
      environment.stripe_pay_url + '/create-payment-intent',
      {
        amount: amount,
        description: description,
        stripeAccount: actId,
        name,
        email,
        message,
      }
    );
  }

  recordPayment(paymentObj: any): Observable<any> {
    console.log('calling recordPayment method..');
    return this.http.post<any>(
      environment.AUTH_API + '/donations', paymentObj);
  }
}
