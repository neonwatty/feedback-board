"use client";

import { createContext, useContext } from "react";
import type { FeedbackBoardActions, FeedbackUser } from "./types";

interface FeedbackBoardContextValue {
  actions: FeedbackBoardActions;
  user: FeedbackUser | null;
  basePath: string;
  loginPath: string;
}

const FeedbackBoardContext = createContext<FeedbackBoardContextValue | null>(null);

/** Props for the FeedbackBoardProvider component. */
export interface FeedbackBoardProviderProps {
  /** Server action implementations. The host creates "use server" wrappers that call the pure action functions. */
  actions: FeedbackBoardActions;
  /** Currently authenticated user, or null if logged out. */
  user: FeedbackUser | null;
  /** Base path prefix for all feedback routes. Defaults to "/feedback". Set to "" if feedback is at root. */
  basePath?: string;
  /** Path to redirect unauthenticated users. Defaults to "/login". */
  loginPath?: string;
  /** React children. */
  children: React.ReactNode;
}

export function FeedbackBoardProvider({
  actions,
  user,
  basePath = "/feedback",
  loginPath = "/login",
  children,
}: FeedbackBoardProviderProps) {
  return (
    <FeedbackBoardContext.Provider value={{ actions, user, basePath, loginPath }}>
      {children}
    </FeedbackBoardContext.Provider>
  );
}

export function useFeedbackBoard() {
  const context = useContext(FeedbackBoardContext);
  if (!context) {
    throw new Error("useFeedbackBoard must be used within a FeedbackBoardProvider");
  }
  return context;
}
