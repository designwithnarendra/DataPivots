"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { Home, FileText } from "lucide-react";

export function GlobalHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navigationItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: Home,
      isActive: pathname === "/dashboard",
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileText,
      isActive: pathname === "/reports",
    },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <h1
            className="text-2xl font-bold text-primary font-heading cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/dashboard")}
          >
            DataPivots
          </h1>

          {/* Navigation Menu */}
          <nav className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={item.isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className={`flex items-center space-x-2 px-4 ${
                    item.isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Right side - User info, Theme toggle, Logout */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.name}
          </span>
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
