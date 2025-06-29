import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { Modal } from "./modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "warning";
  onConfirm?: (() => void) | null;
}

export const Alert = ({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
  onConfirm = null,
}: Props) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        <div
          className={`
            w-16 h-16 rounded-none flex items-center justify-center border-4 border-neutral-800
            ${
              type === "success"
                ? "bg-green-600"
                : type === "error"
                ? "bg-red-600"
                : "bg-yellow-600"
            }
          `}
        >
          {type === "success" && (
            <CheckCircle className="w-8 h-8 text-white" strokeWidth={3} />
          )}
          {type === "error" && (
            <X className="w-8 h-8 text-white" strokeWidth={3} />
          )}
          {type === "warning" && (
            <AlertTriangle className="w-8 h-8 text-white" strokeWidth={3} />
          )}
        </div>
        <h2 className="text-2xl font-black mt-2">{title}</h2>
        <p className="text-center font-medium text-gray-800">{message}</p>

        <form className="flex w-full gap-4 mt-4">
          {onConfirm && (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-neutral-800 text-white border-4 border-neutral-700 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-3 px-4 bg-red-600 text-white border-4 border-neutral-700 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
              >
                Konfirmasi
              </button>
            </>
          )}

          {!onConfirm && (
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-indigo-600 text-white border-4 border-neutral-700 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
            >
              OK
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
};
