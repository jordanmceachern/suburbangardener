"use client";

import React, { createContext, useContext } from "react";
import { useSession, SessionProvider } from "next-auth/react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
});

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const authValue: AuthContextType = {
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    user: session?.user
      ? {
          id: (session.user as any).id || "anonymous",
          name: session.user.name || "User",
          email: session.user.email || "",
          image: session.user.image || undefined,
        }
      : null,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </SessionProvider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
