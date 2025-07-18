"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { GlobalHeader } from "@/components/molecules/GlobalHeader";
import { TwoColumnChatLayout } from "@/components/organisms/TwoColumnChatLayout";

export default function ChatPage() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary font-heading">
            DataPivots
          </h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />

      {/* Main Chat Interface */}
      <main className="flex">
        <div className="w-full flex flex-col h-[calc(100vh-4rem)]">
          <TwoColumnChatLayout />
        </div>
      </main>
    </div>
  );
}
