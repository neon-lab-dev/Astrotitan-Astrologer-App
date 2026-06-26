import { useState } from "react";
import { StyleSheet, View } from "react-native";
import SelectableOptions from "../SelectableOptions/SelectableOptions";
import { SansText } from "../Text/SansText";
import { SatoshiText } from "../Text/SatoshiText";

type Props = {
  onApply: (value: string) => void;
};

const SortBySection = ({ onApply }: Props) => {
  // ✅ MUST BE ARRAY because multiple=true
  const [value, setValue] = useState<string>("relevance");

  return (
    <View style={styles.container}>
      <SatoshiText style={styles.title}>Sort by</SatoshiText>

      <SelectableOptions
        options={[
          { label: "Top Rated", value: "topRated" },
          { label: "Most Experienced", value: "mostExperienced" },
          { label: "Relevance", value: "relevance" },
        ]}
        value={value}
        onChange={(val: string) => {
          setValue(val);
          onApply(val); // ✅ FULL VALUE
        }}
      />

      <SansText style={styles.footer}>
        Sorting won&apos;t affect availability
      </SansText>
    </View>
  );
};

export default SortBySection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
    paddingBottom:56
  },

  title: {
    fontSize: 21,
    fontFamily: "Satoshi-Bold",
  },

  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
  },
});