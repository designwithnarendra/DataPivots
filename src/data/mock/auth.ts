import { User, AuthSession } from "@/types";

export const DEMO_CREDENTIALS = {
  email: "demo@datapivots.com",
  password: "demo123",
};

export const DEMO_USER: User = {
  id: "demo-user-1",
  name: "Demo User",
  email: "demo@datapivots.com",
};

export const createMockSession = (user: User): AuthSession => ({
  user,
  isAuthenticated: true,
});

export const validateCredentials = (
  email: string,
  password: string
): boolean => {
  return (
    email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
  );
};
