import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-md">
      <div className="w-full max-w-lg bg-neutral-50 border-4 border-neutral-200 shadow-[8px_8px_0px_0px_rgba(230,230,230,1)] mx-3 p-4 md:p-8 rounded-none relative transition-all animate-[bounceIn_0.3s_ease-in-out]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 bg-blue-500 rounded-none text-white border-2 border-neutral-200 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(230,230,230,1)] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};
