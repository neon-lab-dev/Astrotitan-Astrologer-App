import React, { useState } from "react";
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

interface Message {
  id: string;
  text: string;
  sender: "user" | "astrologer";
  time: string;
}

const AstrologerChatScreen = () => {
  const [message, setMessage] = useState("");

  const messages: Message[] = [
    {
      id: "1",
      text: "Jai Shree Ram! Sumit Ji, Please ask your questions.",
      sender: "astrologer",
      time: "09:07 AM",
    },
    {
      id: "2",
      text: "Guide me about my career and other life prospects.",
      sender: "user",
      time: "09:07 AM",
    },
    {
      id: "3",
      text: "Will I achieve my goals?",
      sender: "user",
      time: "09:08 AM",
    },
    {
      id: "4",
      text: "Will I be successful?",
      sender: "user",
      time: "10:10 AM",
    },
  ];

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userContainer : styles.receiverContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.receiverBubble,
          ]}
        >
          <SansText style={styles.messageText}>{item.text}</SansText>
          <View
            style={[
              styles.timeRow,
              isUser
                ? { justifyContent: "flex-end" }
                : { justifyContent: "flex-start" },
            ]}
          >
            {isUser && <Text style={styles.tick}>✓✓</Text>}
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
      </View>
    );
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

           <ReusableButton width={84} height={56} title="End" onPress={()=>{}} />
          </View>


        </AppHeader>



        {/* CHAT */}

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* INPUT */}

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Type your question here..."
              placeholderTextColor="#9A9A9A"
              value={message}
              onChangeText={setMessage}
              style={styles.input}
            />
          </View>

          <IconButton
            Icon={SentIcon}
            bgColor="#E6D18B"
            size={72}
            iconColor="#0D0D0D"
            onPress={() => {
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
    fontFamily:"Satoshi-Medium",
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
});