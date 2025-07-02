'use client';

import React, { useState, useRef } from 'react';
import { Button } from '../base/Button';

export interface MessageInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  maxLength = 1000,
  className = '',
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);

      // Auto-resize textarea
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const sendIcon = (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );

  return (
    <div
      className={`flex items-end gap-2 p-4 bg-white border-t border-secondary-200 ${className}`}
    >
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={`
            w-full px-4 py-2 pr-16 border border-secondary-300 rounded-lg 
            resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 
            focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed
            max-h-30 min-h-10
          `
            .replace(/\s+/g, ' ')
            .trim()}
          style={{ minHeight: '2.5rem' }}
        />

        {maxLength && (
          <div className="absolute bottom-1 right-2 text-xs text-secondary-400">
            {message.length}/{maxLength}
          </div>
        )}
      </div>

      <Button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        icon={sendIcon}
        size="md"
        className="flex-shrink-0"
      >
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
