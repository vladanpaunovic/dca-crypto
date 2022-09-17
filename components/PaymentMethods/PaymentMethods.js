import React from "react";
import PaymentIcon from "react-payment-icons";

const PaymentMethods = () => {
  const paymentMethods = ["visa", "mastercard", "maestro", "amex"];
  return (
    <div>
      <div>
        <ul className="flex gap-2">
          {paymentMethods.map((method) => (
            <li key={method}>
              <PaymentIcon id={method} className="payment-icon w-12" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaymentMethods;
