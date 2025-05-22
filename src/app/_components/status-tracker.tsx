import React from "react";
import { Package, Clock, CheckCircle, X } from "lucide-react";
import type { OrderStatus } from "@prisma/client";

interface Props {
  status: OrderStatus;
}

export const StatusTracker = ({ status }: Props) => {
  const steps = [
    {
      label: "Diterima",
      icon: <Package className="w-5 h-5" />,
      status: "PROCESSING",
    },
    {
      label: "Diproses",
      icon: <Clock className="w-5 h-5" />,
      status: "PROCESSING",
    },
    {
      label: "Selesai",
      icon: <CheckCircle className="w-5 h-5" />,
      status: "COMPLETED",
    },
  ];

  let activeStep = 0;
  if (status === "PROCESSING") activeStep = 1;
  if (status === "COMPLETED") activeStep = 2;
  if (status === "CANCELLED") activeStep = -1;

  return (
    <div className="w-full my-8">
      {status === "CANCELLED" ? (
        <div className="flex items-center justify-center bg-red-500 text-white border-4 border-neutral-700 p-4 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <X className="w-6 h-6 mr-2" strokeWidth={2.5} />
          <span className="text-xl font-black">Pesanan Dibatalkan</span>
        </div>
      ) : (
        <div className="relative">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center z-10 ${
                  index <= activeStep ? "opacity-100" : "opacity-50"
                }`}
              >
                <div
                  className={`rounded-none w-16 h-16 flex items-center justify-center border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] 
                  ${
                    index < activeStep
                      ? "bg-emerald-500 text-white"
                      : index === activeStep
                      ? "bg-indigo-600 text-white"
                      : "bg-neutral-200"
                  }`}
                >
                  {step.icon}
                </div>
                <span className="mt-2 font-bold text-center">{step.label}</span>
              </div>
            ))}
          </div>

          <div className="absolute top-8 left-0 w-full h-2 flex -z-0">
            <div
              className={`h-full ${
                activeStep >= 1 ? "bg-emerald-500" : "bg-neutral-300"
              } border-t-4 border-b-4 border-neutral-700 w-1/2`}
            ></div>
            <div
              className={`h-full ${
                activeStep >= 2 ? "bg-emerald-500" : "bg-neutral-300"
              } border-t-4 border-b-4 border-neutral-700 w-1/2`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
