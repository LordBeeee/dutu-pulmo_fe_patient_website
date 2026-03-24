import api from './api';
import type { ChatMessage, ChatRoom } from '@/types/chat';

const CHATROOMS_BASE_URL = '/chatrooms';
const CHATMESSAGES_BASE_URL = '/chatmessages';

export const chatService = {
  getMyChatRooms: async (): Promise<ChatRoom[]> => {
    const response = await api.get<ChatRoom[]>(`${CHATROOMS_BASE_URL}/my-chats`);
    return response.data;
  },

  createOrGetChatRoom: async (userId1: string, userId2: string): Promise<ChatRoom> => {
    const response = await api.post<ChatRoom>(CHATROOMS_BASE_URL, { user1Id: userId1, user2Id: userId2 });
    return response.data;
  },

  getMessagesByRoom: async (chatroomId: string): Promise<ChatMessage[]> => {
    const response = await api.get<ChatMessage[]>(
      `${CHATMESSAGES_BASE_URL}/chatroom/${chatroomId}`,
    );
    return response.data;
  },

  sendMessage: async (chatroomId: string, content: string): Promise<ChatMessage> => {
    const response = await api.post<ChatMessage>(CHATMESSAGES_BASE_URL, {
      chatroomId,
      content,
    });
    return response.data;
  },
};

export default chatService;
