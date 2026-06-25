import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";
import { SansText } from "../../../../components/reusable/Text/SansText";
import IconButton from "../../../../components/reusable/IconButton/IconButton";
import SentIcon from '@/assets/icons/actions/sent.svg';
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import { SatoshiText } from "../../../../components/reusable/Text/SatoshiText";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { addConsultationMessage, clearSelectedConsultation, selectCurrentParticipantId, selectSelectedConsultationMessages, selectSelectedParticipant, setSelectedConsultationMessages, updateConsultationMessageId } from "../../../../redux/features/consultation/consultationChatSlice";
import { useConsultationSocket } from "../../../../socket/useConsultationSocket";
import { selectUser } from "../../../../redux/features/auth/authSlice";
import { useGetConsultationMessagesQuery, useMarkConsultationMessagesReadMutation } from "../../../../redux/features/consultation/consultationChatApi";
import {  formatMessageDate } from "../../../../utils/validators/dateValidators";


const AstrologerChatScreen = () => {
  const route = useRoute<any>();
  const { id: consultationId } = route.params || {};

  const renderMessage = ({ item }: { item: any }) => {
    console.log(item, "message");

    const senderId =
      typeof item.sender === "string"
        ? item.sender
        : item.sender?._id;

    const isOwn = senderId === currentUser?.account?._id;
  
    return (
      <View
        style={[
          styles.messageContainer,
          isOwn ? styles.userContainer : styles.receiverContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isOwn ? styles.userBubble : styles.receiverBubble,
          ]}
        >
          <SansText style={styles.messageText}>
            {item.content}
          </SansText>

          <View
            style={[
              styles.timeRow,
              isOwn
                ? { justifyContent: "flex-end" }
                : { justifyContent: "flex-start" },
            ]}
          >
            <Text style={styles.time}>
              {formatMessageDate(item.createdAt) } {" "}
            </Text>

            {isOwn && (
              <>
                {item.isTemp ? (
                  <Text style={styles.sendingText}>⌛ Sending...</Text>
                ) : item.isRead ? (
                  <Text style={styles.readText}>✓✓ Read</Text>
                ) : (
                  <Text style={styles.sentText}>✓ Sent</Text>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    );
  };
  const dispatch = useDispatch();
  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<TextInput>(null);
  const hasInitializedRef = useRef(false);
  const hasMarkedReadRef = useRef(false);

  // Redux selectors
  const participant = useSelector(selectSelectedParticipant);
  const messages = useSelector(selectSelectedConsultationMessages);
  const currentParticipantId = useSelector(selectCurrentParticipantId);


  const messagesRef = useRef(messages);

  // Update ref when messages change
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  // Socket hook
  const {
    sendConsultationMessage,
    markConsultationMessagesRead,
    isConnected,
    socket,
  } = useConsultationSocket();

  // Current user
  const currentUser = useSelector(selectUser) as any;

  // API hooks
  const { data } = useGetConsultationMessagesQuery(consultationId, {
    skip: !consultationId,
  });

  const [markMessagesAsRead] = useMarkConsultationMessagesReadMutation();

  // Scroll to bottom
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "end",
  //   });
  // }, [messages]);

  useEffect(() => {
    if (data?.data && consultationId && !hasInitializedRef.current) {
      dispatch(setSelectedConsultationMessages(data.data));
      hasInitializedRef.current = true;
    }
  }, [data, consultationId, dispatch]);

  useEffect(() => {
    hasInitializedRef.current = false;
    hasMarkedReadRef.current = false;
  }, [consultationId]);

  useEffect(() => {
    if (consultationId && isConnected && !hasMarkedReadRef.current) {
      hasMarkedReadRef.current = true;
      markConsultationMessagesRead(consultationId);
      markMessagesAsRead(consultationId).catch(console.error);
    }
  }, [
    consultationId,
    isConnected,
    markConsultationMessagesRead,
    markMessagesAsRead,
  ]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (incomingMsg: any) => {
      if (incomingMsg.consultationId === consultationId) {
        dispatch(addConsultationMessage(incomingMsg));
      }
    };

    const handleMessageSent = (confirmation: any) => {
      if (
        confirmation.consultationId === consultationId &&
        confirmation.tempId
      ) {
        dispatch(
          updateConsultationMessageId({
            tempId: confirmation.tempId,
            realId: confirmation._id,
            createdAt: confirmation.createdAt,
          }),
        );
      }
    };

    socket.on("receiveConsultationMessage", handleReceiveMessage);
    socket.on("consultationMessageSent", handleMessageSent);

    return () => {
      socket.off("receiveConsultationMessage", handleReceiveMessage);
      socket.off("consultationMessageSent", handleMessageSent);
    };
  }, [socket, consultationId, dispatch]);

  // Handle send message
  const handleSendMessage = () => {

    if (!message.trim()) {
      console.warn("⚠️ Message is empty");
      return;
    }

    if (!consultationId) {
      console.warn("⚠️ No consultation ID");
      return;
    }

    if (!participant) {
      console.warn("⚠️ No participant found");
      return;
    }

    if (!currentParticipantId) {
      console.warn("⚠️ No current participant ID found");
      return;
    }

    if (!currentUser) {
      console.warn("⚠️ No user found");
      return;
    }

    if (!isConnected) {
      console.warn("⚠️ Socket not connected");
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const messageData = {
      _id: tempId,
      consultationId,
      sender: currentParticipantId,
      receiver: participant._id,
      content: message.trim(),
      tempId,
    };

    console.log("📤 Sending message:", messageData);

    // Optimistically add to UI
    dispatch(
      addConsultationMessage({
        ...messageData,
        _id: tempId,
        isTemp: true,
        isRead: false,
        status: "sent",
        createdAt: new Date().toISOString(),
      }),
    );

    // Send via socket
    const sent = sendConsultationMessage(messageData);

    console.log("Message sent:", sent);

    if (sent) {
      setMessage("");
      inputRef.current?.focus();
    } else {
      console.error("❌ Failed to send message");
    }
  };

  // Handle end session
  // const handleEndSession = useCallback(() => {
  //   dispatch(clearSelectedConsultation());
  //   navigate("/dashboard/astrologer");
  // }, [dispatch, navigate]);

  // Handle back button
  // const handleBack = useCallback(() => {
  //   dispatch(clearSelectedConsultation());
  //   navigate(-1);
  // }, [dispatch, navigate]);

  // Check if current user is the astrologer or user
  const isAstrologer = currentUser?.role === "astrologer";

  // Get astrologer details from participant
  const astrologerDetails = isAstrologer
    ? {
      name: currentUser?.name || "Astrologer",
      profilePicture: currentUser?.profilePicture,
      description: participant?.bio || "Experienced astrologer",
      isVerified: true,
    }
    : {
      name: participant?.name || "Astrologer",
      profilePicture: participant?.profilePicture,
      description: participant?.bio || "Experienced astrologer",
      isVerified: true,
    };

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        {/* HEADER */}
        <AppHeader showBack={false}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <View style={styles.avatar} />

              <View>
                <SatoshiText style={styles.name}>Rahul Sharma</SatoshiText>
                <SansText style={styles.subtitle}>
                  Career & clarity guidance
                </SansText>
              </View>
            </View>

            <ReusableButton width={84} height={56} title="End" onPress={() => { }} />
          </View>


        </AppHeader>



        {/* CHAT */}

        <FlatList
          data={messages}
          keyExtractor={(item) => item?._id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* INPUT */}

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              placeholder="Type your question here..."
              placeholderTextColor="#9A9A9A"
              value={message}
              onChangeText={setMessage}
              style={styles.input}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
          </View>

          <IconButton
            Icon={SentIcon}
            bgColor="#E6D18B"
            size={72}
            iconColor="#0D0D0D"
            onPress={() => {
              handleSendMessage()
            }}
          />
        </View>

        <Text style={styles.footerText}>
          You can ask 2 more questions.
        </Text>
      </View></AnimatedScreen>
  );
};

export default AstrologerChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F2E3",
  },

  header: {
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 28,
    backgroundColor: "#C37B3D",
    marginRight: 10,
  },

  name: {
    fontSize: 18,
    fontFamily: "Satoshi-Medium",
    color: "#222",
  },

  subtitle: {
    fontSize: 18,
    color: "#555",
    marginTop: 2,
  },

  endButton: {
    backgroundColor: "#D2AF2C",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },

  endText: {
    color: "#222",
    fontWeight: "600",
    fontSize: 12,
  },

  chatContainer: {
    padding: 14,
  },

  messageContainer: {
    marginBottom: 24,
  },

  receiverContainer: {
    alignItems: "flex-start",
  },

  userContainer: {
    alignItems: "flex-end",
  },

  messageBubble: {
    maxWidth: "75%",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },

  receiverBubble: {
    backgroundColor: "#E6D18B",
    borderColor: "#DBBD59",
    borderWidth: 1
  },

  userBubble: {
    backgroundColor: "#FBF7EB",
    borderWidth: 1,
    borderColor: "#D4AF37",
  },

  messageText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  tick: {
    color: "#6AA84F",
    marginRight: 4,
    fontSize: 10,
  },

  time: {
    fontSize: 10,
    color: "#777",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 12
  },

  inputContainer: {
    flex: 1,
    backgroundColor: "#EDDEAD",
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderRadius: 10,
    justifyContent: "center",
    padding: 14,
  },

  input: {
    fontSize: 16,
    color: "#333",
    fontFamily: "GeneralSans-Regular"
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F2ECD8",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  sendIcon: {
    fontSize: 16,
    color: "#7C6A1D",
  },

  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: "#8A8A8A",
    marginBottom: 12,
  },
  sendingText: {
    fontSize: 8,
    color: '#D4AF37', // Primary color
  },

  readText: {
    fontSize: 8,
    color: '#22C55E', // Green
  },

  sentText: {
    fontSize: 8,
    color: '#A3A3A3', // Neutral gray
  },
});