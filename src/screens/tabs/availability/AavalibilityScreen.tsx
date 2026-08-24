/* eslint-disable no-catch-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useCallback } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  RefreshControl,
} from 'react-native';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import { SansText } from '../../../components/reusable/Text/SansText';
import { SatoshiText } from '../../../components/reusable/Text/SatoshiText';
import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import {
  useAddSlotMutation,
  useGetAllSlotsByAstrologerIdQuery,
} from '../../../redux/features/slot/slotApi';

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

      const startTime = `${startDisplayHour}:${startMinute
        .toString()
        .padStart(2, '0')} ${startAmpm}`;
      const endTime = `${endDisplayHour}:${endMinute
        .toString()
        .padStart(2, '0')} ${endAmpm}`;

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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // States
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isAddSlotModalVisible, setIsAddSlotModalVisible] = useState(false);

  const formattedDate = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1,
  ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  const {
    data,
    isLoading: isSlotsLoading,
    isFetching: isSlotsFetching,
    refetch,
    error,
  } = useGetAllSlotsByAstrologerIdQuery(formattedDate);

  const [addSlot, { isLoading: isAddingSlot }] = useAddSlotMutation();

  // Get available slots from API
  const availableSlots = data?.data?.slots || [];
  console.log(error, 'availableSlots');

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

  // Check if a slot is already added (from API)
  const isSlotAdded = (slot: string) => {
    return availableSlots.some((s: any) => {
      // Convert API slot time to display format for comparison
      const startTime = s.startTime;
      const endTime = s.endTime;
      const displaySlot = `${startTime} - ${endTime}`;
      return displaySlot === slot;
    });
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
  };

  // Handle add slot - Open modal
  const handleOpenAddSlotModal = () => {
    setSelectedSlots([]);
    setIsAddSlotModalVisible(true);
  };

  // Handle confirm add slot
  const handleConfirmAddSlot = async () => {
    if (selectedSlots.length === 0) {
      Alert.alert('No Slots Selected', 'Please select at least one time slot.');
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
          return `${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}`;
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
      Alert.alert('Success', 'Slots added successfully!');
      setSelectedSlots([]);
      setIsAddSlotModalVisible(false);
      refetch(); // Refresh the slots list
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to add slots. Please try again.',
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
        <SansText
          style={[
            styles.dateDayName,
            isSelected && styles.dateItemSelectedText,
            isPast && styles.dateItemPastText,
          ]}
        >
          {dayName}
        </SansText>
        <SatoshiText
          style={[
            styles.dateDayNumber,
            isSelected && styles.dateItemSelectedText,
            isPast && styles.dateItemPastText,
          ]}
        >
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

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    try {
      setRefreshing(true);

      await Promise.all([refetch().unwrap()]);
    } catch (error) {
      console.log('REFRESH ERROR:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetch]);

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <SatoshiText style={styles.headerTitle}>Availability</SatoshiText>
            <SansText style={styles.headerSubtitle}>
              Select a date to view available slots
            </SansText>
          </View>

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#816B22"
                colors={['#816B22']}
                progressBackgroundColor="#FBF7EB"
              />
            }
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
                keyExtractor={item => item.toISOString()}
                contentContainerStyle={styles.datesList}
              />
            </View>

            {/* Available Time Slots */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <SatoshiText style={styles.sectionTitle}>
                  Available Time Slots
                </SatoshiText>
                <SansText style={styles.slotCount}>
                  {isSlotsLoading || isSlotsFetching
                    ? 'Loading...'
                    : `${availableSlots.length} slots available`}
                </SansText>
              </View>

              {isSlotsLoading || isSlotsFetching ? (
                <View style={styles.loadingContainer}>
                  <SansText style={styles.loadingText}>
                    Loading slots...
                  </SansText>
                </View>
              ) : availableSlots.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <SansText style={styles.emptyText}>
                    No slots available for this date
                  </SansText>
                  <SansText style={styles.emptySubText}>
                    Click "Add Slot" to create new time slots
                  </SansText>
                </View>
              ) : (
                <View style={styles.slotsGrid}>
                  {availableSlots.map((slot: any, index: number) => (
                    <View key={index} style={styles.slotItem}>
                      <SansText style={styles.slotItemText}>
                        {slot.startTime} - {slot.endTime}
                      </SansText>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Add Slot Button */}
            <View style={styles.buttonContainer}>
              <ReusableButton
                title="Add Slot"
                onPress={handleOpenAddSlotModal}
                variant="solid"
                width="100%"
              />
            </View>
          </ScrollView>
        </View>

        {/* Add Slot Modal */}
        {/* Add Slot Modal */}
        <Modal
          visible={isAddSlotModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsAddSlotModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Modal Header - Fixed at top */}
              <View style={styles.modalHeader}>
                <SatoshiText style={styles.modalTitle}>
                  Add Time Slots
                </SatoshiText>
                <SansText style={styles.modalSubtitle}>
                  Select multiple slots for{' '}
                  {selectedDate.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </SansText>
              </View>

              {/* Scrollable Content - Takes remaining space */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                {/* All Slots in one grid */}
                <View style={styles.modalTimeGroup}>
                  <SansText style={styles.modalTimeGroupTitle}>
                    All Time Slots (9 AM - 10 PM)
                  </SansText>
                  <View style={styles.modalTimeSlotsGrid}>
                    {timeSlotOptions.map((slot, index) => {
                      const selected = isSlotSelected(slot);
                      const added = isSlotAdded(slot);

                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.modalSlotItem,
                            selected && styles.modalSlotItemSelected,
                            added && styles.modalSlotItemDisabled,
                          ]}
                          onPress={() => {
                            if (!added) {
                              toggleTimeSlot(slot);
                            }
                          }}
                          disabled={added}
                        >
                          <SansText
                            style={[
                              styles.modalSlotText,
                              selected && styles.modalSlotTextSelected,
                              added && styles.modalSlotTextDisabled,
                            ]}
                          >
                            {slot}
                          </SansText>
                          {added && (
                            <View style={styles.addedBadge}>
                              <SansText style={styles.addedBadgeText}>
                                Added
                              </SansText>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>

              {/* Fixed Footer with Buttons - Sticky at bottom */}
              <View style={styles.modalFooter}>
                <View style={styles.modalSelectedCount}>
                  <SansText style={styles.modalSelectedText}>
                    {selectedSlots.length} slot
                    {selectedSlots.length !== 1 ? 's' : ''} selected
                  </SansText>
                </View>

                <View style={styles.modalButtonRow}>
                  <ReusableButton
                    title="Cancel"
                    variant="outline"
                    onPress={() => {
                      setIsAddSlotModalVisible(false);
                      setSelectedSlots([]);
                    }}
                    style={styles.modalCancelButton}
                  />
                  <ReusableButton
                    title="Add Selected Slots"
                    variant="solid"
                    onPress={handleConfirmAddSlot}
                    loading={isAddingSlot}
                    disabled={isAddingSlot || selectedSlots.length === 0}
                    style={styles.modalConfirmButton}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
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

  slotCount: {
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

  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'GeneralSans-Regular',
  },

  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'GeneralSans-Medium',
  },

  emptySubText: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'GeneralSans-Regular',
    marginTop: 4,
  },

  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  slotItem: {
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

  slotItemText: {
    fontSize: 13,
    color: '#0D0D0D',
    fontFamily: 'GeneralSans-Medium',
    textAlign: 'center',
  },

  buttonContainer: {
    marginTop: 32,
    marginBottom: 16,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#F8F1D7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '90%',
    // Use flex to structure the modal
    flex: 1,
  },

  modalHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E0D0',
  },

  modalTitle: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
  },

  modalSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'GeneralSans-Regular',
    marginTop: 4,
  },

  // Scrollable content area
  modalScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  modalTimeGroup: {
    marginBottom: 16,
  },

  modalTimeGroupTitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'GeneralSans-Medium',
    marginBottom: 8,
  },

  modalTimeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  modalSlotItem: {
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
    position: 'relative',
  },

  modalSlotItemSelected: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },

  modalSlotItemDisabled: {
    opacity: 0.6,
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },

  modalSlotText: {
    fontSize: 13,
    color: '#0D0D0D',
    fontFamily: 'GeneralSans-Medium',
    textAlign: 'center',
  },

  modalSlotTextSelected: {
    color: '#FFFFFF',
  },

  modalSlotTextDisabled: {
    color: '#999999',
  },

  addedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  addedBadgeText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontFamily: 'GeneralSans-Bold',
  },

  // Fixed Footer - Sticky at bottom
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E0D0',
    backgroundColor: '#F8F1D7',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  modalSelectedCount: {
    alignItems: 'center',
    marginBottom: 12,
  },

  modalSelectedText: {
    fontSize: 14,
    color: '#0D0D0D',
    fontFamily: 'GeneralSans-Medium',
  },

  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },

  modalCancelButton: {
    flex: 1,
  },

  modalConfirmButton: {
    flex: 2,
  },
});
