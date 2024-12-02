import { UserSolid } from "@mynaui/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: {
    avatarUrl: string | null;
    username: string;
  };
  className?: string;
}

export default function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("border", className)}>
      <AvatarImage src={user.avatarUrl} alt={`@${user.username}`} />
      <AvatarFallback>
        <UserSolid className="h-[45%] w-[45%] text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  );
}
