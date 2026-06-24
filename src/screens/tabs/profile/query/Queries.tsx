
import React, {
  useCallback,
  useState,
} from "react";
import {
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { useGetMyQueriesQuery } from "../../../../redux/features/quary/quaryApi";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SansText } from "../../../../components/reusable/Text/SansText";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
import SkeletonLoader from "../../../../components/reusable/SkeletonLoader/SkeletonLoade";
import DocumentSearchIcon  from '@/assets/icons/visual/document-search.svg';
import QueryCard from "../../../../components/tabs/profile/queries/QueryCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";

const Queries = () => {
  const [refreshing, setRefreshing] =
    useState(false);

  const {
    data: queryResponse,
    isLoading,
    refetch,
    isFetching
  } = useGetMyQueriesQuery({
    page: 1,
    limit: 10,
    status: [],
  });
type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const queries =
    queryResponse?.data?.data || [];

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader>
          <AuthTitle
            title={
              queries.length < 1
                ? "No queries raised yet"
                : "Your queries"
            }
          >
            <SansText>
              Track and manage your submitted
              queries.
            </SansText>
          </AuthTitle>
        </AppHeader>

        <View
          style={{
            paddingHorizontal: 16,
            flexGrow: 1,
            marginBottom: 16,
          }}
        >
          {/* LOADING */}
          {isLoading ||isFetching ? (
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  gap: 12,
                  paddingVertical: 24,
                }}
              >
                {[1, 2, 3].map((item) => (
                  <View
                    key={item}
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
                        justifyContent:
                          "space-between",
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
                        <SkeletonLoader
                          width={"70%"}
                          height={24}
                          array={[1]}
                          borderRadius={8}
                        />

                        <SkeletonLoader
                          width={"40%"}
                          height={16}
                          array={[1]}
                          borderRadius={8}
                        />

                        <SkeletonLoader
                          width={90}
                          height={32}
                          array={[1]}
                          borderRadius={999}
                        />
                      </View>

                      {/* RIGHT */}
                      <View
                        style={{
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-end",
                        }}
                      >
                        <View
                          style={{
                            alignItems:
                              "flex-end",
                            gap: 8,
                          }}
                        >
                          <SkeletonLoader
                            width={80}
                            height={14}
                            array={[1]}
                            borderRadius={8}
                          />

                          <SkeletonLoader
                            width={70}
                            height={14}
                            array={[1]}
                            borderRadius={8}
                          />
                        </View>

                        <SkeletonLoader
                          width={24}
                          height={24}
                          array={[1]}
                          borderRadius={999}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : queries.length < 1 ? (
            /* EMPTY */
            <ScrollView
              style={{ flex: 1 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              contentContainerStyle={{
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 16,
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 16,
                    gap: 24,
                    paddingVertical: 24,
                  }}
                >
                  <DocumentSearchIcon
                    height={124}
                    width={124}
                  />
                </View>
              </View>
            </ScrollView>
          ) : (
            /* DATA */
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
              <View
                style={{
                  gap: 12,
                  paddingVertical: 24,
                }}
              >
                {queries.map((item: any) => (
                  <QueryCard
                    key={item._id}
                    title={item.subject}
                    category={item.issueType}
                    status={item.status}
                    date={new Date(
                      item.createdAt
                    ).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                    time={new Date(
                      item.createdAt
                    ).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                    onPress={() => {
                      navigation.navigate("QueryDetails",{ query:
                            JSON.stringify(item),})
                    }}
                  />
                ))}
              </View>
            </ScrollView>
          )}

          <ReusableButton
            onPress={() => {
              navigation.navigate("RaiseQuery")
            }}
            title="Raise a new query"
          />
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default Queries;