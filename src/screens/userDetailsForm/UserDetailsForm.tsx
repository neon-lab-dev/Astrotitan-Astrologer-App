import BookIcon from '@/assets/icons/visual/intent/book.svg';
import BriefcaseIcon from '@/assets/icons/visual/intent/briefcase.svg';
import HeartIcon from '@/assets/icons/visual/intent/favourite.svg';
import MarriageIcon from '@/assets/icons/visual/intent/marriage.svg';
import TieIcon from '@/assets/icons/visual/intent/tie.svg';
import WellnessIcon from '@/assets/icons/visual/intent/wellness.svg';

import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import NameQuestion from '../../components/userDetailsForm/NameQuestion';
import ProfilePhotoQuestion from '../../components/userDetailsForm/ProfilePhotoQuestion';
import QuestionScreen from '../../components/userDetailsForm/QuestionScreen';

import SelectableOptions from '../../components/reusable/SelectableOptions/SelectableOptions';
import AppInput from '../../components/reusable/InputField/AppInput';

import {
  useCompleteProfileMutation,
} from '../../redux/features/auth/authApi';

import { RootState } from '../../redux/store';
import { Storage } from '../../services/storage/storage';

import ScreenWrapper from '../../components/layout/ScreenWrapper';
import AnimatedScreen from '../../components/layout/AnimatedScreen';

/* ============================================================
 * TYPES
 * ============================================================ */

type NameFormValue = {
  firstName: string;
  lastName: string;
  displayName: string;
  languages: string[];
};

type ProfileFormData = {
  name: NameFormValue;
  profilePhoto: any;
  areaOfPractice: string[];
  experience: string;
  gender: string;
  about: string;
};

/* ============================================================
 * AREA OF PRACTICE OPTIONS
 * ============================================================ */

const AREA_OF_PRACTICE_OPTIONS = [
  {
    label: 'Wealth & Finance',
    value: 'Wealth & Finance',
    icon: TieIcon,
  },
  {
    label: 'Education',
    value: 'Education',
    icon: BookIcon,
  },
  {
    label: 'Marriage',
    value: 'Marriage',
    icon: MarriageIcon,
  },
  {
    label: 'Health & Wellness',
    value: 'Health & Wellness',
    icon: WellnessIcon,
  },
  {
    label: 'Career Growth',
    value: 'Career Growth',
    icon: BriefcaseIcon,
  },
  {
    label: 'Love & Relationship',
    value: 'Love & Relationship',
    icon: HeartIcon,
  },
];

/* ============================================================
 * EXPERIENCE OPTIONS
 * ============================================================ */

const EXPERIENCE_OPTIONS = [
  {
    label: 'Less than 2 years',
    value: '1',
  },
  {
    label: '2 years',
    value: '2',
  },
  {
    label: '3 years',
    value: '3',
  },
  {
    label: '4 years',
    value: '4',
  },
  {
    label: '5 years',
    value: '5',
  },
  {
    label: '6–10 years',
    value: '6',
  },
  {
    label: '10-15 years',
    value: '11',
  },
  {
    label: '15-20 years',
    value: '16',
  },
  {
    label: 'More than 20 years',
    value: '21',
  },
];

/* ============================================================
 * GENDER OPTIONS
 * ============================================================ */

const GENDER_OPTIONS = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
  {
    label: 'Non-binary',
    value: 'non_binary',
  },
];

/* ============================================================
 * QUESTIONS
 * ============================================================ */

const questions = [
  {
    key: 'name',

    initialValue: {
      firstName: '',
      lastName: '',
      displayName: '',
      languages: [],
    },

    validate: (value: NameFormValue) => {
      const isValidName = (name: string) => {
        const trimmed = name?.trim();

        return /^[A-Za-z\s.'-]{2,50}$/.test(trimmed);
      };

      return (
        isValidName(value?.firstName) &&
        isValidName(value?.lastName) &&
        isValidName(value?.displayName) &&
        Array.isArray(value?.languages) &&
        value.languages.length > 0
      );
    },

    text: 'What should we call you?',

    description: 'This helps personalize your experience.',

    render: ({ value, setValue }: any) => (
      <NameQuestion
        value={value}
        setValue={setValue}
      />
    ),
  },

  /* ==========================================================
   * PROFILE PHOTO
   * ========================================================== */

  {
    key: 'profilePhoto',

    initialValue: null,

    text: 'Add your profile photo',

    description:
      'Clear profile photos increase user trust and consultation requests.',

    render: ({ value, setValue }: any) => (
      <ProfilePhotoQuestion
        value={value}
        setValue={setValue}
      />
    ),

    // Photo is optional.
    validate: () => true,
  },

  /* ==========================================================
   * AREA OF PRACTICE
   * ========================================================== */

  {
    key: 'areaOfPractice',

    initialValue: [],

    text: 'What would you like guidance on?',

    description: 'Select your primary focus areas.',

    render: ({ value, setValue }: any) => (
      <View style={{ marginTop: 24 }}>
        <SelectableOptions
          options={AREA_OF_PRACTICE_OPTIONS}
          value={value}
          onChange={setValue}
          multiple
        />
      </View>
    ),

    validate: (value: string[]) => {
      return (
        Array.isArray(value) &&
        value.length > 0
      );
    },
  },

  /* ==========================================================
   * EXPERIENCE
   * ========================================================== */

  {
    key: 'experience',

    initialValue: '',

    text: 'Your experience in practice',

    description:
      'This helps users understand your background.',

    render: ({ value, setValue }: any) => (
      <View style={{ marginTop: 24 }}>
        <SelectableOptions
          options={EXPERIENCE_OPTIONS}
          value={value}
          onChange={setValue}
        />
      </View>
    ),

    validate: (value: string) => {
      return !!value;
    },
  },

  /* ==========================================================
   * GENDER
   * ========================================================== */

  {
    key: 'gender',

    initialValue: '',

    text: 'Select your gender',

    description:
      'This helps us generate more accurate insights.',

    render: ({ value, setValue }: any) => (
      <View style={{ marginTop: 24 }}>
        <SelectableOptions
          options={GENDER_OPTIONS}
          value={value}
          onChange={setValue}
        />
      </View>
    ),

    validate: (value: string) => {
      return !!value;
    },
  },

  /* ==========================================================
   * ABOUT
   * ========================================================== */

  {
    key: 'about',

    initialValue: '',

    text: 'About You',

    description:
      'Help users understand your experience and how you guide them.',

    render: ({ value, setValue }: any) => (
      <View style={{ marginTop: 24 }}>
        <AppInput
          variant="multiline"
          value={value}
          onChangeText={setValue}
          placeholder='eg: “I specialize in Vedic astrology with over 8 years of experience in career and relationship guidance. My approach focuses on practical remedies and clear insights.”'
          numberOfLines={10}
          multiline
        />
      </View>
    ),

    validate: (value: string) => {
      return (
        typeof value === 'string' &&
        value.trim().length >= 20
      );
    },
  },
];

/* ============================================================
 * MULTI STEP FORM
 * ============================================================ */

const MultiStepForm = () => {
  const navigation = useNavigation<any>();

  const step = useSelector(
    (state: RootState) =>
      state.userDetailForm.step,
  );
  

  const [
    completeProfile,
    {
      isLoading,
    },
  ] = useCompleteProfileMutation();

  /* ==========================================================
   * FINAL SUBMIT
   * ========================================================== */

  const handleFinalSubmit = async (
    formData: ProfileFormData,
  ) => {
    try {
      console.log(
        '========== PROFILE FORM DATA =========='
      );

      console.log(
        JSON.stringify(
          formData,
          null,
          2,
        ),
      );

      const payload = {
        /* ----------------------------------------------------
         * NAME
         * ---------------------------------------------------- */

        displayName:
          formData?.name?.displayName?.trim() || '',

        firstName:
          formData?.name?.firstName?.trim() || '',

        lastName:
          formData?.name?.lastName?.trim() || '',

        /* ----------------------------------------------------
         * LANGUAGES
         *
         * Backend profile response uses:
         * consultLanguages
         * ---------------------------------------------------- */

        consultLanguages:
          Array.isArray(
            formData?.name?.languages,
          )
            ? formData.name.languages
            : [],

        profilePhoto:
          formData?.profilePhoto || null,

        areaOfPractice:
          Array.isArray(
            formData?.areaOfPractice,
          )
            ? formData.areaOfPractice
            : [],

        experience:
          formData?.experience || '',
        gender:
          formData?.gender || '',
        bio:
          formData?.about?.trim() || '',
      };

      console.log(
        '========== COMPLETE PROFILE PAYLOAD =========='
      );

      console.log(
        JSON.stringify(
          payload,
          null,
          2,
        ),
      );

      /* ======================================================
       * API REQUEST
       * ====================================================== */

      const response =
        await completeProfile(
          payload,
        ).unwrap();

      console.log(
        '========== COMPLETE PROFILE RESPONSE =========='
      );

      console.log(
        JSON.stringify(
          response,
          null,
          2,
        ),
      );

      /* ======================================================
       * PROFILE COMPLETION STORAGE
       * ====================================================== */

      await Storage.getProfileCompleted();

      /* ======================================================
       * NAVIGATION
       * ====================================================== */

      navigation.replace(
        'ProfileCompleted',
      );
    } catch (error: any) {
      console.log(
        '========== PROFILE CREATION ERROR =========='
      );

      console.log(
        error,
      );

      console.log(
        'PROFILE ERROR DATA:',
        error?.data,
      );

      console.log(
        'PROFILE ERROR MESSAGE:',
        error?.data?.message ||
          error?.message ||
          'Unable to complete profile',
      );
    }
  };

  /* ==========================================================
   * CURRENT QUESTION
   * ========================================================== */

  const currentQuestion =
    questions[step];

  if (!currentQuestion) {
    return null;
  }

  /* ==========================================================
   * UI
   * ========================================================== */

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <QuestionScreen
          key={currentQuestion.key}
          questionKey={
            currentQuestion.key
          }
          questionDescription={
            currentQuestion.description
          }
          questionText={
            currentQuestion.text
          }
          validate={
            currentQuestion.validate
          }
          initialValue={
            currentQuestion.initialValue
          }
          onFinalSubmit={
            handleFinalSubmit
          }
        >
          {currentQuestion.render}
        </QuestionScreen>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default MultiStepForm;