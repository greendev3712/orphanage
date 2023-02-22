import * as React from "react";
import { CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#303238",
      fontSize: "16px",
      fontFamily: "sans-serif",
      fontSmoothing: "antialiased",
      
      "::placeholder": {
        color: "#CFDFFF"
      }
    },
    invalid: {
      color: "#e5424d",
      ":focus": {
        color: "#303238"
      }
    }
  }
};

function CardSection() {
  return (
    <label>
      Card details
      <div style={{border:'2px solid black'}}>

      <CardElement  />
      </div>
    </label>
  );
}

export default CardSection;