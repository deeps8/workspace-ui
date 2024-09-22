import { Avatar, AvatarFallback } from "./avatar";

export function Logo() {
  return (
    <Avatar className="bg-primary rounded-sm">
      <AvatarFallback className="text-primary-foreground font-bold text-2xl font-mono">W</AvatarFallback>
    </Avatar>
  );
}
