'use client';

import React from 'react';
import { Conversation, User } from '@/types';

interface ConversationListProps {
  conversations: Array<{
    conversation: Conversation;
    otherUser: User;
    lastMessage?: {
      content: string;
      createdAt: Date;
      isFromCurrentUser: boolean;
    };
    unreadCount: number;
  }>;
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map(({ conversation, otherUser, lastMessage, unreadCount }) => (
        <button
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
            selectedConversationId === conversation.id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-medium">
                {otherUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className={`font-medium truncate ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                  {otherUser.name}
                </h3>
                {lastMessage && (
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatTime(lastMessage.createdAt)}
                  </span>
                )}
              </div>
              {lastMessage && (
                <p className={`text-sm truncate mt-0.5 ${
                  unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}>
                  {lastMessage.isFromCurrentUser && <span className="text-gray-400">You: </span>}
                  {lastMessage.content}
                </p>
              )}
              <p className="text-xs text-gray-400 capitalize mt-1">
                {otherUser.role}
              </p>
            </div>
            {unreadCount > 0 && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
