import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { SansText } from '../Text/SansText';
import { SatoshiText } from '../Text/SatoshiText';

interface CalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
  onClose?: () => void;
}

const CustomCalendar = ({ onDateSelect, onClose }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Get month name
  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);

    const days = [];
    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', isCurrentMonth: false });
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDay === i && 
                         selectedMonth === month && 
                         selectedYear === year;
      days.push({ 
        day: i, 
        isCurrentMonth: true,
        isToday,
        isSelected,
        date: date
      });
    }

    return days;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Handle day selection
  const handleDayPress = (day: number) => {
    if (day) {
      setSelectedDay(day);
      setSelectedMonth(currentMonth.getMonth());
      setSelectedYear(currentMonth.getFullYear());
      
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      onDateSelect(formattedDate);
      if (onClose) {
        onClose();
      }
    }
  };

  // Clear selected date
  const handleClearDate = () => {
    setSelectedDay(null);
    setSelectedMonth(null);
    setSelectedYear(null);
    onDateSelect('');
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = generateCalendarDays();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SatoshiText style={styles.headerTitle}>Select Date</SatoshiText>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <SansText style={styles.closeText}>✕</SansText>
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <SansText style={styles.navArrow}>‹</SansText>
        </TouchableOpacity>
        <SatoshiText style={styles.navText}>
          {getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}
        </SatoshiText>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <SansText style={styles.navArrow}>›</SansText>
        </TouchableOpacity>
      </View>

      {/* Week Days Header */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDayCell}>
            <SansText style={styles.weekDayText}>{day}</SansText>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {days.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              item.isSelected && styles.dayCellSelected,
              item.isToday && !item.isSelected && styles.dayCellToday,
              !item.isCurrentMonth && styles.dayCellEmpty,
            ]}
            onPress={() => handleDayPress(item.day as number)}
            disabled={!item.isCurrentMonth}
          >
            <SansText
              style={[
                styles.dayText,
                item.isSelected && styles.dayTextSelected,
                item.isToday && !item.isSelected && styles.dayTextToday,
                !item.isCurrentMonth && styles.dayTextEmpty,
              ]}
            >
              {item.day}
            </SansText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer - Clear Date */}
      {(selectedDay !== null) && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearDate}>
          <SansText style={styles.clearText}>Clear Date</SansText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
  },

  closeButton: {
    padding: 4,
  },

  closeText: {
    fontSize: 18,
    color: '#999999',
    fontFamily: 'GeneralSans-Medium',
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  navButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },

  navArrow: {
    fontSize: 24,
    color: '#666666',
    fontFamily: 'GeneralSans-Medium',
  },

  navText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
  },

  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },

  weekDayText: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'GeneralSans-Medium',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 4,
  },

  dayCellSelected: {
    backgroundColor: '#D4AF37',
  },

  dayCellToday: {
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },

  dayCellEmpty: {
    opacity: 0,
  },

  dayText: {
    fontSize: 14,
    color: '#0D0D0D',
    fontFamily: 'GeneralSans-Regular',
  },

  dayTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'GeneralSans-Bold',
  },

  dayTextToday: {
    color: '#D4AF37',
    fontFamily: 'GeneralSans-Bold',
  },

  dayTextEmpty: {
    color: '#E0E0E0',
  },

  clearButton: {
    marginTop: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0EDE8',
  },

  clearText: {
    fontSize: 14,
    color: '#D4AF37',
    fontFamily: 'GeneralSans-Medium',
  },
});

export default CustomCalendar;