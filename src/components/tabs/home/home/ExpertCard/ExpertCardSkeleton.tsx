import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonLoader from "../../../../reusable/SkeletonLoader/SkeletonLoade";

const ExpertCardSkeleton = () => {
  return (
    <View style={styles.card}>
      {/* Avatar */}

      <SkeletonLoader
        width={94}
        height={94}
        borderRadius={100}
        array={[1]}
      />

      {/* Rating Badge */}

      <View style={{ marginTop: -10 }}>
        <SkeletonLoader
          width={70}
          height={28}
          borderRadius={30}
          array={[1]}
        />
      </View>

      {/* Name */}

      <View style={{ marginTop: 18 }}>
        <SkeletonLoader
          width={110}
          height={18}
          borderRadius={6}
          array={[1]}
        />
      </View>

      {/* Experience */}

      <View style={{ marginTop: 10 }}>
        <SkeletonLoader
          width={90}
          height={14}
          borderRadius={6}
          array={[1]}
        />
      </View>

      {/* Tags */}

      <View style={{ marginTop: 10 }}>
        <SkeletonLoader
          width={130}
          height={12}
          borderRadius={6}
          array={[1]}
        />
      </View>
    </View>
  );
};

export default ExpertCardSkeleton;

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
});