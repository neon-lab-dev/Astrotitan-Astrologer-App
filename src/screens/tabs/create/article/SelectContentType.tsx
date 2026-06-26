import TickIcon from "@/assets/icons/visual/tick.svg";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SansText } from "../../../../components/reusable/Text/SansText";
import { SatoshiText } from "../../../../components/reusable/Text/SatoshiText";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";

const CONTENT_TYPES = [
  {
    id: "article",
    title: "Write Articles",
    description: "Share astrology insights and remedies.",
    image: require("@/assets/images/ArticleImage.png"),
  },

  {
    id: "zodiacTips",
    title: "Zodiac Tips",
    description: "Share short zodiac predictions.",
    image: require("@/assets/images/ZodiacImage.png"),
  },
];

const SelectContentType = () => {
  const [selected, setSelected] = useState("");
  type NavigationProp =
      NativeStackNavigationProp<RootStackParamList>;
  
    const navigation = useNavigation<NavigationProp>();

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View style={styles.container}>
          {/* HEADER */}

          <AppHeader>
            <AuthTitle title="Select content type">
              <SansText>
                Select the content type through which you want to share your
                knowledge.
              </SansText>
            </AuthTitle>
          </AppHeader>

          {/* CONTENT TYPES */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 140,
              gap: 14,
              padding: 16,
            }}
          >
            {CONTENT_TYPES.map((item) => {
              const isSelected = selected === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  onPress={() => setSelected(item.id)}
                  style={[styles.card, isSelected && styles.selectedCard]}
                >
                  {/* LEFT */}

                  <View style={styles.leftSection}>
                    <Image
                      source={item.image}
                      style={styles.image}
                    />

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <SatoshiText style={styles.cardTitle}>
                        {item.title}
                      </SatoshiText>

                      <SansText style={styles.cardDescription}>
                        {item.description}
                      </SansText>
                    </View>
                  </View>

                  {/* RIGHT */}

                  <View
                    style={[styles.circle, isSelected && styles.selectedCircle]}
                  >
                    {isSelected && <TickIcon width={12} height={12} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* BUTTON */}

          <View style={styles.bottomContainer}>
            <ReusableButton
              title="Continue"
              disabled={!selected}
              onPress={() => {
                navigation.navigate(
                 "CreateArticleScreen",
                { contentType: selected },
                );
              }}
              width="100%"
            />
          </View>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default SelectContentType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1D7",
  },

  card: {
    backgroundColor: "#FBF7EB",

    borderRadius: 18,

    borderWidth: 1.5,

    borderColor: "#D4AF37",

    padding: 14,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  selectedCard: {
    backgroundColor: "#D4AF37",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },

  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: "Satoshi-Bold",
    color: "#0D0D0D",
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#0D0D0D",
  },

  circle: {
    width: 24,
    height: 24,
    borderRadius: 999,

    borderWidth: 2,
    borderColor: "#D4AF37",

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "transparent",
  },

  selectedCircle: {
    backgroundColor: "#EAF8E7",
    borderColor: "#EAF8E7",
  },

  bottomContainer: {
    position: "absolute",

    bottom: 0,
    left: 0,
    right: 0,

    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,

    backgroundColor: "#F8F1D7",
  },
});
