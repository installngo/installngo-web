"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  const getBgColorClass = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-[var(--toast-success-bg)]";
      case "error":
        return "bg-[var(--toast-error-bg)]";
      case "info":
      default:
        return "bg-[var(--toast-info-bg)]";
    }
  };

  const getTextColorClass = () => "text-[var(--toast-text)]";

  const getIcon = (type: ToastType) => {
    const iconProps = { className: "w-5 h-5 " + getTextColorClass() };
    switch (type) {
      case "success":
        return <CheckCircle2 {...iconProps} />;
      case "error":
        return <AlertCircle {...iconProps} />;
      case "info":
      default:
        return <Info {...iconProps} />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[9999]">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              role="alert"
              className={`${getBgColorClass(toast.type)} px-5 py-3 rounded-lg shadow-lg font-medium flex items-center justify-between gap-3 max-w-sm w-full`}
            >
              <div className="flex items-center gap-2">
                {getIcon(toast.type)}
                <span className={getTextColorClass()}>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                aria-label="Close toast"
                className={`${getTextColorClass()} opacity-80 hover:opacity-100 text-lg font-bold leading-none`}
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};