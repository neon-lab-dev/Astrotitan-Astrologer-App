import React from "react";

import {
  Image,
  StyleSheet,
  View
} from "react-native";
import { SatoshiText } from "../../../reusable/Text/SatoshiText";
import { SansText } from "../../../reusable/Text/SansText";
import ReusableButton from "../../../reusable/ReusableButton/ReusableButton";
import { useChangeBookingStatusMutation } from "../../../../redux/features/consultation/consultationApi";
import { setSelectedConsultation } from "../../../../redux/features/consultation/consultationChatSlice";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

type Props = {
  item: {
    id: string;
    name: string;
    image: string;
  };
  isVerified?: boolean;
};

const RequestCard = ({
  item,
  isVerified = false,
}: Props) => {
  const isDisabled =
    !isVerified;
  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;
  const dispatch =useDispatch()
  const navigation = useNavigation<NavigationProp>();
  const [changeBookingStatus, { isLoading }] = useChangeBookingStatusMutation();
  const handleAccept = async () => {
    try {
      const payload = { status: "accepted" };
      const response = await changeBookingStatus({
        id: item?._id,
        data: payload,
      }).unwrap();

      if (response?.success) {
      }
    } catch (err: any) {
      console.error("Error accepting booking:", err);
    }
  };

  const handleReject = async () => {
    try {
      const payload = { status: "rejected" };
      const response = await changeBookingStatus({
        id: item?._id,
        data: payload,
      }).unwrap();

      if (response?.success) {
      }
    } catch (err: any) {
      console.error("Error rejecting booking:", err);
    }
  };
  const handleChatNow = (booking: any) => {
    // Astrologer is the current user, participant is always the User
    const participant = booking.user;

    // ✅ Astrologer's Object ID (from booking.astrologer._id)
    const currentParticipantId = booking.astrologer;

    // Store selected consultation in Redux
    dispatch(
      setSelectedConsultation({
        consultationId: booking._id,
        currentParticipantId: currentParticipantId,
        participant: {
          _id: participant?._id,
          name: participant?.fullName || participant?.displayName || "User",
          firstName: participant?.firstName,
          lastName: participant?.lastName,
          profilePicture: participant?.profilePicture,
          accountId: participant?.accountId,
          role: "user", // Participant is always the user in astrologer panel
        },
      })
    );

    // Navigate to chat page
    navigation.navigate("AstrologerChatScreen", { id: booking?._id })
  };

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
        source={{ uri: item?.user?.profilePicture, }}
        style={styles.requestImage}
      />
      {/* NAME */}

      <SatoshiText style={styles.requestName}>{item?.user?.fullName}</SatoshiText>

      {/* TYPE */}

      <SansText style={styles.requestType}>Request Type : {item?.method}
      </SansText>
      {/* ACTIONS */}



      {item?.status === "pending" ? (<View style={styles.requestActions}>
        {/* ACCEPT */}
        <View style={{ flex: 1 }}><ReusableButton variant="solid" style={{ borderRadius: 12 }} height={44} onPress={() => { handleAccept }} title="Accept" /></View>
        <View style={{ flex: 1 }}><ReusableButton variant="outline" style={{ borderRadius: 12 }} height={44} onPress={() => { handleReject }} title="Reject" /></View>
      </View>) : (<View style={{ flex: 1 }}><ReusableButton variant="solid" style={{ borderRadius: 12, paddingVertical: 0 }} textSize={12} height={24}
        onPress={() => { handleChatNow(item) }} title="Chat Now" /></View>)}
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
      textTransform: "capitalize"
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
        "GeneralSans-Medium",
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