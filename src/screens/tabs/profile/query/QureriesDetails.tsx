import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  Image,
  ScrollView,
  View
} from "react-native";
import { RootStackParamList } from "../../../../navigation/types";4
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useDeleteQueryMutation } from "../../../../redux/features/quary/quaryApi";
import BottomSheetService from "../../../../redux/features/ui/GlobalSheet/BottomSheetService";
import DeleteQuerySection from "../../../../components/reusable/BottomSheet/DeleteQuerySection";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SatoshiText } from "../../../../components/reusable/Text/SatoshiText";
import { SansText } from "../../../../components/reusable/Text/SansText";
import ContentSection from "../../../../components/reusable/ContentSectoin/ContentSection";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
const QueryDetails = () => {type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>(); 
  const route = useRoute<any>();
    const {query }= route.params || {};
const [deleteQuery, { isLoading }] =
  useDeleteQueryMutation();
 const onPressDelete = () => {
  BottomSheetService.open(
    <DeleteQuerySection
      onCancel={BottomSheetService.close}
      onDelete={async () => {
        try {
          await deleteQuery(
            queryData?._id
          ).unwrap();

          BottomSheetService.close();

          navigation.goBack();
        } catch (error) {
          console.log(
            "DELETE QUERY ERROR:",
            error
          );
        }
      }}
    />,
    {
      height: 400,
      hasGradient: true,
    }
  );
};

  const queryData = query
    ? JSON.parse(query as string)
    : null;

  console.log(queryData)
  const formatStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";

      case "inProgress":
        return "In Review";

      case "resolved":
        return "Resolved";

      default:
        return status;
    }
  };

  const timeline = [
    {
      title: "Query raised",
      time: queryData?.createdAt,
      description: "We received your issue",
      active: true,
    },

    {
      title: "Under review",
      // time: queryData?.updatedAt,
      description:
        "Support team is reviewing your query",
      active:
        queryData?.status === "inProgress" ||
        queryData?.status === "resolved",
    },

    {
      title: "Resolved",
      // time: queryData?.updatedAt,
      description: "Issue resolved successfully",
      active: queryData?.status === "resolved",
    },
  ];

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader>
          <AuthTitle
            title={

              "Query details"
            }
          >
          </AuthTitle>
        </AppHeader>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#EFE5C8",
              overflow: "hidden",
              paddingBottom: 120,
              position: "relative"
            }}
          >

            {/* TOP INFO */}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#D8CCAA",
                padding: 16,
                gap: 8,
              }}
            >
              <SatoshiText
                style={{
                  fontSize: 24,
                  lineHeight: 28,
                  fontFamily: "Satoshi-Medium",
                  color: "#0D0D0D"
                }}
              >
                {queryData?.subject}
              </SatoshiText>

              <SansText
                style={{
                  color: "#0D0D0D",
                  fontSize: 18,
                  lineHeight: 26
                }}
              >
                {new Date(
                  queryData?.createdAt
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </SansText>

              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor:
                    queryData?.status === "resolved"
                      ? "#1B7726"
                      : "#4B4B4B",
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 999,
                  marginTop: 10,
                }}
              >
                <SansText
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    textTransform: "capitalize",
                  }}
                >
                  {formatStatus(queryData?.status)}
                </SansText>
              </View>
            </View>

            {/* TIMELINE */}
            {/* TIMELINE */}
            <View
              style={{
                marginHorizontal: 16,
                backgroundColor: "#FBF7EB",
                borderRadius: 22,
                paddingHorizontal: 18,
                paddingVertical: 22,
              }}
            >
              {timeline.map((item, index) => {
                const isLast =
                  index === timeline.length - 1;

                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    {/* LEFT SIDE */}
                    <View
                      style={{
                        alignItems: "center",
                        marginRight: 14,
                      }}
                    >
                      {/* DOT */}
                      <View
                        style={{
                          height: 24,
                          width: 24,
                          borderRadius: 999,
                          backgroundColor: item.active
                            ? "#1B7726"
                            : "#B7B2AA",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 2,
                        }}
                      >
                        {item.active && (
                          <SansText
                            style={{
                              color: "#fff",
                              fontSize: 12,
                              fontFamily: "GeneralSans-Bold",
                            }}
                          >
                            ✓
                          </SansText>
                        )}
                      </View>

                      {/* LINE */}
                      {!isLast && (
                        <View
                          style={{
                            width: 2,
                            minHeight: 72,
                            marginTop: 6,
                            borderRadius: 999,
                            backgroundColor:
                              timeline[index + 1]
                                ?.active
                                ? "#46A6EA"
                                : "#BDB7AF",
                          }}
                        />
                      )}
                    </View>

                    {/* RIGHT CONTENT */}
                    <View
                      style={{
                        flex: 1,
                        paddingBottom: isLast ? 0 : 24,
                      }}
                    >
                      {/* TITLE */}
                      <SansText
                        style={{
                          fontSize: 18,
                          lineHeight: 24,
                          fontFamily: "GeneralSans-Bold",
                          color: item.active
                            ? "#121212"
                            : "#9D978E",
                        }}
                      >
                        {item.title}
                      </SansText>

                      {/* SUBTEXT */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flexWrap: "wrap",
                          marginTop: 6,
                        }}
                      >
                        <SansText
                          style={{
                            fontSize: 13,
                            color: item.active
                              ? "#4A4A4A"
                              : "#9D978E",
                          }}
                        >
                          {item.active
                            ? new Date(
                              item.time
                            ).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )
                           :""}
                        </SansText>

                        {!!item.description &&
                          item.active && (
                            <>
                              <SansText
                                style={{
                                  fontSize: 13,
                                  marginHorizontal: 6,
                                  color: "#4A4A4A",
                                }}
                              >
                                •
                              </SansText>

                              <SansText
                                style={{
                                  fontSize: 13,
                                  color: "#4A4A4A",
                                }}
                              >
                                {item.description}
                              </SansText>
                            </>
                          )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={{ paddingHorizontal: 16, gap: 12, marginTop: 12 }}><ContentSection title="Issue type">
              <SansText>{queryData?.issueType}</SansText>
            </ContentSection>


              <ContentSection title="Your message">
                <SansText>{queryData?.description}</SansText>
              </ContentSection></View>

            {/* ATTACHMENTS */}
            {!!queryData?.attachments?.length && (
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingTop: 24,
                  gap: 12,
                }}
              >
                <SansText
                  style={{
                    fontFamily: "GeneralSans-Bold",
                    fontSize: 16,
                  }}
                >
                  Attachments
                </SansText>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  {queryData?.attachments?.map(
                    (
                      item: string,
                      index: number
                    ) => (
                      <Image
                        key={index}
                        source={{
                          uri: item,
                        }}
                        style={{
                          height: 124,
                          width: 124,
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: "#D4AF37"
                        }}
                      />
                    )
                  )}
                </View>
              </View>
            )}

            {/* BUTTON */}
            
          </View>
        </ScrollView>
        {queryData?.status === "resolved" && <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: 16,
                paddingTop: 14,
                paddingBottom: 20,
                backgroundColor: "#FBF7EB",
                borderTopEndRadius:24,
                borderTopStartRadius:24,
              }}
            >
              <ReusableButton
                title="Delete Query"
                onPress={() => {onPressDelete() }}
                variant="error"
                loading={isLoading}
                disabled={isLoading}
              />
            </View>}
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default QueryDetails;