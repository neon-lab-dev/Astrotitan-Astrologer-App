import { SatoshiText } from "@/components/reusable/Text/SatoshiText";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from "react-native";

type TabOption = {
  label: string;
  value: string;
};

type Props = {
  options: TabOption[];
  selected: string;
  onChange: (val: string) => void;
};

const Tabs: React.FC<Props> = ({ options, selected, onChange }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={{paddingLeft:16}}
    >
      {options.map((item) => {
        const isActive = selected === item.value;

        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => onChange(item.value)}
            style={[styles.tab, isActive && styles.activeTab]}
            activeOpacity={0.8}
          >
            <SatoshiText
              style={[styles.text, isActive && styles.activeText]}
            >
              {item.label}
            </SatoshiText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 4,
  },

  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8, // 🔥 spacing between tabs
  },

  activeTab: {
    backgroundColor: "#E6D18B",
  },

  text: {
    fontSize: 18,
    color: "#444",
    fontFamily: "Satoshi-Bold",
  },

  activeText: {
    color: "#000",
  },
});