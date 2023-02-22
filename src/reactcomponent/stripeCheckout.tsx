import * as React from 'react';
import {useStripe, useElements,Elements, CardElement, ElementsConsumer, PaymentElement} from '@stripe/react-stripe-js';
import {
    BrowserRouter as Router,
    Route, Navigate
  } from "react-router-dom"
  import {Circles} from 'react-loader-spinner'
  import axios from 'axios'
  import { environment } from 'src/environments/environment';
import  {OrphonageService}  from 'src/app/_service/orphonage.service';
//import {CardElement, Elements, ElementsConsumer} from '@stripe/react-stripe-js';


import CardSection from './CardSection';
import { translate } from '@angular/localize/src/utils';

export default function  StripeCheckoutForm(props:any) {
    let [redirect, setRedirec] =React.useState(false)
    let [loading, setLoading] = React.useState(false)
  const stripe = useStripe();
  const elements = useElements();

  console.log('StripeCheckoutForm: ', props);

    let orphonageService: OrphonageService;

  const handleSubmit = async (event:any) => {
   //return(alert(props.client_key))
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
setLoading(true)
    const result = await stripe.confirmCardPayment( props.client_key, {
      payment_method: {
        card: elements!.getElement(CardElement)!,
        billing_details: {
          name: props.username,
        },
      }
    });

    if (result.error) {
      setLoading(false)

      alert(JSON.stringify(result.error))
      console.log(result.error.message);
      setLoading(false)
    } else {
    //  alert(JSON.stringify(result))
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        //  OrphonageService

       axios.post(`$/api/donations`,{
          "username": props.username?props.username:'Anonymous',
          "amount": Number(props.amount),
          "orphanage_name": props.orphanage_name
      })
      .then((res:any)=>{
              alert('Successful')
              props.handleTransaction('successful')
            }).catch((err:any)=>alert(err.message))
    //  alert('Successful')
        setLoading(false)

       setRedirec(true)
      }
    }
  };

  return (
    <div style={{position:'relative'}}>
    <form onSubmit={handleSubmit} >
    <div style={{border:'2px solid black',  justifyContent:'center', alignContent:'center'}}>

      <CardElement />
      </div>
      <br/>
      {loading &&  <Circles color="Blue"/>}
<div style={{position:'absolute', marginLeft:'40%'}}>
      <button disabled={!stripe}>Pay</button>
      </div>
    </form>
    </div>
  );
}


  