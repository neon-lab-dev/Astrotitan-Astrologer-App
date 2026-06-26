import StarInactive from "@/assets/icons/navigation/star-inactive.svg";
import ClockIcon from "@/assets/icons/visual/clock.svg";
import StatusIcon from "@/assets/icons/visual/user-status.svg";
import React, {
  useMemo,
} from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import ScreenWrapper from "../../../components/layout/ScreenWrapper";
import AppHeader from "../../../components/reusable/AppHeader/AppHeader";
import { SatoshiText } from "../../../components/reusable/Text/SatoshiText";
import { SansText } from "../../../components/reusable/Text/SansText";
import ContentSection from "../../../components/reusable/ContentSectoin/ContentSection";
import LinearGradient from "react-native-linear-gradient";
import AuthTitle from "../../../components/auth/AuthTitle";
import { useRoute } from "@react-navigation/native";

const SessionHistoryDetailsScreen =
  () => {
       const route = useRoute<any>();
      const params = route.params as string;

    const sessionType =
      params.sessionType

    const userName =
      params.userName

    const date =
      params.date 

    const time =
      params.time ||
      "10:30 AM";

    const duration =
      params.duration ||
      "25 Mins";

    const status =
      params.status 

    const rating =
      params.rating

    const subscriptionType =
      params.subscriptionType ||
      "Subscription";

    const image =
      params.image

    /*
      NOTES
    */

    const sessionNotes =
      [
        "Career decisions may require patience this month",

        "Focus on consistency over quick changes",

        "Saturn influence suggests long-term planning",
      ];

    /*
      CONDITIONS
    */

    const isCompleted =
      status ===
      "Completed";

    const isCancelled =
      status ===
      "Cancelled";

    const isMissed =
      status ===
      "Missed";

    const isSubscription =
      subscriptionType ===
      "Subscription";

    /*
      STATUS COLOR
    */

    const statusColor =
      useMemo(() => {
        if (
          isCompleted
        )
          return "#1B7726";

        if (
          isCancelled
        )
          return "#882715";

        if (
          isMissed
        )
          return "#4A4A4A";

        return "#4A4A4A";
      }, [
        isCompleted,
        isCancelled,
        isMissed,
      ]);

    return (
  
        <ScreenWrapper>
          <View
            style={
              styles.container
            }
          >

            <AppHeader >
              <AuthTitle title={sessionType ===
                "chat"
                ? "Chat history"
                : "Call history"} >

              </AuthTitle>
            </AppHeader>


            {/* BODY */}

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={{
                paddingBottom: 60,
              }}
            >
              {/* USER */}

              <View
                style={
                  styles.userSection
                }
              >
                <Image
                  source={{
                    uri: image,
                  }}
                  style={
                    styles.userImage
                  }
                />

                <SatoshiText
                  style={
                    styles.userName
                  }
                >
                  {userName}
                </SatoshiText>

                <SansText
                  style={
                    styles.dateText
                  }
                >
                  {date} •{" "}
                  {time}
                </SansText>
              </View>

              {/* DIVIDER */}

              <View
                style={
                  styles.divider
                }
              />

              {/* SUMMARY */}

              <View
                style={
                  styles.section
                }
              >
                <ContentSection title="Session Summary" sectionStyle={{ marginBottom: 12 }} titleFontSize={24} />

                <View
                  style={
                    styles.summaryCard
                  }
                >
                  {/* TAG */}

                  <View
                    style={{
                      alignItems:
                        "center",
                      marginBottom: 24,
                    }}
                  >
                    {isSubscription ? (
                      <LinearGradient
                        colors={[
                          "#D4AF37",
                          "#E6D18B",
                        ]}
                        start={{
                          x: 1,
                          y: 0,
                        }}
                        end={{
                          x: 0,
                          y: 0,
                        }}
                        style={
                          styles.subscriptionTag
                        }
                      >
                        <SansText
                          style={
                            styles.subscriptionText
                          }
                        >
                          Subscription
                          Session
                        </SansText>
                      </LinearGradient>
                    ) : (
                      <View
                        style={
                          styles.trialTag
                        }
                      >
                        <SansText
                          style={
                            styles.trialText
                          }
                        >
                          Trial
                          Session
                        </SansText>
                      </View>
                    )}
                  </View>

                  {/* STATS */}

                  <View
                    style={
                      styles.statsRow
                    }
                  >
                    {/* DURATION */}

                    <View
                      style={
                        styles.statItem
                      }
                    >
                      <ClockIcon
                        width={24}
                        height={24}
                      />

                      <SansText
                        style={
                          styles.statLabel
                        }
                      >
                        Duration
                      </SansText>

                      <SatoshiText
                        style={
                          styles.statValue
                        }
                      >
                        {
                          duration
                        }
                      </SatoshiText>
                    </View>

                    {/* STATUS */}

                    <View
                      style={
                        styles.statItem
                      }
                    >
                      <StatusIcon
                        width={24}
                        height={24}
                      />

                      <SansText
                        style={
                          styles.statLabel
                        }
                      >
                        Status
                      </SansText>

                      <SatoshiText
                        style={[
                          styles.statValue,
                          {
                            color:
                              statusColor,
                          },
                        ]}
                      >
                        {
                          status
                        }
                      </SatoshiText>
                    </View>

                    {/* RATING */}

                    <View
                      style={
                        styles.statItem
                      }
                    >
                      <StarInactive
                        width={24}
                        height={24}
                      />

                      <SansText
                        style={
                          styles.statLabel
                        }
                      >
                        Ratings
                      </SansText>

                      <SatoshiText
                        style={
                          styles.statValue
                        }
                      >
                        {rating}
                      </SatoshiText>
                    </View>
                  </View>
                </View>
              </View>

              {/* NOTES */}

              <View
                style={
                  styles.section
                }
              >
                <ContentSection title="Session Notes" sectionStyle={{ marginBottom: 12 }} titleFontSize={24} />

                {isCompleted ? (
                  <View
                    style={
                      styles.notesContainer
                    }
                  >
                    {sessionNotes.map(
                      (
                        note,
                        index
                      ) => (
                        <View
                          key={
                            index
                          }
                          style={
                            styles.noteRow
                          }
                        >
                          <SansText
                            style={
                              styles.bullet
                            }
                          >
                            •
                          </SansText>

                          <SansText
                            style={
                              styles.noteText
                            }
                          >
                            {
                              note
                            }
                          </SansText>
                        </View>
                      )
                    )}
                  </View>
                ) : (
                  <SansText
                    style={
                      styles.emptyText
                    }
                  >
                    No notes for
                    this session
                  </SansText>
                )}
              </View>
            </ScrollView>
          </View>
        </ScreenWrapper>
     
    );
  };

export default SessionHistoryDetailsScreen;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    header: {
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 20,

      borderBottomWidth: 1,

      borderBottomColor:
        "#E8D69A",
    },

    backButton: {
      marginBottom: 18,
    },

    heading: {
      fontSize: 21,
      color: "#0D0D0D",
      fontFamily:
        "Satoshi-Bold",
    },

    userSection: {
      paddingHorizontal: 16,
      paddingTop: 24,
    },

    userImage: {
      width: 84,
      height: 84,
      borderRadius: 999,
      marginBottom: 24,
    },

    userName: {
      fontSize: 21,
      color: "#0D0D0D",
      fontFamily:"Satoshi-Bold",
      marginBottom: 6,
    },

    dateText: {
      fontSize: 16,
      color: "#4A4A4A",
    },

    divider: {
      height: 1,
      backgroundColor:
        "#E6D18B",
      marginTop: 20,
      marginHorizontal: 16,
    },

    section: {
      paddingHorizontal: 16,
      marginTop: 26,
    },

    sectionTitle: {
      fontSize: 21,
      color: "#0D0D0D",
      fontFamily:
        "Satoshi-Bold",
      marginBottom: 14,
    },

    summaryCard: {
      backgroundColor:
        "#FBF7EB",

      borderRadius: 16,

      borderWidth: 1,

      borderColor:
        "#D4AF37",

      padding: 18,
    },

    subscriptionTag: {
      height: 36,
      borderRadius: 12,
      justifyContent:
        "center",
      alignItems:
        "center",
      paddingHorizontal: 16,
    },

    subscriptionText: {
      fontSize: 13,
      color: "#0D0D0D",
    },

    trialTag: {
      height: 36,

      borderRadius: 12,

      borderWidth: 1,

      borderColor:
        "#D4AF37",

      backgroundColor:
        "transparent",

      justifyContent:
        "center",

      alignItems:
        "center",

      paddingHorizontal: 16,
    },

    trialText: {
      fontSize: 13,
      color: "#7A5B00",
    },

    statsRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
    },

    statItem: {
      flex: 1,
      alignItems: "center",
    },

    statLabel: {
      fontSize: 16,
      color: "#4A4A4A",
      marginTop: 8,
      marginBottom: 6,
    },

    statValue: {
      fontSize: 16,
      color: "#0D0D0D",
      fontFamily:"Satoshi-Bold",
      textAlign: "center",
    },

    notesContainer: {
      gap: 10,
    },

    noteRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },

    bullet: {
      fontSize: 16,
      color: "#4A4A4A",
      lineHeight: 24,
    },

    noteText: {
      flex: 1,
      fontSize: 14,
      color: "#4A4A4A",
      lineHeight: 24,
    },

    emptyText: {
      fontSize: 14,
      color: "#7A7A7A",
      lineHeight: 24,
    },
  });