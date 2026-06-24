/* eslint-disable react/no-unescaped-entities */
import EditIcon from "@/assets/icons/actions/edit.svg";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetMeQuery } from "../../../redux/features/auth/authApi";
import AnimatedScreen from "../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../components/layout/ScreenWrapper";
import AppHeader from "../../../components/reusable/AppHeader/AppHeader";
import { SansText } from "../../../components/reusable/Text/SansText";
import AuthTitle from "../../../components/auth/AuthTitle";
import { SatoshiText } from "../../../components/reusable/Text/SatoshiText";
import ReusableButton from "../../../components/reusable/ReusableButton/ReusableButton";
import { useUpdateAvailabilityMutation } from "../../../redux/features/astrologer/astrologerApi";
const DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

const AvailabilityScreen = () => {
  const { data: userData, refetch } = useGetMeQuery({});
  const profile = userData?.data?.profile;

  const [updateAvailability] = useUpdateAvailabilityMutation();

  /* ---------------- STATES ---------------- */
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thur",
    "Fri",
  ]);
  const [startTime, setStartTime] = useState("10:00 AM");
  const [endTime, setEndTime] = useState("05:00 PM");
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [initialState, setInitialState] = useState({
    selectedDays: ["Mon", "Tue", "Wed", "Thur", "Fri"],
    startTime: "10:00 AM",
    endTime: "05:00 PM",
  });

  /* ---------------- MAP FULL DAYS TO ABBREVIATIONS ---------------- */
  const mapFullDayToAbbreviation = (fullDay: string): string => {
    const mapping: { [key: string]: string } = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thur",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun",
    };
    return mapping[fullDay] || fullDay;
  };

  /* ---------------- MAP ABBREVIATIONS TO FULL DAYS ---------------- */
  const mapAbbreviationToFullDay = (abbr: string): string => {
    const mapping: { [key: string]: string } = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thur: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    };
    return mapping[abbr] || abbr;
  };

  /* ---------------- LOAD PROFILE DATA ---------------- */
  useEffect(() => {
    if (profile?.availability) {
      // Check if availability has the new structure with availableTime object
      const availability = profile.availability;

      let availableDaysAbbr = [];
      let start = "10:00 AM";
      let end = "05:00 PM";

      // Handle available days
      if (availability.availableDays) {
        availableDaysAbbr = availability.availableDays.map(
          mapFullDayToAbbreviation,
        );
      } else {
        availableDaysAbbr = ["Mon", "Tue", "Wed", "Thur", "Fri"];
      }

      // Handle time - check if it's in availableTime object or directly in availability
      if (availability.availableTime) {
        start = availability.availableTime.startTime || "10:00 AM";
        end = availability.availableTime.endTime || "05:00 PM";
      } else if (availability.startTime && availability.endTime) {
        start = availability.startTime || "10:00 AM";
        end = availability.endTime || "05:00 PM";
      }

      // Set states with fetched data
      setSelectedDays(availableDaysAbbr);
      setStartTime(start);
      setEndTime(end);

      // Set initial state for tracking changes
      setInitialState({
        selectedDays: availableDaysAbbr,
        startTime: start,
        endTime: end,
      });
    }
    setIsInitialLoading(false);
  }, [profile]);

  /* ---------------- TRACK CHANGES ---------------- */
  useEffect(() => {
    const isSameDays =
      JSON.stringify(selectedDays) ===
      JSON.stringify(initialState.selectedDays);
    const isSameStart = startTime === initialState.startTime;
    const isSameEnd = endTime === initialState.endTime;

    if (isSameDays && isSameStart && isSameEnd) {
      setHasChanges(false);
    } else {
      setHasChanges(true);
    }
  }, [selectedDays, startTime, endTime, initialState]);

  /* ---------------- TOGGLE DAY ---------------- */
  const toggleDay = (day: string) => {
    if (!isEditMode) return;
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      }
      return [...prev, day];
    });
  };

  /* ---------------- VALIDATION ---------------- */
  const isDisabled = useMemo(() => {
    return selectedDays.length === 0 || !startTime.trim() || !endTime.trim();
  }, [selectedDays, startTime, endTime]);

  /* ---------------- SAVE WITH API ---------------- */
  const handleSave = async () => {
    if (isDisabled) return;

    // Map abbreviated days to full day names
    const fullDayNames = selectedDays.map(mapAbbreviationToFullDay);

    // Create payload in the format backend expects
    const payload = {
      availableDays: fullDayNames,
      availableTime: {
        startTime: startTime,
        endTime: endTime,
      },
    };

    setIsLoading(true);

    try {
       await updateAvailability(payload).unwrap();

      // Update initial state
      setInitialState({
        selectedDays,
        startTime,
        endTime,
      });

      setHasChanges(false);
      setIsEditMode(false);

      // Refetch user data to update profile
      refetch();

      Alert.alert("Success", "Availability updated successfully");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.data?.message ||
          "Failed to update availability. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while fetching profile data
  if (isInitialLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View style={styles.container}>
          {/* HEADER */}
          <AppHeader showBack={false}>
            <AuthTitle title="Availability">
              <SansText>
                Set the days and time you're available to receive chat and call
                requests.
              </SansText>
            </AuthTitle>
          </AppHeader>

          {/* BODY */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 180,
            }}
          >
            {/* DAYS */}
            <View style={styles.section}>
              <SatoshiText style={styles.sectionTitle}>
                Select the days you want to work
              </SatoshiText>

              <View style={styles.daysContainer}>
                {DAYS.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      activeOpacity={isEditMode ? 0.85 : 1}
                      disabled={!isEditMode}
                      onPress={() => toggleDay(day)}
                      style={[
                        styles.dayButton,
                        !isEditMode && { opacity: 0.7 },
                        isSelected && styles.selectedDayButton,
                      ]}
                    >
                      <SansText
                        style={[
                          styles.dayText,
                          isSelected && styles.selectedDayText,
                        ]}
                      >
                        {day}
                      </SansText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* TIME */}
            <View style={styles.section}>
              <SatoshiText style={styles.sectionTitle}>
                Select the time range
              </SatoshiText>

              <View style={styles.timeContainer}>
                {/* START */}
                <View style={{ flex: 1 }}>
                  <SansText style={styles.timeLabel}>Start time</SansText>
                  {isEditMode ? (
                    <TextInput
                      value={startTime}
                      onChangeText={(text) => setStartTime(text)}
                      placeholder="10:00 AM"
                      placeholderTextColor="#8A8A8A"
                      style={styles.inputTime}
                    />
                  ) : (
                    <SatoshiText style={styles.timeText}>
                      {startTime}
                    </SatoshiText>
                  )}
                </View>

                {/* DASH */}
                <View style={styles.middleDash}>
                  <SansText style={styles.dashText}>—</SansText>
                </View>

                {/* END */}
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <SansText style={[styles.timeLabel, { textAlign: "right" }]}>
                    End time
                  </SansText>
                  {isEditMode ? (
                    <TextInput
                      value={endTime}
                      onChangeText={(text) => setEndTime(text)}
                      placeholder="05:00 PM"
                      placeholderTextColor="#8A8A8A"
                      style={[styles.inputTime, { textAlign: "right" }]}
                    />
                  ) : (
                    <SatoshiText style={styles.timeText}>{endTime}</SatoshiText>
                  )}
                </View>
              </View>

              {/* EDIT BUTTON */}
              {!isEditMode && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.editButton}
                  onPress={() => setIsEditMode(true)}
                >
                  <EditIcon width={18} height={18} />
                  <SansText style={styles.editText}>Edit Availability</SansText>
                </TouchableOpacity>
              )}

              <SansText style={styles.noteText}>
                Same timing applies to all selected days.
              </SansText>
            </View>
          </ScrollView>

          {/* SAVE BUTTON */}
          {isEditMode && hasChanges && (
            <View style={styles.bottomContainer}>
              <ReusableButton
                title={isLoading ? "Saving..." : "Save Changes"}
                width="100%"
                disabled={isDisabled || isLoading}
                onPress={handleSave}
              />
            </View>
          )}
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};
export default AvailabilityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1D7",
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 24,
    lineHeight: 28,
    color: "#0D0D0D",
    fontFamily: "Satoshi-Bold",
    marginBottom: 18,
    letterSpacing: -0.3,
  },

  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  dayButton: {
    minWidth: 52,
    height: 38,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: "#D4AF37",
    backgroundColor: "#FBF7EB",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  selectedDayButton: {
    backgroundColor: "#D4AF37",
  },

  dayText: {
    fontSize: 14,
    color: "#0D0D0D",
  },

  selectedDayText: {
    color: "#0D0D0D",
    fontFamily: "SansMedium",
  },

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  timeLabel: {
    fontSize: 18,
    color: "#4A4A4A",
    marginBottom: 8,
  },

  timeText: {
    fontSize: 28,
    lineHeight: 36,
    color: "#0D0D0D",
    fontFamily: "Satoshi-Bold",
  },

  inputTime: {
    fontSize: 28,
    lineHeight: 36,

    color: "#0D0D0D",

    fontFamily: "Satoshi-Bold",

    paddingVertical: 0,
  },

  middleDash: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  dashText: {
    fontSize: 28,
    color: "#9A9A9A",
  },

  editButton: {
    marginTop: 26,

    height: 54,

    borderRadius: 999,

    borderWidth: 1.4,

    borderColor: "#D4AF37",

    backgroundColor: "#FBF7EB",

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    gap: 10,
  },

  editText: {
    fontSize: 16,
    color: "#0D0D0D",
  },

  noteText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
    color: "#8A8A8A",
    lineHeight: 20,
  },

  bottomContainer: {
    position: "absolute",

    bottom: 0,
    left: 0,
    right: 0,

    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,

    backgroundColor: "#F8F1D7",
  },
});
