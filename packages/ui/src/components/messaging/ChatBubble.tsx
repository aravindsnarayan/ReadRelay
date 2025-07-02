import React from 'react';
import { SmallText } from '../base/Typography';
import { Avatar } from '../user/Avatar';

export interface ChatBubbleProps {
  message: {
    id: string;
    content: string;
    timestamp: Date;
    sender: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
  };
  isOwn?: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isOwn = false,
  showAvatar = true,
  showTimestamp = true,
  className = '',
}) => {
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const bubbleClasses = isOwn
    ? 'bg-primary-600 text-white ml-auto'
    : 'bg-secondary-100 text-secondary-900';

  return (
    <div
      className={`flex items-end gap-2 mb-4 ${isOwn ? 'flex-row-reverse' : ''} ${className}`}
    >
      {showAvatar && !isOwn && (
        <Avatar
          src={message.sender.avatarUrl}
          name={message.sender.name}
          size="sm"
          className="flex-shrink-0"
        />
      )}

      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'text-right' : ''}`}>
        <div
          className={`
            inline-block px-4 py-2 rounded-2xl 
            ${bubbleClasses}
            ${isOwn ? 'rounded-br-sm' : 'rounded-bl-sm'}
          `
            .replace(/\s+/g, ' ')
            .trim()}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {showTimestamp && (
          <SmallText
            color="muted"
            className={`mt-1 ${isOwn ? 'text-right' : 'text-left'}`}
          >
            {formatTime(message.timestamp)}
          </SmallText>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
