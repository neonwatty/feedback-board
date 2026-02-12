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

export interface FeedbackBoardProviderProps {
  actions: FeedbackBoardActions;
  user: FeedbackUser | null;
  basePath?: string;
  loginPath?: string;
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
