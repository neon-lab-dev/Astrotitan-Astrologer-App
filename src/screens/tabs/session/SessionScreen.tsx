/* eslint-disable react-native/no-inline-styles */
import ChatIcon from '@/assets/icons/actions/bubble-chat.svg';
import CalenderIcon from '@/assets/icons/navigation/calendar.svg';
import CallIcon from '@/assets/icons/visual/call.svg';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SansText } from '../../../components/reusable/Text/SansText';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import AppHeader from '../../../components/reusable/AppHeader/AppHeader';
import AuthTitle from '../../../components/auth/AuthTitle';
import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';
import { useGetMyConsultationBookingsQuery } from '../../../redux/features/consultation/consultationApi';
import Consultations from '../../../components/SessionScreenPage/Consultations/Consultations';
import CustomCalendar from '../../../components/reusable/CustomCalendar/CustomCalendar';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
// import ConnectGoogleCalendar from '../../../components/ConnectGoogleCalendar';

const SessionsScreen = () => {
  const [activeTab, setActiveTab] = useState('call');
  const [containerWidth, setContainerWidth] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Temporary filter states (applied only when "Apply Filters" is pressed)
  const [tempStatus, setTempStatus] = useState<string>('all');
  const [tempDate, setTempDate] = useState<string>('');

  // Calendar visibility
  const [showCalendar, setShowCalendar] = useState(false);

  const tabs = useMemo(
    () => [
      {
        key: 'call',
        label: 'Calls',
        icon: CallIcon,
      },

      {
        key: 'chat',
        label: 'Chats',
        icon: ChatIcon,
      },
    ],
    [],
  );

  const statusOptions = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'ended', label: 'Ended' },
  ];

  const TAB_WIDTH = containerWidth / tabs.length;

  const handleTabPress = (index: number, key: string) => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setActiveTab(key);

    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
    }).start();
  };

  const {
    data: consultationBookings,
    isLoading: isBookingLoading,
    isFetching: isBookingFetching,
    refetch,
  } = useGetMyConsultationBookingsQuery(
    { date: selectedDate, status: selectedStatus, method: activeTab },
    { skip: false },
  );
  const bookings = consultationBookings?.data?.data || [];

  // Open filter modal - reset temp values to current applied values
  const openFilterModal = () => {
    setTempStatus(selectedStatus);
    setTempDate(selectedDate);
    setShowFilterModal(true);
  };

  // Handle filter apply - only applies when button is pressed
  const handleApplyFilters = () => {
    setSelectedStatus(tempStatus);
    setSelectedDate(tempDate);
    setShowFilterModal(false);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setTempStatus('all');
    setTempDate('');
    setShowCalendar(false);
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: string) => {
    setTempDate(date);
    setShowCalendar(false);
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <SansText style={styles.modalTitle}>Filters</SansText>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <SansText style={styles.modalClose}>✕</SansText>
            </TouchableOpacity>
          </View>

          {/* Status Filter */}
          <View style={styles.filterSection}>
            <SansText style={styles.filterSectionTitle}>Status</SansText>
            <View style={styles.statusChipContainer}>
              {statusOptions.map(status => (
                <TouchableOpacity
                  key={status.key}
                  style={[
                    styles.statusChip,
                    tempStatus === status.key && styles.statusChipActive,
                  ]}
                  onPress={() => setTempStatus(status.key)}
                >
                  <SansText
                    style={[
                      styles.statusChipText,
                      tempStatus === status.key && styles.statusChipTextActive,
                    ]}
                  >
                    {status.label}
                  </SansText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Filter */}
          <View style={styles.filterSection}>
            <SansText style={styles.filterSectionTitle}>Date</SansText>

            {/* Date Button */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowCalendar(!showCalendar)}
            >
              <CalenderIcon width={20} height={20} />
              <SansText style={styles.datePickerText}>
                {tempDate || 'Select Date'}
              </SansText>
              {tempDate && (
                <TouchableOpacity
                  onPress={() => setTempDate('')}
                  style={styles.clearDateButton}
                >
                  <SansText style={styles.clearDateText}>✕</SansText>
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {/* Custom Calendar */}
            {showCalendar && (
              <CustomCalendar
                onDateSelect={handleDateSelect}
                selectedDate={tempDate}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <ReusableButton
              title="Reset"
              onPress={handleResetFilters}
              variant="outline"
              borderColor="#D4AF37"
              textColor="#D4AF37"
              width="45%"
              height={44}
            />
            <ReusableButton
              title="Apply Filters"
              onPress={handleApplyFilters}
              variant="solid"
              width="55%"
              height={44}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

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
          {/* HEADER */}

          <AppHeader showBack={false}>
            <AuthTitle title="Session Logs">
              <SansText>Manage your sessions</SansText>
            </AuthTitle>

            {/* TABS */}

            <View
              style={styles.tabsContainer}
              onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
            >
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab.key;
                const Icon = tab.icon;
                return (
                  <Pressable
                    key={tab.key}
                    style={styles.tabItem}
                    onPress={() => handleTabPress(index, tab.key)}
                  >
                    <View style={styles.tabInner}>
                      <Icon width={18} height={18} />

                      <SansText
                        style={[
                          styles.tabText,
                          isActive && styles.activeTabText,
                        ]}
                      >
                        {tab.label}
                      </SansText>
                    </View>
                  </Pressable>
                );
              })}

              <Animated.View
                style={[
                  styles.animatedIndicator,
                  {
                    width: TAB_WIDTH,

                    transform: [
                      {
                        translateX,
                      },
                    ],
                  },
                ]}
              />
            </View>
          </AppHeader>

          {/* BODY */}
          {/* Filter Row */}
          <View style={styles.filterRow}>
            {/* Active Filters Display */}
            <View style={styles.activeFilters}>
              {selectedStatus !== 'all' && (
                <View style={styles.activeFilterChip}>
                  <SansText style={styles.activeFilterText}>
                    {selectedStatus}
                  </SansText>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedStatus('all');
                    }}
                    style={styles.activeFilterRemove}
                  >
                    <SansText style={styles.activeFilterRemoveText}>✕</SansText>
                  </TouchableOpacity>
                </View>
              )}
              {selectedDate && (
                <View style={styles.activeFilterChip}>
                  <SansText style={styles.activeFilterText}>
                    {selectedDate}
                  </SansText>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDate('');
                    }}
                    style={styles.activeFilterRemove}
                  >
                    <SansText style={styles.activeFilterRemoveText}>✕</SansText>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Filter Button */}
            <TouchableOpacity
              style={styles.filterButton}
              onPress={openFilterModal}
            >
              <CalenderIcon width={18} height={18} />
              <SansText style={styles.filterButtonText}>Filter</SansText>
            </TouchableOpacity>
          </View>

          <ScrollView
          
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                onRefresh={onRefresh}
                refreshing={refreshing}
                tintColor="#D4AF37"
                colors={['#D4AF37']}
                progressBackgroundColor="#FBF7EB"
              />
            }
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 18,
              paddingBottom: 140,
              flexGrow: 1, // Add this to allow centering when empty
            }}
          >
            <Animated.View
              style={{
                opacity,
                flex: 1, // Add this to fill the space
              }}
            >
              {!isBookingLoading &&
              !isBookingFetching &&
              !refreshing &&
              bookings?.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <SansText style={styles.emptyStateText}>
                    No bookings scheduled
                  </SansText>
                  <SansText style={styles.emptyStateSubText}>
                    You don't have any appointments scheduled.
                  </SansText>
                </View>
              ) : (
                <Consultations
                  isLoading={
                    isBookingLoading || isBookingFetching || refreshing
                  }
                  bookings={bookings || []}
                />
              )}
            </Animated.View>
          </ScrollView>
        </View>
        {/* Filter Modal */}
        {renderFilterModal()}
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default SessionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F1D7',
  },

  tabsContainer: {
    flexDirection: 'row',

    position: 'relative',
  },

  tabItem: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    paddingBottom: 16,

    paddingTop: 2,
  },

  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  tabText: {
    fontSize: 16,
    color: '#0D0D0D',
    fontFamily: 'GeneralSans-Medium',
  },

  activeTabText: {
    fontFamily: 'GeneralSans-Semibold',
  },

  animatedIndicator: {
    position: 'absolute',

    bottom: 0,

    height: 3,

    backgroundColor: '#D4AF37',

    borderRadius: 999,
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F1D7',
  },

  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },

  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E0D0',
    gap: 6,
  },

  activeFilterText: {
    fontSize: 12,
    color: '#0D0D0D',
    fontFamily: 'GeneralSans-Medium',
    textTransform: 'capitalize',
  },

  activeFilterRemove: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F0EDE8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeFilterRemoveText: {
    fontSize: 9,
    color: '#666666',
    fontFamily: 'GeneralSans-Regular',
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E0D0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  filterButtonText: {
    fontSize: 13,
    color: '#0D0D0D',
    fontFamily: 'GeneralSans-Medium',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '90%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
  },

  modalClose: {
    fontSize: 18,
    color: '#999999',
    fontFamily: 'GeneralSans-Medium',
    padding: 4,
  },

  filterSection: {
    marginTop: 20,
  },

  filterSectionTitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'GeneralSans-Medium',
    marginBottom: 10,
  },

  statusChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E0D0',
  },

  statusChipActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },

  statusChipText: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'GeneralSans-Medium',
    textTransform: 'capitalize',
  },

  statusChipTextActive: {
    color: '#FFFFFF',
  },

  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E0D0',
  },

  datePickerText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'GeneralSans-Regular',
    flex: 1,
  },

  clearDateButton: {
    padding: 4,
  },

  clearDateText: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'GeneralSans-Medium',
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0EDE8',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 400,
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FBF7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  emptyStateIcon: {
    fontSize: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateButton: {
    width: '80%',
    maxWidth: 250,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
