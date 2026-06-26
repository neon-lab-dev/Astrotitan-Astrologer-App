
import React from "react";
import { Pressable, View } from "react-native";
import { SatoshiText } from "../../../reusable/Text/SatoshiText";
import { SansText } from "../../../reusable/Text/SansText";
import Ionicons from "@react-native-vector-icons/ionicons";

type QueryCardProps = {
  title: string;
  category: string;
  status: string;
  date: string;
  time: string;
  onPress?: () => void;
};

const QueryCard = ({
  title,
  category,
  status,
  date,
  time,
  onPress,
}: QueryCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: "#D4AF37",
        borderRadius: 24,
        padding: 24,
        backgroundColor: "#FBF7EB",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* LEFT */}
        <View
          style={{
            flex: 1,
            gap: 12,
          }}
        >
          <SatoshiText
            style={{
              fontSize: 16,
              lineHeight: 26,
              fontFamily:"Satoshi-Medium",
              color: "#0D0D0D",
            }}
          >
            {title.length > 15
              ? `${title.slice(0, 15)}...`
              : title}
          </SatoshiText>

          <SansText
            style={{
              fontSize: 14,
              color: "#0D0D0D",
            }}
          >
            {category}
          </SansText>

          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#4A4A4A",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <SansText
              style={{
                color: "#F5F5F5",
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              {status}
            </SansText>
          </View>
        </View>

        {/* RIGHT */}
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            <SansText
              style={{
                fontSize: 14,
                color: "#0D0D0D",
              }}
            >
              {date}
            </SansText>

            <SansText
              style={{
                fontSize: 14,
                color: "#0D0D0D",
              }}
            >
              {time}
            </SansText>
          </View>

          <Ionicons
            name="chevron-forward"
            size={24}
            color="#0D0D0D"
          />
        </View>
      </View>
    </Pressable>
  );
};

export default QueryCard;