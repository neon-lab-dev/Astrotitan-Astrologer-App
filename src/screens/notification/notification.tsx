/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { SansText } from '../../components/reusable/Text/SansText';
import { useNavigation } from '@react-navigation/native';
import ReusableButton from '../../components/reusable/ReusableButton/ReusableButton';
import { SatoshiText } from '../../components/reusable/Text/SatoshiText';
import { selectUser } from './../../redux/features/auth/authSlice';
import { useSelector } from 'react-redux';
import {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
} from '../../redux/features/notification/notificationApi';
import { connectSocket, disconnectSocket } from '../../socket/socket';
import { formatMessageDate } from '../../utils/validators/dateValidators';
import AppBar from '../../components/reusable/AppBar/AppBar';

const NotificationScreen = () => {
  const navigation = useNavigation<any>();
  const user = useSelector(selectUser) as any;
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const { data: myNotifications } = useGetMyNotificationsQuery({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const hasNotifications = notifications.length > 0;
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [markAsRead] = useMarkAsReadMutation();

  useEffect(() => {
    if (myNotifications?.data) {
      const sorted = [...myNotifications.data].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setNotifications(sorted);
    }
  }, [myNotifications?.data]);

  // --- Socket for live notifications ---
  useEffect(() => {
    if (!user?.account?._id) {
      console.log('⚠️ No user, skipping socket connection');
      return;
    }

    // console.log("🔌 Connecting socket for user:", user?.account?._id);

    const socket = connectSocket(user?.account?._id);
    // console.log("📡 Socket instance:", socket);
    // console.log("📡 Socket connected:", socket?.connected);

    if (!socket) {
      console.error('❌ Failed to create socket');
      return;
    }

    const onConnect = () => {
      console.log('🔌 Socket connected:', socket.id);
    };

    const onNotification = (data: any) => {
      // console.log("🔔 New notification:", data);
      setNotifications(prev => [data, ...prev]);
    };

    const onOnlineUsers = (users: string[]) => {
      console.log('👥 Online users:', users);
    };

    socket.on('connect', onConnect);
    socket.on('new-notification', onNotification);
    socket.on('onlineUsers', onOnlineUsers);

    if (socket.connected) {
      console.log('Socket already connected:', socket.id);
    }

    return () => {
      // console.log("🧹 Cleaning up socket listeners");
      socket.off('connect', onConnect);
      socket.off('new-notification', onNotification);
      socket.off('onlineUsers', onOnlineUsers);
      disconnectSocket();
    };
  }, [user?.account?._id]);

  const filteredNotifications =
  filter === 'unread'
    ? notifications.filter(notification => !notification.isRead)
    : notifications;

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      notification => !notification.isRead,
    );

    if (unreadNotifications.length === 0) {
      return;
    }

    try {
      await Promise.all(
        unreadNotifications.map(notification =>
          markAsRead(notification._id).unwrap(),
        ),
      );

      // Immediately update UI
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (error) {
      console.log('Failed to mark all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(
    notification => !notification.isRead,
  ).length;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenWrapper>
        <AppBar title="Notifications" />
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            padding:16,
            justifyContent:"space-between"
          }}
        ><View style={{ flexDirection: 'row',
            gap: 8 }}>
          <ReusableButton
            title="All"
            onPress={() => setFilter('all')}
            variant={filter === 'all' ? 'solid' : 'outline'}
            width="auto"
            height={38}
            textSize={13}
            paddingHorizontal={16}
          />

          <ReusableButton
            title={`Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
            onPress={() => setFilter('unread')}
            variant={filter === 'unread' ? 'solid' : 'outline'}
            width="auto"
            height={38}
            textSize={13}
            paddingHorizontal={16}
          /></View>

            <ReusableButton
              title="Mark all read"
              onPress={handleMarkAllAsRead}
              variant="solid"
              disabled={unreadCount === 0}
              width="100%"
              height={32}
              textSize={13}
              paddingHorizontal={16}
            />
        </View>
        <View ref={notificationRef} style={{ flex: 1 }}>
          {!hasNotifications ? (
            // EMPTY STATE
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 24,
                }}
              >
                <Image
                  source={require('@/assets/images/bell-icon.png')}
                  style={{ width: 224, height: 224 }}
                  resizeMode="contain"
                />
                <SansText
                  style={{
                    fontSize: 16,
                    color: '#666',
                    textAlign: 'center',
                  }}
                >
                  No notifications yet
                </SansText>
              </View>

              <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
                <ReusableButton
                  title="Go To Home"
                  onPress={() => navigation.replace('HomeScreen')}
                  width="100%"
                />
              </View>
            </View>
          ) : (
            // LIST STATE
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            >
              <View style={{ paddingHorizontal: 16 }}>
                {/* Unread Count Header */}
                {unreadCount > 0 && (
                  <View
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      marginBottom: 8,
                    }}
                  >
                    <SansText
                      style={{
                        fontSize: 14,
                        color: '#666',
                        fontFamily: 'Satoshi-Medium',
                      }}
                    >
                      {unreadCount} unread notification
                      {unreadCount > 1 ? 's' : ''}
                    </SansText>
                  </View>
                )}

                {filteredNotifications.map((item, index) => (
                  <NotificationItem key={item?._id || index} item={item} />
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </ScreenWrapper>
    </SafeAreaView>
  );
};

export default NotificationScreen;

// Updated NotificationItem component
const NotificationItem = ({ item }: any) => {
  const isUnread = !item?.isRead;
  const [markAsRead] = useMarkAsReadMutation();
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleMarkAsRead(item?._id)}
      style={{
        backgroundColor: isUnread ? '#FFF8F0' : '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: isUnread ? '#D4AF37' : '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        {/* LEFT - Content */}
        <View style={{ flex: 1, gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <SatoshiText
              style={{
                fontSize: 16,
                fontFamily: isUnread ? 'Satoshi-Bold' : 'Satoshi-Medium',
                color: '#0D0D0D',
                lineHeight: 24,
                flex: 1,
              }}
            >
              {item?.title || 'Notification'}
            </SatoshiText>
            {isUnread && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#D4AF37',
                }}
              />
            )}
          </View>

          <SansText
            style={{
              fontSize: 14,
              color: '#555',
              lineHeight: 20,
            }}
          >
            {item?.message || 'No message content'}
          </SansText>

          <SansText
            style={{
              fontSize: 12,
              color: '#999',
              marginTop: 4,
            }}
          >
            {formatMessageDate(item?.createdAt)}
          </SansText>
        </View>

        {/* RIGHT - Optional icon/status */}
        {item?.type && (
          <View
            style={{
              backgroundColor: '#F5F5F5',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
            }}
          >
            <SansText
              style={{
                fontSize: 10,
                color: '#666',
                textTransform: 'capitalize',
              }}
            >
              {item.type}
            </SansText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
