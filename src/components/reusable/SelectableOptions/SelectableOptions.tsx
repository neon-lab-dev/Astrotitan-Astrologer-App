import TickIcon from '@/assets/icons/visual/tick.svg'; // ✅ FIX import
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SansText } from '../Text/SansText';
import { SatoshiText } from '../Text/SatoshiText';

type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<any>;
};

type Props = {
  label ?:string
  description ?:string
  options: Option[];
  value: string | string[];
  onChange: (val: any) => void;
  multiple?: boolean;
  variant?: 'list' | 'grid';
};

const SelectableOptions: React.FC<Props> = ({
  label,
  description,
  options,
  variant = 'list',
  value,
  onChange,
  multiple = false,
}) => {

  const isSelected = (val: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(val);
    }
    return value === val;
  };

  const handlePress = (val: string) => {
    if (multiple) {
      if (!Array.isArray(value)) return;

      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
    } else {
      onChange(val);
    }
  };

  return (
    <View>
      {label && (
          <SatoshiText style={{ fontSize: 28, color: '#0D0D0D', fontFamily: 'Satoshi-Bold', marginBottom: 8 }}>{label}</SatoshiText>
       
      )}
      {description && (
          <SansText style={{ fontSize: 18, color: '#0D0D0D',marginBottom: 16 }}>{description}</SansText>
       
      )}
      <View style={[
          styles.container,
          variant === 'grid' && styles.gridContainer,
        ]}>
        {options.map((item) => {
          const selected = isSelected(item.value);
          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => handlePress(item.value)}
              style={[
                styles.card,
                variant === 'grid' && styles.gridCard,
                selected && !multiple && styles.singleSelectedCard,
                selected && multiple && styles.multiSelectedCard,
              ]}
            >
              <View style={styles.left}>
                {Icon && <Icon width={20} height={20} />}
                <SansText style={styles.text}>{item.label}</SansText>
              </View>

              {multiple && (
                <View
                  style={[
                    styles.circle,
                    selected && styles.selectedCircle,
                  ]}
                >
                  {selected && (
                    <TickIcon width={12} height={12} />
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default SelectableOptions;

const styles = StyleSheet.create({
   container: {
    gap: 12,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#EDDEAD",
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  singleSelectedCard: {
    borderColor: '#D4AF37',
  },
  multiSelectedCard: {
    backgroundColor: '#D4AF37',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 16,
    color: '#111',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D4AF37',
    alignItems: 'center',   // ✅ center tick
    justifyContent: 'center', // ✅ center tick
  },
  selectedCircle: {
    backgroundColor: '#E9F7EB',
    borderColor: "#E9F7EB",
  },
    gridCard: {
    width: '48%', // 🔥 2-column grid
    padding: 14,
  },
});