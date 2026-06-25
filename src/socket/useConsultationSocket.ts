/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import {
  addConsultationMessage,
  setConsultationChatList,
  markConsultationMessagesAsRead,
  updateConsultationMessageId,
  addConsultationOnlineUser,
  removeConsultationOnlineUser,
  setConsultationOnlineUsers,
  selectSelectedConsultationId,
} from '../redux/features/consultation/consultationChatSlice';
import { selectUser } from '../redux/features/auth/authSlice';
import { API_URL } from '../redux/api/baseApi';

let socketInstance: Socket | null = null;

export const useConsultationSocket = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser) as any;
  console.log(user, 'form hook');
  const selectedConsultationId = useSelector(selectSelectedConsultationId);
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!user?.account?._id) {
      console.log('No user, skipping consultation socket connection');
      return;
    }

    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      isConnectedRef.current = false;
    }

    const socket = io(API_URL, {
      withCredentials: true,
      query: { userId: user?.account?._id },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;
    socketInstance = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to consultation socket server');
      isConnectedRef.current = true;
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from consultation socket server');
      isConnectedRef.current = false;
    });

    socket.on('connect_error', error => {
      console.error('Consultation socket connection error:', error);
      isConnectedRef.current = false;
    });

    // ✅ Handle receiving message
    socket.on('receiveConsultationMessage', (message: any) => {
      console.log('📩 Received consultation message:', message);

      // Add message to selected consultation if it's the current one
      if (message.consultationId === selectedConsultationId) {
        dispatch(addConsultationMessage(message));
      }

      // Update unread count for the chat list
      // This will be handled by the server emitting updateConsultationChatList
    });

    // ✅ Handle message sent confirmation
    socket.on('consultationMessageSent', (message: any) => {
      console.log('✅ Consultation message sent confirmation:', message);

      if (message.tempId && message._id) {
        dispatch(
          updateConsultationMessageId({
            tempId: message.tempId,
            realId: message._id,
            createdAt: message.createdAt,
          }),
        );
      }
    });

    // ✅ Handle chat list update
    socket.on('updateConsultationChatList', (chatList: any[]) => {
      console.log('📋 Consultation chat list updated:', chatList);
      dispatch(setConsultationChatList(chatList));
    });

    // ✅ Handle messages read
    socket.on('consultationMessagesRead', ({ consultationId, by }: any) => {
      console.log('📖 Consultation messages read:', consultationId, by);
      if (consultationId === selectedConsultationId) {
        dispatch(markConsultationMessagesAsRead(consultationId));
      }
    });

    // ✅ Handle typing indicator
    socket.on(
      'consultationUserTyping',
      ({ consultationId, sender, isTyping }: any) => {
        console.log('✍️ User typing:', consultationId, sender, isTyping);
        // You can dispatch a typing state if needed
      },
    );

    // ✅ Handle online users
    socket.on('consultationOnlineUsers', (users: string[]) => {
      console.log('👥 Consultation online users:', users);
      dispatch(setConsultationOnlineUsers(users));
    });

    socket.on('consultationUserOnline', (userId: string) => {
      console.log('🟢 Consultation user online:', userId);
      dispatch(addConsultationOnlineUser(userId));
    });

    socket.on('consultationUserOffline', (userId: string) => {
      console.log('🔴 Consultation user offline:', userId);
      dispatch(removeConsultationOnlineUser(userId));
    });

    return () => {
      console.log('Cleaning up consultation socket connection');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        isConnectedRef.current = false;
      }
    };
  }, [user?.account?._id, dispatch, selectedConsultationId]);

  // ✅ Send message function
  const sendConsultationMessage = (data: {
    consultationId: string;
    sender: string;
    receiver: string;
    content: string;
    tempId: string;
  }) => {
    if (socketRef.current && isConnectedRef.current) {
      socketRef.current.emit('sendConsultationMessage', data);
      return true;
    }
    console.warn('Socket not connected, unable to send message');
    return false;
  };

  // ✅ Mark messages as read function
  const markConsultationMessagesRead = (consultationId: string) => {
    if (socketRef.current && isConnectedRef.current) {
      socketRef.current.emit('markConsultationMessagesRead', {
        consultationId,
        userId: user?.account?._id,
      });
      return true;
    }
    return false;
  };

  // ✅ Typing indicator function
  const sendTypingIndicator = (data: {
    consultationId: string;
    sender: string;
    receiver: string;
    isTyping: boolean;
  }) => {
    if (socketRef.current && isConnectedRef.current) {
      socketRef.current.emit('consultationTyping', data);
      return true;
    }
    return false;
  };

  return {
    socket: socketRef.current,
    isConnected: isConnectedRef.current,
    sendConsultationMessage,
    markConsultationMessagesRead,
    sendTypingIndicator,
  };
};

export const getConsultationSocket = () => socketInstance;
