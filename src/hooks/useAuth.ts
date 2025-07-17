"use client";

import { useState, useEffect } from "react";
import { AuthSession } from "@/types";
import {
  validateCredentials,
  createMockSession,
  DEMO_USER,
} from "@/data/mock/auth";

const AUTH_STORAGE_KEY = "datapivots-auth-session";

export const useAuth = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load session from localStorage on mount
    const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession) as AuthSession;
        setSession(parsedSession);
      } catch (error) {
        console.error("Failed to parse stored session:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (validateCredentials(email, password)) {
      const newSession = createMockSession(DEMO_USER);
      setSession(newSession);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newSession));
      return { success: true };
    } else {
      return { success: false, error: "Invalid email or password" };
    }
  };

  const loginWithGoogle = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    // Simulate Google SSO - just create a session
    const newSession = createMockSession({
      ...DEMO_USER,
      name: "Demo User (Google)",
    });
    setSession(newSession);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newSession));
    return { success: true };
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return {
    session,
    isLoading,
    isAuthenticated: session?.isAuthenticated ?? false,
    user: session?.user ?? null,
    login,
    loginWithGoogle,
    logout,
  };
};
