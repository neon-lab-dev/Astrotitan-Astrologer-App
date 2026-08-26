import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import KeyboardSafeSection from '../layout/KeyboardSafeSection';
import AppInput from '../reusable/InputField/AppInput';
import SelectableOptions from '../reusable/SelectableOptions/SelectableOptions';

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

  const firstName = value?.firstName || '';
  const lastName = value?.lastName || '';
  const displayName = value?.displayName || '';
  const languages = value?.languages || [];

  const isFirstNameValid = isValidName(firstName);
  const isLastNameValid = isValidName(lastName);
  const isDisplayNameValid = isValidName(displayName);

  const errors = useMemo(
    () => ({
      firstName:
        touched.firstName && !isFirstNameValid
          ? 'Please enter a valid first name.'
          : '',

      lastName:
        touched.lastName && !isLastNameValid
          ? 'Please enter a valid last name.'
          : '',

      displayName:
        touched.displayName && !isDisplayNameValid
          ? 'Please enter a valid display name.'
          : '',
    }),
    [touched, isFirstNameValid, isLastNameValid, isDisplayNameValid],
  );

  const showLanguages =
    isFirstNameValid && isLastNameValid && isDisplayNameValid;

  return (
    <KeyboardSafeSection>
      <View style={{ gap: 16, marginTop: 24 }}>
        {/* FIRST NAME */}
        <AppInput
          label="First Name"
          value={firstName}
          placeholder="Enter your first name"
          onChangeText={text => {
            setTouched(prev => ({
              ...prev,
              firstName: true,
            }));

            setValue({
              ...value,
              firstName: text,
            });
          }}
          onBlur={() =>
            setTouched(prev => ({
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
          onChangeText={text => {
            setTouched(prev => ({
              ...prev,
              lastName: true,
            }));

            setValue({
              ...value,
              lastName: text,
            });
          }}
          onBlur={() =>
            setTouched(prev => ({
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
          onChangeText={text => {
            setTouched(prev => ({
              ...prev,
              displayName: true,
            }));

            setValue({
              ...value,
              displayName: text,
            });
          }}
          onBlur={() =>
            setTouched(prev => ({
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
                { label: 'English', value: 'english' },
                { label: 'Hindi', value: 'hindi' },
                { label: 'Marathi', value: 'marathi' },
                { label: 'Telugu', value: 'telugu' },
                { label: 'Malayalam', value: 'malayalam' },
                { label: 'Tamil', value: 'tamil' },
                { label: 'Kannada', value: 'kannada' },
                { label: 'Bengali', value: 'bengali' },
                { label: 'Urdu', value: 'urdu' },
                { label: 'Gujarati', value: 'gujarati' },
                { label: 'Odia', value: 'odia' },
                { label: 'Punjabi', value: 'punjabi' },
                { label: 'Assamese', value: 'assamese' },
                { label: 'Maithili', value: 'maithili' },
                { label: 'Sanskrit', value: 'sanskrit' },
                { label: 'Kashmiri', value: 'kashmiri' },
                { label: 'Sindhi', value: 'sindhi' },
                { label: 'Konkani', value: 'konkani' },
                { label: 'Dogri', value: 'dogri' },
                { label: 'Bodo', value: 'bodo' },
                { label: 'Santali', value: 'santali' },
                { label: 'Nepali', value: 'nepali' },
                { label: 'Tulu', value: 'tulu' },
                { label: 'Kokborok', value: 'kokborok' },
                { label: 'Mizo', value: 'mizo' },
                { label: 'Manipuri', value: 'manipuri' },
                { label: 'Nagamese', value: 'nagamese' },
                { label: 'Sikkimese', value: 'sikkimese' },
                { label: 'Ladakhi', value: 'ladakhi' },
                { label: 'Garo', value: 'garo' },
                { label: 'Khasi', value: 'khasi' },
                { label: 'Bhili', value: 'bhili' },
                { label: 'Gondi', value: 'gondi' },
                { label: 'Kurukh', value: 'kurukh' },
                { label: 'Kui', value: 'kui' },
                { label: 'Mundari', value: 'mundari' },
                { label: 'Ho', value: 'ho' },
                { label: 'Koya', value: 'koya' },
                { label: 'Korku', value: 'korku' },
                { label: 'Toda', value: 'toda' },
                { label: 'Kota', value: 'kota' },
                { label: 'Kodava', value: 'kodava' },
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
      </View>
    </KeyboardSafeSection>
  );
};

export default NameQuestion;
