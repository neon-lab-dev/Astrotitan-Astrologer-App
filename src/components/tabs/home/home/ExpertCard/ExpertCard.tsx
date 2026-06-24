import StarIcon from "@/assets/icons/visual/star.svg";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import BottomSheetService from "../../../../../redux/features/ui/GlobalSheet/BottomSheetService";
import ConsultAstrologerSection from "../../../../reusable/BottomSheet/ConsultAstrologerSection";
import { useNavigation } from "@react-navigation/native";
import { SansText } from "../../../../reusable/Text/SansText";
import { SatoshiText } from "../../../../reusable/Text/SatoshiText";

type AstrologerType = {
  name: string;
  image: any;
};

type Props = {
  _id: string;
  name: string;
  experience: string;
  description: string;
  tags: string[];
  rating: number;
  image: any;
};

const ExpertCard = ({
  _id,
  name,
  experience,
  tags,
  rating,
  image,
}: Props) => {
  const navigation = useNavigation<any>()
  const onPressAstrologer = (user: AstrologerType) => {
    BottomSheetService.open(
      <ConsultAstrologerSection
        astrologer={user}
        onCancel={BottomSheetService.close}
        onConsult={() => {
          BottomSheetService.close();

          navigation.navigate(
            "AstrologerDetailsScreen",
            {
              id: _id,
            },
          );
        }}
      />,
      {
        height: 400,
        hasGradient: true,
      }
    );
  };

  return (
    <TouchableOpacity
      onPress={() => {
        onPressAstrologer({
          name,
          image,
        });
      }}
      style={styles.card}
      activeOpacity={0.9}
    >
      <View style={styles.avatarWrapper}>
        <Image source={image} style={styles.avatar} />

        <View style={styles.ratingBadge}>
          <StarIcon height={10} width={10} />

          <SansText style={styles.ratingText}>
            {rating}
          </SansText>
        </View>
      </View>

      <View style={{ alignItems: "center", gap: 4 }}>
        <SatoshiText style={styles.name}>
          {name}
        </SatoshiText>

        <SansText style={styles.exp}>
          {experience}
        </SansText>

        {/* <SansText style={styles.desc}>
          {description}
        </SansText> */}

        <SansText style={styles.tags}>
          {tags.map((t) => `• ${t}`).join("  ")}
        </SansText>
      </View>
    </TouchableOpacity>
  );
};

export default ExpertCard;

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D4AF37",
    backgroundColor: "#FBF7EB",
    paddingVertical: 20,
    alignItems: "center",
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: 8,
  },

  avatar: {
    width: 94,
    height: 94,
    borderRadius: 100,
    backgroundColor: "#F0E8CD"
  },

  ratingBadge: {
    position: "absolute",
    bottom: -8,
    alignSelf: "center",
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },

  ratingText: {
    color: "#F5F5F5",
    fontSize: 12,
  },

  name: {
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
    color: "#4A4A4A",
    textAlign: "center"
  },

  exp: {
    fontSize: 14,
    color: "#4A4A4A",
    letterSpacing: 0.28,
  },

  desc: {
    fontSize: 12,
    color: "#4A4A4A",
    textAlign: "center",
    letterSpacing: 0.38,
  },

  tags: {
    fontSize: 12,
    color: "#4A4A4A",
    textAlign: "center",
    letterSpacing: 0.38,
  },
});