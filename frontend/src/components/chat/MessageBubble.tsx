'use client';

import { format } from 'date-fns';
import { UserRole } from '@/types/user.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageBubbleProps {
  message: {
    sender: string;
    senderRole: UserRole;
    content: string;
    createdAt: string;
    _id?: string;
  };
  isCurrentUser: boolean;
}

export default function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <div
      className={`flex gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="User avatar" />
          {/* <AvatarFallback>
            {message.senderRole === UserRole. ? 'A' : 'U'}
          </AvatarFallback> */}
        </Avatar>
      )}
      <div
        className={`flex flex-col max-w-xs md:max-w-md lg:max-w-lg ${
          isCurrentUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`rounded-lg px-4 py-2 ${
            isCurrentUser
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-secondary text-secondary-foreground rounded-bl-none'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {/* {message.senderRole === UserRole.ADMIN && (
              <Badge variant="default" className="text-xs">
                Admin
              </Badge>
            )} */}
          </div>
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {format(new Date(message.createdAt), 'MMM d, h:mm a')}
        </span>
      </div>
      {isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="Your avatar" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}