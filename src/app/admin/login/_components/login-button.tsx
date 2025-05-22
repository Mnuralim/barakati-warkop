import { LogIn } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export const LoginButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 
                  rounded-md border-3 border-black dark:border-neutral-800
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  hover:translate-y-0.5 hover:translate-x-0.5
                  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  active:translate-y-1 active:translate-x-1
                  active:shadow-none
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Memproses...</span>
        </>
      ) : (
        <>
          <LogIn className="w-5 h-5" />
          <span>Masuk</span>
        </>
      )}
    </button>
  );
};
