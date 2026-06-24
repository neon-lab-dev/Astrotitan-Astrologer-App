import SkeletonLoader from "@/components/reusable/SkeletonLoader/SkeletonLoade";
import React from "react";
import { StyleSheet, View } from "react-native";

const GemCardSkeleton = () => {
  return (
    <View style={styles.card}>


      <View style={{
        position: "absolute",
        top: -34,
        left: 16,
        zIndex: 10,
        borderWidth: 1,
        borderRadius: 32,
        borderColor: "#D4AF37",
        backgroundColor: "#FBF7EB",
      }}>
        <SkeletonLoader
          width={64}
          height={64}
          borderRadius={32}
          array={[1]}
        />
      </View>

      {/* Name */}

      <View style={{ marginTop: 18 }}>
        <SkeletonLoader
          width={210}
          height={20}
          borderRadius={6}
          array={[1]}
        />
      </View>
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
          width={220}
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
          width={220}
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

export default GemCardSkeleton;

const styles = StyleSheet.create({
  card: {
    width: 296,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D4AF37",
    backgroundColor: "#FBF7EB",
    paddingVertical: 20,
    paddingHorizontal: 24,
    position: "relative",
    overflow: "visible", // add this
  }
});