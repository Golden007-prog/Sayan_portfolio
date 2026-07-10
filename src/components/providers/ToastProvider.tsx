"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ToastItem {
  id: number;
  message: string;
  icon?: "check" | "info";
}

interface ToastApi {
  toast: (message: string, opts?: { icon?: "check" | "info" }) => void;
}

const ToastContext = createContext<ToastApi>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

/** Checkmark that draws itself on entry (§155) */
function DrawnCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <motion.path
        d="M3 8.5 L6.5 12 L13 4.5"
        stroke="var(--accent-4)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
      />
    </svg>
  );
}

/**
 * Glass toast system — top-right stack, auto-dismiss, swipe-to-dismiss
 * on touch (§200). Announced politely to screen readers.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, opts?: { icon?: "check" | "info" }) => {
      const id = ++idRef.current;
      setToasts((t) => [...t.slice(-3), { id, message, icon: opts?.icon }]);
      window.setTimeout(() => dismiss(id), 3500);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-4 z-[120] flex flex-col items-end gap-2 safe-top"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_e, info) => {
                if (Math.abs(info.offset.x) > 80) dismiss(t.id);
              }}
              className="glass-3 pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 text-sm"
            >
              {t.icon === "check" && <DrawnCheck />}
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
