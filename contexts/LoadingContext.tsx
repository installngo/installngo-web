"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface LoadingContextType {
  isLoading: boolean;
  message?: string;
  start: (message?: string) => string;
  stop: (id: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const loaderStack = useRef<
    { id: string; message?: string; startTime: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const MIN_VISIBLE = 500;
  const pathname = usePathname();

  /** Refresh UI loading state & message from stack */
  const updateState = () => {
    const hasLoaders = loaderStack.current.length > 0;
    setIsLoading(hasLoaders);

    if (hasLoaders) {
      const last = loaderStack.current[loaderStack.current.length - 1];
      setMessage(last.message);
    } else {
      setMessage(undefined);
    }
  };

  /** Start loader */
  const start = (msg?: string) => {
    const id = crypto.randomUUID();
    loaderStack.current.push({
      id,
      message: msg,
      startTime: Date.now(),
    });
    updateState();
    return id;
  };

  /** Stop loader */
  const stop = (id: string) => {
    const index = loaderStack.current.findIndex((x) => x.id === id);
    if (index === -1) return;

    const loader = loaderStack.current[index];
    const elapsed = Date.now() - loader.startTime;
    const remaining = Math.max(MIN_VISIBLE - elapsed, 0);

    setTimeout(() => {
      loaderStack.current.splice(index, 1);
      updateState();
    }, remaining);
  };

  /** Auto-clear loaders on route change */
  useEffect(() => {
    if (loaderStack.current.length === 0) return;

    loaderStack.current = [];
    updateState();
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading, message, start, stop }}>
      {children}
      {isLoading && <Loader message={message} />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error("useLoading must be used inside LoadingProvider");
    return ctx;
};

const Loader = ({ message }: { message?: string }) => (
  <div
    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-sm transition-opacity duration-300 opacity-100"
    style={{ backgroundColor: "var(--loader-overlay)" }}
  >
    <div
      className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
      style={{
        borderColor: "var(--loader-border) transparent transparent transparent",
      }}
    />
    {message && (
      <p
        className="mt-4 text-lg font-medium text-center"
        style={{ color: "var(--loader-text)" }}
      >
        {message}
      </p>
    )}
  </div>
);