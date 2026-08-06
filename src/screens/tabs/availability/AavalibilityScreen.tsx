import React, { useState, useMemo } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import ScreenWrapper from "../../../components/layout/ScreenWrapper";
import { SansText } from "../../../components/reusable/Text/SansText";
import { SatoshiText } from "../../../components/reusable/Text/SatoshiText";
import ReusableButton from "../../../components/reusable/ReusableButton/ReusableButton";
import AnimatedScreen from "../../../components/layout/AnimatedScreen";
import { useAddSlotMutation } from "../../../redux/features/slot/slotApi";

// Generate time slot options (30 min intervals from 9 AM to 10 PM)
const generateSlotOptions = () => {
  const slots = [];
  for (let hour = 9; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 22 && minute === 30) break;
      
      const startHour = hour;
      const startMinute = minute;
      let endHour = hour;
      let endMinute = minute + 30;
      
      if (endMinute >= 60) {
        endHour += 1;
        endMinute = 0;
      }
      
      if (endHour > 22 || (endHour === 22 && endMinute > 0)) break;
      
      // Format for display
      const startDisplayHour = startHour > 12 ? startHour - 12 : startHour;
      const startAmpm = startHour >= 12 ? 'PM' : 'AM';
      const endDisplayHour = endHour > 12 ? endHour - 12 : endHour;
      const endAmpm = endHour >= 12 ? 'PM' : 'AM';
      
      const startTime = `${startDisplayHour}:${startMinute.toString().padStart(2, '0')} ${startAmpm}`;
      const endTime = `${endDisplayHour}:${endMinute.toString().padStart(2, '0')} ${endAmpm}`;
      
      slots.push(`${startTime} - ${endTime}`);
    }
  }
  return slots;
};

// Generate next 30 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const AvailabilityScreen = () => {
  const [addSlot, { isLoading: isAddingSlot }] = useAddSlotMutation();

  // States
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  // Format date for API
  const formatDateForApi = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if a date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check if a time slot is already selected
  const isSlotSelected = (slot: string) => {
    return selectedSlots.includes(slot);
  };

  // Toggle time slot selection
  const toggleTimeSlot = (slot: string) => {
    setSelectedSlots(prev => {
      if (prev.includes(slot)) {
        return prev.filter(s => s !== slot);
      }
      return [...prev, slot];
    });
  };

  // Get day name
  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Get day number
  const getDayNumber = (date: Date) => {
    return date.getDate();
  };

  // Check if date is selected
  const isDateSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return;
    setSelectedDate(date);
    // Reset selected slots when date changes
    setSelectedSlots([]);
  };

  // Handle add slot
  const handleAddSlot = async () => {
    if (selectedSlots.length === 0) {
      Alert.alert("No Slots Selected", "Please select at least one time slot.");
      return;
    }
    try {
      // Parse the selected slots to get start and end times
      const slots = selectedSlots.map(slot => {
        const [start, end] = slot.split(' - ');
        // Convert 12-hour format to 24-hour format for API
        const convertTo24Hour = (timeStr: string) => {
          const [time, ampm] = timeStr.split(' ');
          let [hour, minute] = time.split(':').map(Number);
          if (ampm === 'PM' && hour !== 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;
          return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        };
        
        return {
          startTime: convertTo24Hour(start),
          endTime: convertTo24Hour(end),
        };
      });

      const payload = {
        date: formatDateForApi(selectedDate),
        slots: slots,
      };

      await addSlot(payload).unwrap();
      Alert.alert("Success", "Slots added successfully!");
      setSelectedSlots([]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to add slots. Please try again."
      );
    }
  };

  // Render date item
  const renderDateItem = ({ item }: { item: Date }) => {
    const isSelected = isDateSelected(item);
    const isPast = isPastDate(item);
    const dayName = getDayName(item);
    const dayNumber = getDayNumber(item);

    return (
      <TouchableOpacity
        style={[
          styles.dateItem,
          isSelected && styles.dateItemSelected,
          isPast && styles.dateItemPast,
        ]}
        onPress={() => handleDateSelect(item)}
        disabled={isPast}
      >
        <SansText style={[
          styles.dateDayName,
          isSelected && styles.dateItemSelectedText,
          isPast && styles.dateItemPastText,
        ]}>
          {dayName}
        </SansText>
        <SatoshiText style={[
          styles.dateDayNumber,
          isSelected && styles.dateItemSelectedText,
          isPast && styles.dateItemPastText,
        ]}>
          {dayNumber}
        </SatoshiText>
        {isToday(item) && (
          <View style={styles.todayBadge}>
            <SansText style={styles.todayBadgeText}>Today</SansText>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const timeSlotOptions = generateSlotOptions();
  const availableDates = generateDates();

  // Group slots by time period for better organization
  const groupedSlots = useMemo(() => {
    const groups = {
      morning: [] as string[],
      afternoon: [] as string[],
      evening: [] as string[],
      night: [] as string[],
    };

    timeSlotOptions.forEach(slot => {
      const [start] = slot.split(' - ');
      const hour = parseInt(start.split(':')[0]);
      
      if (hour >= 9 && hour < 12) {
        groups.morning.push(slot);
      } else if (hour >= 12 && hour < 17) {
        groups.afternoon.push(slot);
      } else if (hour >= 17 && hour < 20) {
        groups.evening.push(slot);
      } else if (hour >= 20 && hour <= 22) {
        groups.night.push(slot);
      }
    });

    return groups;
  }, [timeSlotOptions]);

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <SatoshiText style={styles.headerTitle}>Availability</SatoshiText>
            <SansText style={styles.headerSubtitle}>
              Select dates and time slots you're available (9 AM - 10 PM)
            </SansText>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Date Selection */}
            <View style={styles.section}>
              <SatoshiText style={styles.sectionTitle}>Select Date</SatoshiText>
              <FlatList
                data={availableDates}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderDateItem}
                keyExtractor={(item) => item.toISOString()}
                contentContainerStyle={styles.datesList}
              />
            </View>

            {/* Time Slot Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <SatoshiText style={styles.sectionTitle}>Time Slots</SatoshiText>
                <SansText style={styles.selectedCount}>
                  {selectedSlots.length} selected
                </SansText>
              </View>

              {/* Morning Slots */}
              {groupedSlots.morning.length > 0 && (
                <View style={styles.timeGroup}>
                  <SansText style={styles.timeGroupTitle}>Morning (9 AM - 12 PM)</SansText>
                  <View style={styles.timeSlotsGrid}>
                    {groupedSlots.morning.map((slot) => (
                      <TouchableOpacity
                        key={slot}
                        style={[
                          styles.timeSlotItem,
                          isSlotSelected(slot) && styles.timeSlotItemSelected,
                        ]}
                        onPress={() => toggleTimeSlot(slot)}
                      >
                        <SansText style={[
                          styles.timeSlotText,
                          isSlotSelected(slot) && styles.timeSlotTextSelected,
                        ]}>
                          {slot}
                        </SansText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Afternoon Slots */}
              {groupedSlots.afternoon.length > 0 && (
                <View style={styles.timeGroup}>
                  <SansText style={styles.timeGroupTitle}>Afternoon (12 PM - 5 PM)</SansText>
                  <View style={styles.timeSlotsGrid}>
                    {groupedSlots.afternoon.map((slot) => (
                      <TouchableOpacity
                        key={slot}
                        style={[
                          styles.timeSlotItem,
                          isSlotSelected(slot) && styles.timeSlotItemSelected,
                        ]}
                        onPress={() => toggleTimeSlot(slot)}
                      >
                        <SansText style={[
                          styles.timeSlotText,
                          isSlotSelected(slot) && styles.timeSlotTextSelected,
                        ]}>
                          {slot}
                        </SansText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Evening Slots */}
              {groupedSlots.evening.length > 0 && (
                <View style={styles.timeGroup}>
                  <SansText style={styles.timeGroupTitle}>Evening (5 PM - 8 PM)</SansText>
                  <View style={styles.timeSlotsGrid}>
                    {groupedSlots.evening.map((slot) => (
                      <TouchableOpacity
                        key={slot}
                        style={[
                          styles.timeSlotItem,
                          isSlotSelected(slot) && styles.timeSlotItemSelected,
                        ]}
                        onPress={() => toggleTimeSlot(slot)}
                      >
                        <SansText style={[
                          styles.timeSlotText,
                          isSlotSelected(slot) && styles.timeSlotTextSelected,
                        ]}>
                          {slot}
                        </SansText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Night Slots */}
              {groupedSlots.night.length > 0 && (
                <View style={styles.timeGroup}>
                  <SansText style={styles.timeGroupTitle}>Night (8 PM - 10 PM)</SansText>
                  <View style={styles.timeSlotsGrid}>
                    {groupedSlots.night.map((slot) => (
                      <TouchableOpacity
                        key={slot}
                        style={[
                          styles.timeSlotItem,
                          isSlotSelected(slot) && styles.timeSlotItemSelected,
                        ]}
                        onPress={() => toggleTimeSlot(slot)}
                      >
                        <SansText style={[
                          styles.timeSlotText,
                          isSlotSelected(slot) && styles.timeSlotTextSelected,
                        ]}>
                          {slot}
                        </SansText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Add Slots Button */}
            <View style={styles.buttonContainer}>
              <ReusableButton
                title={isAddingSlot ? "Adding Slots..." : "Add Slots"}
                onPress={handleAddSlot}
                variant="solid"
                width="100%"
                loading={isAddingSlot}
                disabled={isAddingSlot || selectedSlots.length === 0}
              />
            </View>
          </ScrollView>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default AvailabilityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F1D7',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#EDDEAD',
    borderBottomWidth: 1,
    borderBottomColor: '#E6D18B',
  },

  headerTitle: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'GeneralSans-Regular',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  selectedCount: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'GeneralSans-Medium',
  },

  datesList: {
    gap: 10,
    paddingBottom: 4,
  },

  dateItem: {
    width: 60,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E0D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  dateItemSelected: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },

  dateItemPast: {
    opacity: 0.5,
    backgroundColor: '#F5F5F5',
  },

  dateItemSelectedText: {
    color: '#FFFFFF',
  },

  dateItemPastText: {
    color: '#999999',
  },

  dateDayName: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'GeneralSans-Medium',
    marginBottom: 2,
  },

  dateDayNumber: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
  },

  todayBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#D4AF37',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },

  todayBadgeText: {
    fontSize: 7,
    color: '#FFFFFF',
    fontFamily: 'GeneralSans-Bold',
  },

  timeGroup: {
    marginBottom: 16,
  },

  timeGroupTitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'GeneralSans-Medium',
    marginBottom: 8,
  },

  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  timeSlotItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E0D0',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },

  timeSlotItemSelected: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },

  timeSlotText: {
    fontSize: 13,
    color: '#0D0D0D',
    fontFamily: 'GeneralSans-Medium',
    textAlign: 'center',
  },

  timeSlotTextSelected: {
    color: '#FFFFFF',
  },

  buttonContainer: {
    marginTop: 32,
    marginBottom: 16,
  },
});