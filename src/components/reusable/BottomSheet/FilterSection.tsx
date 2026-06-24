import TickIcon from '@/assets/icons/visual/tick.svg';
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import ReusableButton from '../ReusableButton/ReusableButton';
import { SansText } from "../Text/SansText";
import { SatoshiText } from "../Text/SatoshiText";

const TABS = [
  { key: "specialization", label: "Specialization" },
  { key: "language", label: "Language Selection" },
  { key: "ratings", label: "Ratings" },
];

const OPTIONS = {
  specialization: ["Career", "Job", "Education", "Marriage", "Health", "Business"],
  language: [
  "Assamese",
  "Bengali",
  "Bodo",
  "Dogri",
  "English",
  "Gujarati",
  "Hindi",
  "Kannada",
  "Kashmiri",
  "Konkani",
  "Maithili",
  "Malayalam",
  "Manipuri",
  "Marathi",
  "Nepali",
  "Odia",
  "Punjabi",
  "Sanskrit",
  "Santali",
  "Sindhi",
  "Tamil",
  "Telugu",
  "Urdu"
],
  ratings: ["4 & above", "3 & above", "2 & above", "1 & above"],
};

type Filters = {
  specialization: string[];
  language: string[];
  ratings: string[];
};

type Props = {
  value: Filters;
  onChange: (val: Filters) => void;
  onApply: (val: Filters) => void;
  onClear: () => void;
};

const FilterSection = ({ value,  onApply, onClear }: Props) => {
  const [activeTab, setActiveTab] = useState<keyof Filters>("specialization");

  const [filters, setFilters] = useState(value);

  const toggleOption = (val: string) => {
    const current = filters[activeTab];

    const updated = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];

    setFilters({
      ...filters,
      [activeTab]: updated,
    });
  };
  useEffect(() => {
    setFilters(value);
  }, [value]);
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <SatoshiText style={styles.title}>Filters</SatoshiText>
      </View>

      <View style={styles.body}>
        {/* LEFT */}
        <View style={styles.left}>
          {TABS.map((tab) => {
            const key = tab.key as keyof Filters;
            const isActive = activeTab === key;
            const count = filters[key]?.length;

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(key)}
                style={[styles.tab, isActive && styles.activeTab]}
              >
                <SatoshiText style={[styles.tabText, isActive && styles.activeText]}>
                  {tab.label} {count > 0 ? `(${count})` : ""}
                </SatoshiText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RIGHT */}
        <ScrollView style={styles.right} showsVerticalScrollIndicator={false}>
          {OPTIONS[activeTab].map((item) => {
            const selected = filters[activeTab].includes(item);

            return (
              <TouchableOpacity
                key={item}
                style={styles.option}
                onPress={() => toggleOption(item)}
              >
                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                  {selected && <TickIcon width={12} height={12} fill="#fff" />}
                </View>

                <SansText style={styles.optionText}>{item}</SansText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <ReusableButton
            title="Clear Filters"
            variant="outline"
            width="100%"
            onPress={() => {
              const emptyFilters = {
                specialization: [],
                language: [],
                ratings: [],
              };

              // ✅ reset local UI state (THIS FIXES TICKS)
              setFilters(emptyFilters);

              // ✅ reset parent state
              onClear();
            }}
          />
        </View>

        <View style={{ flex: 1 , marginBottom:56}}>
          <ReusableButton
            title="Apply Filters"
            width="100%"
            onPress={() => onApply(filters)}
          />
        </View>
      </View>
    </View>
  );
};

export default FilterSection;

const styles = StyleSheet.create({
  container: { flex: 1,  },

  header: {
    backgroundColor: "#EDDEAD",
    borderBottomWidth: 1,
    borderBottomColor: "#E6D18B",
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 22,
    fontFamily: "Satoshi-Bold",
  },

  body: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 16,
  },

  left: {
    width: 180,
    borderRightWidth: 1,
    borderColor: "#E6D18B",
    marginTop: 20,
  },

  tab: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderLeftWidth: 12,
    borderColor: "transparent",
  },

  activeTab: {
    borderColor: "#D4AF37",
  },

  tabText: {
    fontSize: 18,
  },

  activeText: {
    fontFamily: "Satoshi-Bold",
  },

  right: {
    flex: 1,
    paddingLeft: 12,
    marginTop: 20,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 16,
  },

  optionText: {
    fontSize: 16,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },

  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});