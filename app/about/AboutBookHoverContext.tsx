"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type BookHoverId = "devils" | "culture";

type AboutBookHoverContextValue = {
  bookHover: BookHoverId | null;
  setBookHover: Dispatch<SetStateAction<BookHoverId | null>>;
};

const AboutBookHoverContext = createContext<AboutBookHoverContextValue | null>(null);

export function AboutBookHoverProvider({ children }: { children: ReactNode }) {
  const [bookHover, setBookHover] = useState<BookHoverId | null>(null);
  const value = useMemo(() => ({ bookHover, setBookHover }), [bookHover]);

  return (
    <AboutBookHoverContext.Provider value={value}>{children}</AboutBookHoverContext.Provider>
  );
}

export function useAboutBookHover() {
  const context = useContext(AboutBookHoverContext);
  if (!context) {
    throw new Error("useAboutBookHover must be used within AboutBookHoverProvider");
  }
  return context;
}

export function AboutBookHoverOverlay() {
  const { bookHover } = useAboutBookHover();
  if (bookHover === null) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[3] bg-[#f5f3ef]/20 backdrop-blur-md motion-reduce:backdrop-blur-none"
      aria-hidden
    />
  );
}
