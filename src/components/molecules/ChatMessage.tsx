import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatMessage as ChatMessageType } from "@/types";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.type === "ai";
  const isLoading = message.status === "pending";

  return (
    <div className={cn("flex gap-3 p-4", isAI ? "bg-card" : "bg-background")}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs",
            isAI
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isAI ? "AI Assistant" : "You"}
          </span>
          {isLoading && (
            <Badge variant="outline" className="text-xs">
              Typing...
            </Badge>
          )}
        </div>

        <div
          className={cn(
            "text-sm leading-relaxed",
            isLoading && "animate-pulse opacity-70"
          )}
        >
          {message.content}
        </div>

        <div className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
