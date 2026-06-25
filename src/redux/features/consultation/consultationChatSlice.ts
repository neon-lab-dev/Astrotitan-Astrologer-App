/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ConsultationChatMessage {
  _id?: string;
  tempId?: string;
  consultationId: string;
  sender: string | { _id: string; firstName?: string; lastName?: string; accountId?: string; profilePicture?: string };
  receiver: string | { _id: string; firstName?: string; lastName?: string; accountId?: string; profilePicture?: string };
  content: string;
  isRead?: boolean;
  status?: "sent" | "delivered" | "read";
  readAt?: string;
  createdAt?: string;
  isTemp?: boolean;
  [key: string]: unknown;
}

export interface ConsultationChatUser {
  consultationId: string;
  consultationStatus: "pending" | "accepted" | "declined" | "ended";
  method: "chat" | "call";
  consultationFor: string;
  participant: {
    _id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    accountId?: string;
    role: "user" | "astrologer";
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isActive: boolean;
  startedAt?: string;
  endedAt?: string;
}

interface ConsultationChatState {
  chatList: ConsultationChatUser[];
  selectedConsultationId: string | null;
  selectedConsultationMessages: ConsultationChatMessage[];
  selectedParticipant: ConsultationChatUser["participant"] | null;
  currentParticipantId: string | null;
  onlineUsers: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ConsultationChatState = {
  chatList: [],
  selectedConsultationId: null,
  selectedConsultationMessages: [],
  selectedParticipant: null,
  currentParticipantId: null,
  onlineUsers: [],
  isLoading: false,
  error: null,
};

const consultationChatSlice = createSlice({
  name: "consultationChat",
  initialState,
  reducers: {
    // ✅ Set chat list
    setConsultationChatList: (state, action: PayloadAction<ConsultationChatUser[]>) => {
      state.chatList = action.payload;
    },

    // ✅ Select a consultation
    setSelectedConsultation: (
      state,
      action: PayloadAction<{
        consultationId: string;
        participant: ConsultationChatUser["participant"];
        currentParticipantId: string;
      }>
    ) => {
      state.selectedConsultationId = action.payload.consultationId;
      state.selectedParticipant = action.payload.participant;
      state.currentParticipantId = action.payload.currentParticipantId;
    },

    // ✅ Set messages for selected consultation
    setSelectedConsultationMessages: (state, action: PayloadAction<ConsultationChatMessage[]>) => {
      state.selectedConsultationMessages = action.payload;
    },

    // ✅ Add a message to selected consultation
   addConsultationMessage: (state, action: PayloadAction<ConsultationChatMessage>) => {
  const newMessage = action.payload;
  
  // Helper to extract ID string whether it's an object or a string
  const getID = (id: any) => (id?._id ? id._id : id);

  const exists = state.selectedConsultationMessages.some((m) => {
    const mId = getID(m._id);
    const newId = getID(newMessage._id);
    const mTempId = m.tempId;
    const newTempId = newMessage.tempId;

    return (newId && mId === newId) || (newTempId && mTempId === newTempId);
  });

  if (!exists) {
    // Use .push() - Immer (used by RTK) handles this perfectly
    state.selectedConsultationMessages.push(newMessage);
  }
},

    // ✅ Update message ID (replace temp with real)
    updateConsultationMessageId: (state, action: PayloadAction<{ tempId: string; realId: string; createdAt?: string }>) => {
  const { tempId, realId, createdAt } = action.payload;
  const message = state.selectedConsultationMessages.find(m => m.tempId === tempId || m._id === tempId);
  
  if (message) {
    message._id = realId; // Replace the temp ID with the DB ID
    message.isTemp = false;
    if (createdAt) message.createdAt = createdAt;
  }
},

    // ✅ Mark messages as read in a consultation
    markConsultationMessagesAsRead: (state, action: PayloadAction<string>) => {
      const consultationId = action.payload;
      state.selectedConsultationMessages = state.selectedConsultationMessages.map((msg) => {
        if (msg.consultationId === consultationId && !msg.isRead) {
          return { ...msg, isRead: true, status: "read", readAt: new Date().toISOString() };
        }
        return msg;
      });

      // Update unread count in chat list
      state.chatList = state.chatList.map((chat) => {
        if (chat.consultationId === consultationId) {
          return { ...chat, unreadCount: 0 };
        }
        return chat;
      });
    },

    // ✅ Update unread count for a consultation
    updateUnreadCount: (
      state,
      action: PayloadAction<{ consultationId: string; unreadCount: number }>
    ) => {
      const { consultationId, unreadCount } = action.payload;
      state.chatList = state.chatList.map((chat) => {
        if (chat.consultationId === consultationId) {
          return { ...chat, unreadCount };
        }
        return chat;
      });
    },

    // ✅ Update chat status (when consultation status changes)
    updateConsultationStatus: (
      state,
      action: PayloadAction<{ consultationId: string; status: string }>
    ) => {
      const { consultationId, status } = action.payload;
      state.chatList = state.chatList.map((chat) => {
        if (chat.consultationId === consultationId) {
          return { ...chat, consultationStatus: status as any, isActive: status === "accepted" };
        }
        return chat;
      });
    },

    // ✅ Clear selected consultation
    clearSelectedConsultation: (state) => {
      state.selectedConsultationId = null;
      state.selectedConsultationMessages = [];
      state.selectedParticipant = null;
      state.currentParticipantId = null;
    },

    // ✅ Clear all chat data
    clearConsultationChat: (state) => {
      state.chatList = [];
      state.selectedConsultationId = null;
      state.selectedConsultationMessages = [];
      state.selectedParticipant = null;
      state.currentParticipantId = null;
      state.onlineUsers = [];
    },

    // ✅ Online users
    setConsultationOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },

    addConsultationOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },

    removeConsultationOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
    },

    // ✅ Loading states
    setConsultationChatLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setConsultationChatError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  setConsultationChatList,
  setSelectedConsultation,
  setSelectedConsultationMessages,
  addConsultationMessage,
  updateConsultationMessageId,
  markConsultationMessagesAsRead,
  updateUnreadCount,
  updateConsultationStatus,
  clearSelectedConsultation,
  clearConsultationChat,
  setConsultationOnlineUsers,
  addConsultationOnlineUser,
  removeConsultationOnlineUser,
  setConsultationChatLoading,
  setConsultationChatError,
} = consultationChatSlice.actions;

// Export selectors
export const selectConsultationChatList = (state: { consultationChat: ConsultationChatState }) =>
  state.consultationChat.chatList;

export const selectSelectedConsultationId = (state: { consultationChat: ConsultationChatState }) =>
  state.consultationChat.selectedConsultationId;

export const selectSelectedConsultationMessages = (state: { consultationChat: ConsultationChatState }) =>
  state.consultationChat.selectedConsultationMessages;

export const selectSelectedParticipant = (state: { consultationChat: ConsultationChatState }) =>
  state.consultationChat.selectedParticipant;

export const selectCurrentParticipantId = (state: { consultationChat: ConsultationChatState }) =>
  state.consultationChat.currentParticipantId;

export const selectConsultationOnlineUsers = (state: { consultationChat: ConsultationChatState }) =>
  state.consultationChat.onlineUsers;

export const selectConsultationChatLoading = (state: { consultationChat: ConsultationChatState }) =>
  state.consultationChat.isLoading;

export const selectConsultationChatError = (state: { consultationChat: ConsultationChatState }) =>
  state.consultationChat.error;

export default consultationChatSlice.reducer;