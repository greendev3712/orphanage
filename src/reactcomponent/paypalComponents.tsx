import * as React from "react"
import { useState } from "react"
import { useEffect } from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useMediaQuery } from 'react-responsive'
//import { useNavigate } from 'react-router-dom';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios'
import { Circles } from 'react-loader-spinner'

import { environment } from "src/environments/environment";

import StripeCheckoutForm from "./stripeCheckout";

const currency = "USD";
const style = { "layout": "vertical" };
const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


const ButtonWrapper = ({ currency, showSpinner, amount, info, handleStatus, token, username, orphanage_name }: any) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    let isInvalid = (
        !info.name.length) ||
            (!info.email.length || !info.email.match(mailFormat)
    );

    useEffect(() => {
        //   alert(amount)
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: currency,
            },
        });
    }, [currency, showSpinner]);



    return (<>
        {(showSpinner && isPending) && <div className="spinner" />}
        <PayPalButtons
            style={{ "layout": "vertical" }}
            disabled={isInvalid}
            forceReRender={[amount, currency, style]}
            createOrder={(data: any, actions: any) => {
                try {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: currency,
                                        value: amount,
                                    },
                                },
                            ],
                        })
                        .then((orderId: any) => {
                            return orderId;
                        }).catch((err: any) => alert(err));
                } catch (err) {
                    alert(err)
                }
            }}
            onApprove={function (data: any, actions: any) {
                return actions.order.capture().then(async function () {
                    axios.post(`/api/donations`, {
                        "username": username ? username : 'Anonymous',
                        "amount": Number(amount),
                        "orphanage_name": orphanage_name,
                        "name": info.name,
                        "email": info.email,
                        "message": info.message,
                    })
                        .then(res => {
                            alert('Successful')
                            handleStatus('successful')
                        }).catch(err => alert(err.message))

                    //  alert('Successful')
                }).catch((err: any) => alert(err));
            }}
        />
    </>
    );
}


export default function PaypalCompnent(props: any) {
    let [amount, setAmount] = useState(10)
    let [info, setInfo] = useState({
        name: '',
        nameTouched: false,
        email: '',
        emailTouched: false,
        message: '',
    })
    //   let [accId, setAccId] =React.useState('acct_1KQ4Le4QwoeCtvUl')
    let [clientKey, setClientKey] = React.useState('')
    let [cardVisibility, setCardVisibility] = React.useState(false)
    let [transactionStat, setTransactionStat] = React.useState('')
    let [loading, setLoading] = React.useState(false)
    
    const handleAmountChange = (e: any) => {
        let { value } = e.target

        setAmount(value)

    }

    const setDonationAmount = (amount: number) => {
        setAmount(amount)
    }

    const handleInfoChange = (e: any) => {
        if (e.target.name === 'name') {
            setInfo({
                ...info,
                [e.target.name]: e.target.value,
                nameTouched: true,
            })
        } else if (e.target.name === 'email') {
            setInfo({
                ...info,
                [e.target.name]: e.target.value,
                emailTouched: true,
            })
        }
    }


    const stripePromise = loadStripe('pk_live_51KVM26SILRRj0S8izYtK50HBjxGkQCS1Ig5zD6koPS7YVDXt2Up2hBzcG8R3WCnKQ1aFetuh6U07mno8xNtRsOTw003VlY7zsY', {

        //    const stripePromise = loadStripe('pk_test_51KPk4hG3qtUfMBk1c7KIO4k2StNjba0iIYEzpevqteHPzWbHJzm1icERUEacR0wHSSoltqiiFZWkkLHnJ6JE1ZnP00yHF9YdQu', {

        stripeAccount: props.orphanage.actId

    });

    const handleProcessPay = async () => {
        if (!amount) {
            return alert('input amount')
        }

        setLoading(true)
        //acct_1KQAjP4S9kVTan8b
        axios.get(`https://zazzau.herokuapp.com/api/v1/orphund/account/${props.orphanage.actId}/${amount}`)
            // axios.get(`https://zazzau.herokuapp.com/api/v1/orphund/account/acct_1KQAjP4S9kVTan8b/${amout}`)

            .then((res: any) => {
                let { client_secret } = res.data
                setClientKey(client_secret)
                // alert(JSON.stringify(res.data))
                //setAmount(0);
                // setAccId('')
                // alert(client_secret)
                setCardVisibility(true)
                setLoading(false)
            }).catch((err: string) => {
                alert(err)
                setLoading(false)
            })

    }
    const UpdateStatus = (e: any) => {
        setTransactionStat(e)
    }

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
    })
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 480px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })



    const Page = <div style={{ alignContent: 'center', marginTop: '40%', justifyContent: 'center', alignSelf: 'center', justifyItems: 'center' }} >
        {
            props.orphanage.acttype == 'paypal' ?
                transactionStat == 'successful' ? (<div>
                    {transactionStat}
                    <a href='/'>  <button>close</button></a></div>) :
    
    <div style={{ width: '618px' }}>
        <div style={{fontWeight: 'bold', fontSize: '1.5rem'}}>{(props.orphanage.name).toUpperCase()}</div>
        <div style={{display: 'flex', paddingBottom: '10px', borderBottom: '1px solid #bfbfbf'}}>
            <div style={{ width: '50%', marginRight: '5px',  }}>
                <input type={'number'} className="form-control" onChange={handleAmountChange} value={amount} placeholder='$USD' />
            </div>
            <div className='ml-auto text-right' style={{ width: '260px', paddingBottom: '10px', borderLeft: '1px solid #bfbfbf' }}>
                <div className='d-inline-block' style={{ marginLeft: '4px', marginBottom: '5px' }}>
                    <button
                        className='btn'
                        style={{ color: '#546E7A',  backgroundColor: '#fff', borderColor: '#546E7A', height: '40px', width: '80px' }}
                        onClick={() => setDonationAmount(10)}
                    >$10</button>
                </div>
                <div className='d-inline-block' style={{ marginLeft: '4px', marginBottom: '5px' }}>
                    <button
                        className='btn'
                        style={{ color: '#546E7A',  backgroundColor: '#fff', borderColor: '#546E7A', height: '40px', width: '80px' }}
                        onClick={() => setDonationAmount(50)}
                    >$50</button>
                </div>
                <div className='d-inline-block' style={{ marginLeft: '4px', marginBottom: '5px' }}>
                    <button
                        className='btn'
                        style={{ color: '#546E7A',  backgroundColor: '#fff', borderColor: '#546E7A', height: '40px', width: '80px' }}
                        onClick={() => setDonationAmount(100)}
                    >$100</button>
                </div>
                <div className='d-inline-block' style={{ marginLeft: '4px', marginBottom: '5px' }}>
                    <button
                        className='btn'                        
                        style={{ color: '#546E7A',  backgroundColor: '#fff', borderColor: '#546E7A', height: '40px', width: '80px' }}
                        onClick={() => setDonationAmount(500)}
                    >$500</button>
                </div>
                <div className='d-inline-block' style={{ marginLeft: '4px', marginBottom: '5px' }}>
                    <button
                        className='btn'
                        style={{ color: '#546E7A',  backgroundColor: '#fff', borderColor: '#546E7A', height: '40px', width: '80px' }}
                        onClick={() => setDonationAmount(1000)}
                    >$1000</button>
                </div>
            </div>
        </div>
        <div className='mt-5 mb-4' style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Tell us about yourself</div>
        <div className='mb-4'>
            <label className='font-weight-bold'>Name</label>
            <input
                type='text'
                name='name'
                className="form-control"
                placeholder="Name"
                value={info.name}
                onChange={handleInfoChange}
            />
            {info.nameTouched && !info.name.length &&
                <span className="text-danger mt-1">
                    Your Name is required
                </span>
            }
        </div>
        <div className='mb-4'>
            <label className='font-weight-bold'>Email</label>
            <input
                type='text'
                name='email'
                className="form-control"
                placeholder="Email"
                value={info.email}
                onChange={handleInfoChange}
            />
            {info.emailTouched && (!info.email.length || !info.email.match(mailFormat)) &&
                <span className="text-danger mt-1">
                    Your Email is required
                </span>
            }
        </div>
        <div className='mb-4'>
            <label className='font-weight-bold'>Message</label>
            <textarea
                className='form-control'
                name='message'
                placeholder='message'
                onChange={handleInfoChange}
            ></textarea>
        </div>
        <PayPalScriptProvider
            options={{
        "client-id": "AV5crdAJsskL-xu5y6yWucjUT-Dkxdo9hZge2jBXfbX63WcwS_HuBncJgo3Sa3LV-RAfucHgt-RXXspO",
        components: "buttons",
                currency: "USD",
                "merchant-id": props.orphanage.actId,
                
            }}
        >
            <ButtonWrapper
                currency={currency}
                showSpinner={false}
                amount= {amount}
                info={info}
                handleStatus ={UpdateStatus}
                username={props.userDetails.username} 
                token={props.userDetails.token}
                orphanage_name={props.orphanage.name}
                
            />
        </PayPalScriptProvider>
  
      </div>:
        transactionStat== 'successful' ?
            <div> {transactionStat}
                <a href='/'>  <button>close</button></a>
            </div> : props.orphanage.acttype == 'stripe' ?
                <div>
                    <div style={{ justifyContent: 'center', alignContent: 'center' }}>YOU ARE DONATING TO  {(props.orphanage.name).toUpperCase()}</div>
                    <div >
                        <div style={{ justifyContent: 'center', alignContent: 'center', margin: 20 }}>
                            {!clientKey && <input type={'number'} style={{ borderRadius: 5, width: '100%', fontSize: '12px' }} value={amount} onChange={handleAmountChange} placeholder='Amount to donate $ ' />}
                            {(amount && !clientKey) && <button style={{ margin: 20 }} onClick={handleProcessPay}>Process Payment</button>}
                            {loading && <Circles color="Blue" />}

                        </div>
                        <div>
                            {clientKey && <Elements stripe={stripePromise}>
                                <StripeCheckoutForm client_key={clientKey} amount={amount} handleTransaction={UpdateStatus} username={props.userDetails.username} token={props.userDetails.token} orphanage_name={props.orphanage.name} />
                            </Elements>
                            }
                        </div>
                    </div>

                </div> : <div> Please select Orphanage from <a href='/orphenages'>Here</a></div>
}
      </div >

	return (
    <div style={{ display: 'flex', fontSize: '14px', justifyContent: 'center', margin: 'auto', maxWidth: '480px', justifySelf: 'center', alignSelf: 'center', alignContent: 'center' }}>
        {isTabletOrMobile ? Page : isDesktopOrLaptop ? Page : isPortrait ? Page : Page}
    </div>
);
}

