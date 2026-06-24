import React from "react";

import {
  Image,
  StyleSheet,
  View
} from "react-native";
import { SatoshiText } from "../../../reusable/Text/SatoshiText";
import { SansText } from "../../../reusable/Text/SansText";
import ReusableButton from "../../../reusable/ReusableButton/ReusableButton";

type Props = {
  item: {
    id: string;
    name: string;
    image: string;
  };
  type: "Chat" | "Call";
  isVerified?: boolean;
  onAccept?: () => void;
  onCancel?: () => void;
};

const RequestCard = ({
  item,
  type,
  isVerified = false,
  onAccept,
  onCancel,
}: Props) => {
  const isDisabled =
    !isVerified;

  return (
    <View
      style={[
        styles.requestCard,
        isDisabled && { opacity: 0.65, },
      ]}
    >
      {/* DISABLED OVERLAY */}

      {/* {isDisabled && (
        <View
          style={
            styles.disabledOverlay
          }
        >
          <LockIcon
            width={18}
            height={18}
          />

          <SansText
            style={
              styles.disabledText
            }
          >
            Verify account
            to accept
            requests
          </SansText>
        </View>
      )} */}

      {/* IMAGE */}

      <Image
        source={{uri: item.image,}}
        style={styles.requestImage}
      />
      {/* NAME */}

      <SatoshiText style={styles.requestName}>{item.name}</SatoshiText>

      {/* TYPE */}

      <SansText style={styles.requestType}>{type} Request
      </SansText>
      {/* ACTIONS */}
      <View style={styles.requestActions}>
        {/* ACCEPT */}
        <View style={{ flex: 1 }}><ReusableButton variant="solid" style={{ borderRadius: 12 }} height={44} onPress={()=>{onAccept}} title="Accept" /></View>
        <View style={{ flex: 1 }}><ReusableButton variant="outline" style={{ borderRadius: 12 }} height={44} onPress={()=>{onCancel}} title="Cancel" /></View>
      </View>
    </View>
  );
};

export default RequestCard;

const styles =
  StyleSheet.create({
    requestCard: {
      width: 244,
      backgroundColor: "#FBF7EB",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E3C55A",
      padding: 20,
      position: "relative",
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    disabledOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: "rgba(255,255,255,0.92)",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },

    requestImage: {
      width: 84,
      height: 84,
      borderRadius: 999,
      marginBottom: 10,
    },

    requestName: {
      fontSize: 18,
      color: "#4A4A4A",
      fontFamily: "Satoshi-Bold",
      marginBottom: 4,
    },

    requestType: {
      fontSize: 13,

      color: "#7A7A7A",

      marginBottom: 14,
    },

    requestActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
    },

    acceptButton: {
      flex: 1,

      height: 34,

      borderRadius: 999,

      backgroundColor:
        "#D4AF37",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    acceptText: {
      fontSize: 13,

      color: "#111",

      fontFamily:
        "SansMedium",
    },

    cancelButton: {
      flex: 1,

      height: 34,

      borderRadius: 999,

      borderWidth: 1,

      borderColor:
        "#D96C6C",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    cancelText: {
      fontSize: 13,

      color: "#D96C6C",
    },
  });