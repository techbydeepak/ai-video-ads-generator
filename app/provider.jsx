"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ClerkProvider } from '@clerk/nextjs';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function Provider({ children }) {
  return (
     <ClerkProvider>
    <ConvexProvider client={convex}>
      <PayPalScriptProvider 
        options={{ 
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: "USD" 
        }}
      >
        {children}
      </PayPalScriptProvider>
    </ConvexProvider>
    </ClerkProvider>
  );
}