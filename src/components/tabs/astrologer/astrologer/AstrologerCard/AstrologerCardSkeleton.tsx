import SkeletonLoader from "@/components/reusable/SkeletonLoader/SkeletonLoade";
import { StyleSheet, View } from "react-native";

const AstrologerCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        {/* IMAGE */}

        <SkeletonLoader
          width={124}
          height={124}
          borderRadius={12}
          array={[1]}
        />

        {/* RIGHT CONTENT */}

        <View style={styles.skeletonRightContent}>
          {/* NAME */}

          <SkeletonLoader
            width="72%"
            height={22}
            borderRadius={8}
            array={[1]}
          />

          {/* SPECIALIZATION */}

          <SkeletonLoader
            width="88%"
            height={14}
            borderRadius={6}
            array={[1]}
          />

          {/* RATING */}

          <View style={styles.skeletonRatingRow}>
            <SkeletonLoader
              width={20}
              height={20}
              borderRadius={999}
              array={[1]}
            />

            <SkeletonLoader
              width={40}
              height={18}
              borderRadius={6}
              array={[1]}
            />

            <SkeletonLoader
              width={90}
              height={14}
              borderRadius={6}
              array={[1]}
            />
          </View>

          {/* DESCRIPTION */}

          <View style={styles.skeletonDescContainer}>
            <SkeletonLoader
              width="100%"
              height={12}
              borderRadius={6}
              array={[1]}
            />

            <SkeletonLoader
              width="84%"
              height={12}
              borderRadius={6}
              array={[1]}
            />
          </View>
        </View>
      </View>

      {/* BUTTON */}

      <View style={styles.skeletonButtonContainer}>
        <SkeletonLoader
          width="100%"
          height={52}
          borderRadius={12}
          array={[1]}
        />
      </View>
    </View>
  );
};

export default AstrologerCardSkeleton;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FBF7EB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },

  cardTop: {
    flexDirection: "row",
    gap: 12,
  },

  skeletonRightContent: {
    flex: 1,
    justifyContent: "space-between",
  },

  skeletonRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  skeletonDescContainer: {
    gap: 8,
    marginTop: 4,
  },

  skeletonButtonContainer: {
    marginTop: 16,
  },
});