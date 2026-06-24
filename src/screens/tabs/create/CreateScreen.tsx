import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useGetMyBlogsQuery } from "../../../redux/features/blog/blogApi";
import FeatureCard from "../../../components/tabs/home/home/FeatureCard/FeatureCard";
import FeatureCardSkeleton from "../../../components/tabs/home/home/FeatureCard/FeatureCardSkeleton";
import AnimatedScreen from "../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../components/layout/ScreenWrapper";
import AppHeader from "../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../components/auth/AuthTitle";
import { SansText } from "../../../components/reusable/Text/SansText";
import ContentSection from "../../../components/reusable/ContentSectoin/ContentSection";
import ReusableButton from "../../../components/reusable/ReusableButton/ReusableButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";
import { useNavigation } from "@react-navigation/native";


const CreateScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: blogsResponse,
    isLoading: blogsLoading,
    refetch: refetchBlogs,
    isFetching: blogFetching,
  } = useGetMyBlogsQuery(
    {
      skip: 0,
      limit: 5,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  type NavigationProp =
      NativeStackNavigationProp<RootStackParamList>;
  
    const navigation = useNavigation<NavigationProp>();
  const blogs = blogsResponse?.data?.data || [];
  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    try {
      setRefreshing(true);
      await Promise.all([refetchBlogs().unwrap()]);
    } catch (error) {
      console.log("REFRESH ERROR:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetchBlogs]);

  const renderBlogItem = ({ item: blog }: { item: any }) => (
    <View style={styles.cardWrapper}>
      <FeatureCard
        key={blog._id}
        title={blog?.title || "Untitled Blog"}
        description={blog?.content?.slice(0, 60) + "..."}
        image={{
          uri: blog?.thumbnail,
        }}
        ctaText="Read Article"
        height={194}
        onPress={() =>
          navigation.navigate(
         "ArticleScreen",
             {
              id: blog?._id,
            },
          )
        }
      />
    </View>
  );

  const renderSkeletonItem = () => (
    <View style={styles.cardWrapper}>
      <FeatureCardSkeleton />
    </View>
  );

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader showBack={false}>
          <AuthTitle title="Create & share content">
            <SansText>
              Share your knowledge to help more users and grow your visibility.
            </SansText>
          </AuthTitle>
        </AppHeader>

        <View style={styles.contentContainer}>
          {blogsLoading || blogFetching ? (
            <FlatList
              data={[1, 2]}
              keyExtractor={(item, index) => `skeleton-${index}`}
              renderItem={renderSkeletonItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#816B22"
                  colors={["#816B22"]}
                  progressBackgroundColor="#FBF7EB"
                />
              }
            />
          ) : blogs?.length > 0 ? (
            <FlatList
              data={blogs}
              keyExtractor={(item) => item._id}
              renderItem={renderBlogItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#816B22"
                  colors={["#816B22"]}
                  progressBackgroundColor="#FBF7EB"
                />
              }
              ListHeaderComponent={
                <ContentSection
                  title="Articles Posted"
                  sectionStyle={styles.sectionHeader}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <SansText style={styles.emptyText}>
                    No blogs available
                  </SansText>
                </View>
              }
            />
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#816B22"
                  colors={["#816B22"]}
                  progressBackgroundColor="#FBF7EB"
                />
              }
            >
              <ContentSection
                title="Articles Posted"
                sectionStyle={styles.sectionHeader}
              />
              <View style={styles.emptyContainer}>
                <SansText style={styles.emptyText}>No blogs available</SansText>
              </View>
            </ScrollView>
          )}
        </View>

        <View style={styles.fixedBottom}>
          <ReusableButton
            title="Create Content"
            onPress={() => {
              navigation.navigate("SelectContentType");
            }}
            width="100%"
            variant="solid"
          />
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  flatListContent: {
    paddingBottom: 100,
    gap: 16,
  },
  scrollContent: {
    paddingBottom: 100,
    gap: 16,
  },
  cardWrapper: {
    marginBottom: 0,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    color: "#8C8C8C",
    fontSize: 16,
    textAlign: "center",
  },
  fixedBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 10,
    backgroundColor: "#F8F1D7",
  },
});
