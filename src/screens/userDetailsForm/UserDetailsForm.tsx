import BookIcon from '@/assets/icons/visual/intent/book.svg';
import BriefcaseIcon from '@/assets/icons/visual/intent/briefcase.svg';
import HeartIcon from '@/assets/icons/visual/intent/favourite.svg';
import MarriageIcon from '@/assets/icons/visual/intent/marriage.svg';
import TieIcon from '@/assets/icons/visual/intent/tie.svg';
import WellnessIcon from '@/assets/icons/visual/intent/wellness.svg';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import NameQuestion from '../../components/userDetailsForm/NameQuestion';
import SelectableOptions from '../../components/reusable/SelectableOptions/SelectableOptions';
import { useCompleteProfileMutation } from '../../redux/features/auth/authApi';
import QuestionScreen from '../../components/userDetailsForm/QuestionScreen';
import { RootState } from '../../redux/store';
import { Storage } from '../../services/storage/storage';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import AnimatedScreen from '../../components/layout/AnimatedScreen';
import AppInput from '../../components/reusable/InputField/AppInput';
import ProfilePhotoQuestion from '../../components/userDetailsForm/ProfilePhotoQuestion';

const questions = [
  {
    key: "name",

    initialValue: {
      firstName: "",
      lastName: "",
      displayName: "",
      languages: [],
    },

    validate: (value: any) => {
      const isValidName = (name: string) => {
        const trimmed = name?.trim();

        return /^[A-Za-z\s.'-]{2,50}$/.test(trimmed);
      };

      return (
        isValidName(value.firstName) &&
        isValidName(value.lastName) &&
        isValidName(value.displayName) &&
        Array.isArray(value.languages) &&
        value.languages.length > 0
      );
    },

    text: "What should we call you?",

    description: "This helps personalize your experience.",

    render: ({ value, setValue }: any) => (
      <NameQuestion value={value} setValue={setValue} />
    ),
  },

  {
    key: "profilePhoto",

    initialValue: null,

    text: "Add your profile photo",

    description:
      "Clear profile photos increase user trust and consultation requests.",

    render: ({ value, setValue }: any) => (
      <ProfilePhotoQuestion value={value} setValue={setValue} />
    ),

    validate: () => true,
  },

  {
    key: "guidance",

    initialValue: [],

    text: "What would you like guidance on?",

    description: "Select your primary focus areas.",

    render: ({ value, setValue }: any) => (
      <View style={{ marginTop: 24 }}>
        <SelectableOptions
          options={[
            {
              label: "Wealth & Finance",

              value: "Wealth & Finance",

              icon: TieIcon,
            },

            {
              label: "Education",

              value: "Education",

              icon: BookIcon,
            },

            {
              label: "Marriage",

              value: "Marriage",

              icon: MarriageIcon,
            },

            {
              label: "Health & Wellness",

              value: "Health & Wellness",

              icon: WellnessIcon,
            },

            {
              label: "Career Growth",

              value: "Career Growth",

              icon: BriefcaseIcon,
            },

            {
              label: "Love & Relationship",

              value: "Love & Relationship",

              icon: HeartIcon,
            },
          ]}
          value={value}
          onChange={setValue}
          multiple
        />
      </View>
    ),

    validate: (value: string[]) => Array.isArray(value) && value.length > 0,
  },

  {
    key: "experience",

    initialValue: "",

    text: "Your experience in practice",

    description: "This helps users understand your background.",

    render: ({ value, setValue }: any) => (
      <View style={{ marginTop: 24 }}>
        <SelectableOptions
          options={[
            {
              label: "Less than 2 years",
              value: "1",
            },
            {
              label: "2 years",
              value: "2",
            },
            {
              label: "3 years",
              value: "3",
            },
            {
              label: "4 years",
              value: "4",
            },
            {
              label: "5 years",
              value: "5",
            },
            {
              label: "6–10 years",
              value: "5+",
            },
            {
              label: "10-15 years",
              value: "10+",
            },
            {
              label: "15-20 years",
              value: "15+",
            },
            {
              label: "More than 20 years",
              value: "20+",
            },
          ]}
          value={value}
          onChange={setValue}
        />
      </View>
    ),

    validate: (value: string) => !!value,
  },

  {
    key: "gender",

    initialValue: "",

    text: "Select your gender",

    description: "This helps us generate more accurate insights.",

    render: ({ value, setValue }: any) => (
      <View style={{ marginTop: 24 }}>
        <SelectableOptions
          options={[
            {
              label: "Male",
              value: "male",
            },
            {
              label: "Female",
              value: "female",
            },
            {
              label: "Non-binary",
              value: "non_binary",
            },
          ]}
          value={value}
          onChange={setValue}
        />
      </View>
    ),

    validate: (value: string) => !!value,
  },

  {
    key: "about",

    initialValue: "",

    text: "About You",

    description:
      "Help users understand your experience and how you guide them.",

    render: ({ value, setValue }: any) => (
      <View style={{ marginTop: 24 }}>
        <AppInput
          variant="multiline"
          value={value}
          onChangeText={setValue}
          placeholder="eg: “I specialize in Vedic astrology with over 8 years of experience in career and relationship guidance. My approach focuses on practical remedies and clear insights.”"
          numberOfLines={10}
          multiline
        />
      </View>
    ),

    validate: (value: string) => value?.trim().length >= 20,
  },
];

const MultiStepForm = () => {
    const navigation = useNavigation<any>()
    const step = useSelector((state: RootState) => state.userDetailForm.step);
    const [completeProfile] = useCompleteProfileMutation();
   

    const handleFinalSubmit = async (formData: any) => {
        try {
            const payload = {
        displayName: formData.name.displayName,

        firstName: formData.name.firstName,
        lastName: formData.name.lastName,
        languages: formData.name.languages,

        profilePhoto: formData.profilePhoto,

        guidance: formData.guidance,

        experience: formData.experience,

        gender: formData.gender,

        about: formData.about,
      };

            await completeProfile(payload).unwrap();
            await Storage.getProfileCompleted();
            navigation.replace("ProfileCompleted")

        } catch (err) {
            console.log("PROFILE ERROR:", err);
        }
    };

    const currentQuestion = questions[step];

    if (!currentQuestion) return null;

    return (
        <AnimatedScreen>
            <ScreenWrapper>
                <QuestionScreen
                    key={currentQuestion.key}
                    questionKey={currentQuestion.key}
                    questionDescription={currentQuestion.description}
                    questionText={currentQuestion.text}
                    validate={currentQuestion.validate}
                    initialValue={currentQuestion.initialValue}
                    onFinalSubmit={handleFinalSubmit} // 🔥 PASS THIS
                >
                    {currentQuestion.render}
                </QuestionScreen>
            </ScreenWrapper>
        </AnimatedScreen>
    );
};

export default MultiStepForm;