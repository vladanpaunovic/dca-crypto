import React from "react";
import { Visa, Mastercard, Maestro, Amex } from "react-payment-logos/dist/flat";

const PaymentMethods = () => {
  return (
    <div>
      <div>
        <ul>
          <li className="flex gap-2">
            <Visa className="payment-icon w-12" />
            <Mastercard className="payment-icon w-12" />
            <Maestro className="payment-icon w-12" />
            <Amex className="payment-icon w-12" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentMethods;
