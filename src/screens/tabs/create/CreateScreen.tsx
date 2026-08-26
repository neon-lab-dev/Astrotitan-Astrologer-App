import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useGetMyBlogsQuery } from '../../../redux/features/blog/blogApi';
import FeatureCardSkeleton from '../../../components/tabs/home/home/FeatureCard/FeatureCardSkeleton';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import AppBar from '../../../components/reusable/AppBar/AppBar';
import { SansText } from '../../../components/reusable/Text/SansText';
import ContentSection from '../../../components/reusable/ContentSectoin/ContentSection';
import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import BlogCard from '../../../components/BlogPage/BlogCard';

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

  const navigation = useNavigation<NavigationProp>();
  const blogs = blogsResponse?.data?.data || [];

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    try {
      setRefreshing(true);
      await Promise.all([refetchBlogs().unwrap()]);
    } catch (error) {
      console.log('REFRESH ERROR:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetchBlogs]);

  const renderBlogItem = ({ item: blog }: { item: any }) => (
    <BlogCard
      key={blog._id}
      title={blog?.title || 'Untitled Blog'}
      thumbnail={{
        uri: blog?.thumbnail,
      }}
      onPress={() => navigation.navigate('ArticleScreen', { id: blog?._id })}
    />
  );

  const renderSkeletonItem = () => (
    <View style={styles.cardWrapper}>
      <FeatureCardSkeleton />
    </View>
  );

  // Show loading state
  if (blogsLoading || blogFetching) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppBar title="Blogs & Articles" />
          <View style={styles.contentContainer}>
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
                  colors={['#816B22']}
                  progressBackgroundColor="#FBF7EB"
                />
              }
            />
          </View>
          <View style={styles.fixedBottom}>
            <ReusableButton
              title="Create Content"
              onPress={() => {
                navigation.navigate('SelectContentType');
              }}
              width="100%"
              variant="solid"
            />
          </View>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  // Show empty state with centered message
  if (blogs.length === 0) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppBar title="Blogs & Articles" />
          <View style={styles.contentContainer}>
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <SansText style={styles.emptyIcon}>📝</SansText>
              </View>
              <SansText style={styles.emptyTitle}>No Blogs Available</SansText>
              <SansText style={styles.emptySubText}>
                You haven't created any blog posts yet.
              </SansText>
            </View>
          </View>
          <View style={styles.fixedBottom}>
            <ReusableButton
              title="Create Content"
              onPress={() => {
                navigation.navigate('SelectContentType');
              }}
              width="100%"
              variant="solid"
            />
          </View>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  // Show blogs list
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppBar title="Blogs & Articles" />
        <View style={styles.contentContainer}>
          <ContentSection
            title="Articles Posted"
            sectionStyle={styles.sectionHeader}
          />
          <FlatList
            data={blogs}
            keyExtractor={item => item._id}
            renderItem={renderBlogItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#816B22"
                colors={['#816B22']}
                progressBackgroundColor="#FBF7EB"
              />
            }
          />
        </View>
        <View style={styles.fixedBottom}>
          <ReusableButton
            title="Create Content"
            onPress={() => {
              navigation.navigate('SelectContentType');
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
  cardWrapper: {
    marginBottom: 0,
  },
  sectionHeader: {
    marginBottom: 6,
    marginTop: 6,
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F4EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: 'GeneralSans-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 10,
    backgroundColor: '#F8F1D7',
  },
});
