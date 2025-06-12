import { FileText } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export const CreateInvoiceButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="bg-amber-400 text-black px-5 py-3 rounded-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold flex items-center justify-center flex-1 md:flex-initial"
    >
      {pending ? (
        <div className="w-5 h-5 mr-2 animate-spin border-4 border-white border-t-transparent rounded-full"></div>
      ) : (
        <>
          <FileText className="w-5 h-5 mr-2" />
          Buat Invoice
        </>
      )}
    </button>
  );
};
