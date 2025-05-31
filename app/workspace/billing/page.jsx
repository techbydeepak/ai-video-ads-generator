"use client";

import { Button } from "@/components/ui/button";
import { userDetailContext } from "@/context/UserDetailContext";

import { useMutation } from "convex/react";
import { CircleDollarSign } from "lucide-react";
import React, { useContext } from "react";
import { api } from "@/convex/_generated/api";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";

export const creditsPlans = [
  { credits: 80, cost: 5 },
  { credits: 200, cost: 10 },
  { credits: 450, cost: 20 },
  { credits: 1500, cost: 50 },
];

function Billing() {
  const { userDetail } = useContext(userDetailContext);

  const updateUserCredits = useMutation(api.users.updateUserCredits);
  if (!userDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="animate-spin h-12 w-12 border-4 border-[#C41E3A] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const onPaymentSuccess = async (cost, credits) => {
    setUserDetail((prev) => ({
      ...prev,
      credits: Number(userDetail?.credits) + credits,
    }));

    const resp = await updateUserCredits({
      credits: Number(userDetail?.credits) + credits,
      uid: userDetail?._id,
    });
    console.log(resp);
    toast.success("Credit added successfully", {
      duration: 4000,
      position: "top-center",
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-[#1F1F1F] rounded-2xl shadow-2xl p-10 border-4 border-[#C41E3A]">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-[#FF6F00] drop-shadow-lg">
          Buy Video Credits
        </h1>

        <div className="mb-10 p-6 bg-[#2A2A2A] border border-[#C41E3A] rounded-xl">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Your Total Credits
              </h2>
              <p className="text-md text-gray-400 mt-1">10 Credits = 1 Video</p>
            </div>
            <div className="text-4xl font-extrabold text-[#C41E3A] min-w-[120px] text-center">
              {userDetail?.credits || 0}
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-8">
          Available Credit Plans
        </h2>

        <div className="space-y-6">
          {creditsPlans.map((plan, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-center border border-[#C41E3A] p-6 rounded-xl bg-[#2A2A2A] shadow-lg hover:shadow-[#C41E3A]/50 transition-shadow"
            >
              <div className="flex items-center gap-5 mb-4 sm:mb-0">
                <CircleDollarSign className="text-[#C41E3A] w-10 h-10" />
                <p className="text-3xl font-bold text-white">
                  {plan.credits} Credits
                </p>
              </div>

              <div className="flex items-center gap-8">
                <p className="text-2xl font-bold text-[#FF6F00]">
                  ${plan.cost}
                </p>

                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: plan.cost,
                            currency_code: "USD",
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    const details = await actions.order.capture();
                    if (details.status === "COMPLETED") {
                      await onPaymentSuccess(plan.cost, plan.credits);
                    } else {
                      toast.error("Payment not completed", {
                        duration: 4000,
                        position: "top-center",
                      });
                    }
                  }}
                  onCancel={() =>
                    toast.info("Payment cancelled", {
                      duration: 4000,
                      position: "top-center",
                    })
                  }
                  style={{
                    layout: "horizontal",
                    color: "silver",
                    shape: "pill",
                    label: "pay",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Billing;
