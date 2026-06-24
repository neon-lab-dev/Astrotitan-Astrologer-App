import React from "react";

import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { SansText } from "../Text/SansText";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoade";

const Categories = ({
  setSelectedCategory,
  selectedCategory,
  allCategories,
  isLoading = false,
}: any) => {
  const formattedCategories = [
    { category: "All" },
    ...(allCategories || []),
  ];

  /* LOADING */

  if (isLoading) {
    return (
      <View
        style={
          styles.categoriesContainer
        }
      >
        <FlatList
          horizontal
          data={[
            1, 2, 3, 4,
          ]}
          showsHorizontalScrollIndicator={
            false
          }
          keyExtractor={(
            item
          ) =>
            item.toString()
          }
          contentContainerStyle={{
            paddingLeft: 16,
            gap: 10,
          }}
          renderItem={() => (
            <SkeletonLoader
              width={110}
              height={48}
              borderRadius={999}
              array={[1]}
            />
          )}
        />
      </View>
    );
  }

  /* MAIN UI */

  return (
    <View
      style={
        styles.categoriesContainer
      }
    >
      <FlatList
        data={
          formattedCategories
        }
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        keyExtractor={(
          item,
          index
        ) =>
          `${item?.category}-${index}`
        }
        contentContainerStyle={{
          paddingLeft: 16,
          gap: 10,
        }}
        renderItem={({ item }) => {
          const isAll =
            item?.category ===
            "All";

          const isActive =
            (isAll &&
              selectedCategory ===
                "") ||
            selectedCategory ===
              item?.category;

          return (
            <TouchableOpacity
              activeOpacity={
                0.8
              }
              onPress={() => {
               ReactNativeHapticFeedback.trigger("impactLight");

                setSelectedCategory(
                  isAll
                    ? ""
                    : item?.category
                );
              }}
            >
              <View
                style={
                  isActive
                    ? styles.activeChip
                    : styles.inactiveChip
                }
              >
                <SansText
                  style={
                    isActive
                      ? styles.activeText
                      : styles.inactiveText
                  }
                >
                  {
                    item?.category
                  }
                </SansText>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  categoriesContainer: {
    paddingVertical: 16,
  },

  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    borderWidth: 1,
    gap: 8,
  },

  categoryChipActive: {
    backgroundColor:
      "#38A169",
    borderColor:
      "#38A169",
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  activeChip: {
    borderRadius: 48,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor:
      "#D4AF37",
  },

  inactiveChip: {
    borderRadius: 48,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor:
      "#D4AF37",
  },

  activeText: {
    fontSize: 16,
    fontFamily:
      "GeneralSans-Medium",
    color: "#0D0D0D",
  },

  inactiveText: {
    fontSize: 16,
    fontFamily:
      "GeneralSans-Medium",
    color: "#0D0D0D",
  },
});