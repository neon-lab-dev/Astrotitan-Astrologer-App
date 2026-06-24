import React, { useMemo, useState } from "react";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import KeyboardSafeSection from "../layout/KeyboardSafeSection";
import AppInput from "../reusable/InputField/AppInput";
import SelectableOptions from "../reusable/SelectableOptions/SelectableOptions";

const isValidName = (name: string) => {
  const trimmed = name?.trim();

  return /^[A-Za-z\s'-]{2,50}$/.test(trimmed);
};

type FormValue = {
  firstName: string;
  lastName: string;
  displayName: string;
  languages: string[];
};

type Props = {
  value: FormValue;
  setValue: (value: FormValue) => void;
};

const NameQuestion = ({ value, setValue }: Props) => {
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    displayName: false,
  });

  const firstName = value?.firstName || "";
  const lastName = value?.lastName || "";
  const displayName = value?.displayName || "";
  const languages = value?.languages || [];

  const isFirstNameValid = isValidName(firstName);
  const isLastNameValid = isValidName(lastName);
  const isDisplayNameValid = isValidName(displayName);

  const errors = useMemo(
    () => ({
      firstName:
        touched.firstName && !isFirstNameValid
          ? "Please enter a valid first name."
          : "",

      lastName:
        touched.lastName && !isLastNameValid
          ? "Please enter a valid last name."
          : "",

      displayName:
        touched.displayName && !isDisplayNameValid
          ? "Please enter a valid display name."
          : "",
    }),
    [
      touched,
      isFirstNameValid,
      isLastNameValid,
      isDisplayNameValid,
    ]
  );

  const showLanguages =
    isFirstNameValid &&
    isLastNameValid &&
    isDisplayNameValid;

  return (
    <KeyboardSafeSection>
      <View style={{ gap: 16, marginTop: 24 }}>
        {/* FIRST NAME */}
        <AppInput
          label="First Name"
          value={firstName}
          placeholder="Enter your first name"
          onChangeText={(text) => {
            setTouched((prev) => ({
              ...prev,
              firstName: true,
            }));

            setValue({
              ...value,
              firstName: text,
            });
          }}
          onBlur={() =>
            setTouched((prev) => ({
              ...prev,
              firstName: true,
            }))
          }
          error={errors.firstName}
        />

        {/* LAST NAME */}
        <AppInput
          label="Last Name"
          value={lastName}
          placeholder="Enter your last name"
          onChangeText={(text) => {
            setTouched((prev) => ({
              ...prev,
              lastName: true,
            }));

            setValue({
              ...value,
              lastName: text,
            });
          }}
          onBlur={() =>
            setTouched((prev) => ({
              ...prev,
              lastName: true,
            }))
          }
          error={errors.lastName}
        />

        {/* DISPLAY NAME */}
        <AppInput
          label="Display Name"
          value={displayName}
          placeholder="Enter your display name"
          onChangeText={(text) => {
            setTouched((prev) => ({
              ...prev,
              displayName: true,
            }));

            setValue({
              ...value,
              displayName: text,
            });
          }}
          onBlur={() =>
            setTouched((prev) => ({
              ...prev,
              displayName: true,
            }))
          }
          error={errors.displayName}
        />

        {/* LANGUAGES */}
        {showLanguages && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <SelectableOptions
              label="Languages you consult in"
              description="Select at least one language."
              options={[
                { label: "English", value: "english" },
                { label: "Hindi", value: "hindi" },
                { label: "Marathi", value: "marathi" },
                { label: "Telugu", value: "telugu" },
                { label: "Malayalam", value: "malayalam" },
              ]}
              value={languages}
              onChange={(selected: string[]) =>
                setValue({
                  ...value,
                  languages: selected,
                })
              }
              multiple
              variant="grid"
            />
          </Animated.View>
        )}
      </View></KeyboardSafeSection>
  );
};

export default NameQuestion;