/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from "react-native";
import SelectableOptions from "../SelectableOptions/SelectableOptions";
import { SansText } from "../Text/SansText";
import BottomSheetService from "../../../redux/features/ui/GlobalSheet/BottomSheetService";
import Ionicons from "@react-native-vector-icons/ionicons";
import { ScrollView } from "react-native-gesture-handler";

type InputVariant = "text" | "password" | "phone" | "dropdown" | "multiline" | "icon";

type DropdownItem = {
  label: string;
  value: string;
};

type Props = TextInputProps & {
  variant?: InputVariant;
  style?: any;
  containerStyle?: any;
  label?: string;
  callingCode?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  leftIcon?: React.ReactNode;
  onPressLeftIcon?: () => void;
  error?: string;
  isCenter?: boolean
  dropdownData?: DropdownItem[];
  onSelectItem?: (
    item: DropdownItem
  ) => void;
  multiple?: boolean;
  selectedOptions?: string[];
  onMultiSelect?: (
    values: string[]
  ) => void;
};

export default function AppInput({
  variant = "text",
  style,
  containerStyle,
  dropdownData = [],
  multiple = false,
  selectedOptions = [],
  value,
  onSelectItem,
  callingCode,
  onMultiSelect,
  leftIcon,
  onPressLeftIcon,
  isCenter,
  error,
  ...props
}: Props) {
  const [hidePassword, setHidePassword] = useState(true);
  const showError = !!error;
  const isIconInput = variant === "icon";
  /* DROPDOWN STATE */
  const [localSelected, setLocalSelected] =
    useState<string[]>(
      selectedOptions || [],
    );

  useEffect(() => {
    setLocalSelected(
      selectedOptions || [],
    );
  }, [selectedOptions]);

  const isPassword = variant === "password";
  const isPhone = variant === "phone";
  const isDropdown = variant === "dropdown";
  const isMultiline = variant === "multiline";

  const selectedLabel = multiple
    ? dropdownData
      .filter((item) =>
        localSelected.includes(
          item.value,
        ),
      )
      .map(
        (item) => item.label,
      )
      .join(", ")
    : dropdownData.find(
      (i) =>
        i.value === value,
    )?.label || "";
  return (
    <View style={containerStyle}>
      {props.label && <SansText style={styles.label}>{props.label}</SansText>}

      <View
        style={[
          styles.inputWrapper,
          isPhone && styles.phoneWrapper,
          isIconInput && styles.iconWrapper,
          error && showError && isPhone && styles.inputError,
          style,

        ]}
      >
        {/* 📞 PHONE */}
        {isPhone && (
          <View style={styles.countryBox}>
            <SansText
              style={[
                styles.codeText,
                error && showError && isPhone && styles.inputErrorContent,
              ]}
            >
              +{callingCode}
            </SansText>
            <View
              style={{
                width: 1,
                height: 24,
                backgroundColor:
                  error && showError && isPhone ? "#882715" : "#D4AF37",
              }}
            />
          </View>
        )}
        {/* 🔽 DROPDOWN */}
        {/* 🔽 DROPDOWN */}
        {isDropdown ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.input,
              styles.dropdownInput,
              style,
              error &&
              showError &&
              !isPhone &&
              styles.inputError,
            ]}
            onPress={() => {
              BottomSheetService.open(
                <DropdownSheetContent
                  options={dropdownData.map(
                    (item) => ({
                      label: item.label,
                      value: item.value,
                    }),
                  )}
                  initialValue={
                    multiple
                      ? localSelected
                      : value || ""
                  }
                  multiple={multiple}
                  onSubmit={(val: any) => {
                    if (multiple) {
                      const updated =
                        val as string[];

                      setLocalSelected(updated);

                      onMultiSelect?.(updated);
                    } else {
                      props.onChangeText?.(
                        val as string,
                      );

                      const selected =
                        dropdownData.find(
                          (item) =>
                            item.value === val,
                        );

                      if (selected) {
                        onSelectItem?.(
                          selected,
                        );
                      }

                      BottomSheetService.close();
                    }
                  }}
                />,
                {
                  height: 500,
                  hasGradient: true,
                },
              );
            }}
          >
            <SansText
              style={{
                color: selectedLabel
                  ? "#111"
                  : "#575757",
                fontSize: 15,
                includeFontPadding: false,
                textAlignVertical:
                  "center",
              }}
            >
              {selectedLabel ||
                props.placeholder}
            </SansText>

            <Ionicons
              name="chevron-down"
              size={18}
              color="#575757"
            />
          </TouchableOpacity>
        ) : (
          /* ✍️ INPUT */

          <TextInput
            {...props}
            value={value ?? ""}
            onChangeText={(text) => {
              if (isPhone) {
                props.onChangeText?.(text);
              } else {
                props.onChangeText?.(text);
              }
            }}
            onBlur={props.onBlur}
            placeholderTextColor="#575757"
            keyboardType={isPhone ? "phone-pad" : props.keyboardType}
            secureTextEntry={isPassword ? hidePassword : props.secureTextEntry}
            multiline={isMultiline}
            numberOfLines={isMultiline ? props.numberOfLines || 4 : 1}
            textAlignVertical={isMultiline ? "top" : "center"}
            style={[
              styles.input,
              error && showError && styles.inputErrorContent,
              error && showError && !isPhone && styles.inputError,
              isPhone && styles.phoneInput,
              isPassword && { paddingRight: 44 },
              isMultiline && styles.multilineInput,
              style,
              isCenter && { textAlign: "center" }
            ]}
          />
        )}
        {/* 👁 PASSWORD */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setHidePassword((p) => !p)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={hidePassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#575757"
            />
          </TouchableOpacity>
        )}
        {isIconInput && (
          <TouchableOpacity
            onPress={onPressLeftIcon}
            style={styles.leftIcon}
          >
            {leftIcon || (
              <Ionicons name="scan-outline" size={20} color="#575757" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* 🔴 ERROR */}
      {error && <SansText style={styles.errorText}>{error}</SansText>}


    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    position: "relative",
    color: "#0D0D0D",
  },

  label: {
    fontSize: 16,
    color: "#0D0D0D",
    marginBottom: 8,
    lineHeight: 26,
  },

  phoneWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#DBBD59",
    borderRadius: 16,
    backgroundColor: "#EDDEAD",
    height: 72,
    paddingHorizontal: 8,
  },

  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: "100%",
    gap: 6,
  },

  codeText: {
    fontSize: 14,
    color: "#575757",
    includeFontPadding: false, // 🔥 ANDROID FIX
    textAlignVertical: "center",
  },

  input: {
    height: 72,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: "#D4AF37",
    fontSize: 14,
    backgroundColor: "#E9D8A6",
    flex: 1,
    paddingHorizontal: 16,
    fontFamily: "GeneralSans-Regular",
    textAlignVertical: "center", // 🔥 MOST IMPORTANT
    includeFontPadding: false,
    color: "#0D0D0D",
  },

  dropdownInput: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  phoneInput: {
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },

  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 0,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },

  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  dropdownText: {
    fontSize: 14,
    color: "#111",
  },

  multilineInput: {
    minHeight: 100,
    maxHeight: 460,
    height: 260,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: "top",
  },

  inputError: {
    borderColor: "#DC8B7D",
    borderWidth: 1,
  },
  inputErrorContent: {
    color: "#882715",
  },

  errorText: {
    color: "#C2371E",
    fontSize: 14,
    marginTop: 12,
    marginLeft: 4,
  },
  iconWrapper: {
    position: "relative",
  },

  leftIcon: {
    position: "absolute",
    left: 12,
    top: 0,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});



const DropdownSheetContent = ({
  options,
  initialValue,
  multiple,
  onSubmit,
}: any) => {
  const [selected, setSelected] =
    useState(initialValue);

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 28,
        paddingBottom: 40,
        gap: 24,
      }}
    >
      <SansText
        style={{
          fontSize: 12,
          color: "#111",
          fontFamily: "Satoshi-Bold",
        }}
      >
        Select an Option
      </SansText>
      <ScrollView style={{ paddingBottom: 42 }}><SelectableOptions
        options={options}
        value={selected}
        multiple={multiple}
        onChange={(val) => {
          setSelected(val);

          onSubmit(val);
        }}
      /></ScrollView>

    </View>
  );
};