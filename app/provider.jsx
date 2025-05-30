"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";
import { useState } from "react";
import { userDetailContext } from "@/context/UserDetailContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";




function Provider({ children }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  const [userDetail, setUserDetail] = useState(null); // add state here

  return (
    <ConvexProvider client={convex}>
      <userDetailContext.Provider value={{ userDetail, setUserDetail }}>
{/* NEXT_PUBLIC_PAYPAL_CLIENT_ID=AY78yVr1eQg30r-SPyBb6KBMPR3kCtlp5niVZbQLw9RPXh36MTOimcMyls8J9qKiD4TIAz1HX3zEHGTQ
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AY78yVr1eQg30r-SPyBb6KBMPR3kCtlp5niVZbQLw9RPXh36MTOimcMyls8J9qKiD4TIAz1HX3zEHGTQ */}
<PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,currency: "USD" }}>
        {children}
        </PayPalScriptProvider>
      </userDetailContext.Provider>
    </ConvexProvider>
  );
}

export default Provider;
