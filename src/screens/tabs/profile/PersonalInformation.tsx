/* eslint-disable react-native/no-inline-styles */

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useDispatch,
} from 'react-redux';

import {
  launchImageLibrary,
} from 'react-native-image-picker';

import {
  useGetMeQuery,
  useUpdateProfileMutation,
} from '../../../redux/features/auth/authApi';

import {
  updateUser,
} from '../../../redux/features/auth/authSlice';

import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import AppHeader from '../../../components/reusable/AppHeader/AppHeader';
import AuthTitle from '../../../components/auth/AuthTitle';

import {
  SansText,
} from '../../../components/reusable/Text/SansText';

import UserIcon from '@/assets/icons/visual/user-circle.svg';

import BookIcon from '@/assets/icons/visual/intent/book.svg';
import BriefcaseIcon from '@/assets/icons/visual/intent/briefcase.svg';
import HeartIcon from '@/assets/icons/visual/intent/favourite.svg';
import MarriageIcon from '@/assets/icons/visual/intent/marriage.svg';
import TieIcon from '@/assets/icons/visual/intent/tie.svg';
import WellnessIcon from '@/assets/icons/visual/intent/wellness.svg';

import FormInput from '../../../components/reusable/InputField/FormInput';
import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';
import { useForm } from 'react-hook-form';

/* ============================================================
 * TYPES
 * ============================================================ */

type FormValues = {
  displayName: string;
  firstName: string;
  lastName: string;
  gender: string;
  areaOfPractice: string[];
  experience: string;
  about: string;
  phoneNumber: string;
  email: string;
};

/* ============================================================
 * OPTIONS
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
 * NAME VALIDATION
 * ============================================================ */

const validateName = (
  value: string,
) => {
  const trimmed = value?.trim();

  if (!trimmed) {
    return 'This field is required';
  }

  if (trimmed.length < 2) {
    return 'Must contain at least 2 characters';
  }

  if (trimmed.length > 50) {
    return 'Must contain less than 50 characters';
  }

  if (!/^[A-Za-z\s.'-]+$/.test(trimmed)) {
    return 'Only letters, spaces, dots and hyphens are allowed';
  }

  return true;
};

/* ============================================================
 * COMPONENT
 * ============================================================ */

const PersonalInformation = () => {
  const dispatch = useDispatch();

  /* ==========================================================
   * API
   * ========================================================== */

  const {
    data: userData,
    refetch,
  } = useGetMeQuery({});

  const [
    updateProfile,
    {
      isLoading: updateLoading,
    },
  ] = useUpdateProfileMutation();

  const profile =
    userData?.data?.profile;

  const account =
    userData?.data?.account;

  /* ==========================================================
   * FORM
   * ========================================================== */

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      displayName: '',
      firstName: '',
      lastName: '',
      gender: '',
      areaOfPractice: [],
      experience: '',
      about: '',
      phoneNumber: '',
      email: '',
    },
    mode: 'onBlur',
  });

  /* ==========================================================
   * STATES
   * ========================================================== */

  const [
    profileImage,
    setProfileImage,
  ] = useState<any>(null);

  /* ==========================================================
   * LOAD USER DATA
   * ========================================================== */

  useEffect(() => {
    if (!profile && !account) {
      return;
    }

    /* --------------------------------------------------------
     * DISPLAY NAME
     * -------------------------------------------------------- */

    setValue(
      'displayName',
      profile?.displayName || '',
    );

    /* --------------------------------------------------------
     * FIRST NAME
     * -------------------------------------------------------- */

    setValue(
      'firstName',
      profile?.firstName || '',
    );

    /* --------------------------------------------------------
     * LAST NAME
     * -------------------------------------------------------- */

    setValue(
      'lastName',
      profile?.lastName || '',
    );

    /* --------------------------------------------------------
     * GENDER
     * -------------------------------------------------------- */

    setValue(
      'gender',
      profile?.gender || '',
    );

    /* --------------------------------------------------------
     * AREA OF PRACTICE
     * -------------------------------------------------------- */

    let areaOfPractice: string[] = [];

    if (
      Array.isArray(
        profile?.areaOfPractice,
      )
    ) {
      areaOfPractice =
        profile.areaOfPractice.flatMap(
          (item: any) => {
            /*
             * Handle normal array:
             *
             * ["Marriage", "Education"]
             *
             * AND also handle old backend format:
             *
             * ['["Marriage","Education"]']
             */

            if (Array.isArray(item)) {
              return item;
            }

            if (typeof item !== 'string') {
              return [];
            }

            try {
              const parsed =
                JSON.parse(item);

              if (Array.isArray(parsed)) {
                return parsed;
              }

              return item
                ? [item]
                : [];
            } catch {
              return item
                ? [item]
                : [];
            }
          },
        );
    }

    setValue(
      'areaOfPractice',
      areaOfPractice,
    );

    /* --------------------------------------------------------
     * EXPERIENCE
     * -------------------------------------------------------- */

    setValue(
      'experience',
      profile?.experience || '',
    );

    /* --------------------------------------------------------
     * ABOUT
     * -------------------------------------------------------- */

    setValue(
      'about',
      profile?.bio || '',
    );

    /* --------------------------------------------------------
     * PHONE
     * -------------------------------------------------------- */

    setValue(
      'phoneNumber',
      account?.phoneNumber || '',
    );

    /* --------------------------------------------------------
     * EMAIL
     * -------------------------------------------------------- */

    setValue(
      'email',
      account?.email || '',
    );
  }, [
    profile,
    account,
    setValue,
  ]);

  /* ==========================================================
   * IMAGE PICKER
   * ========================================================== */

  const pickImage = async () => {
    try {
      const result =
        await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.7,
          selectionLimit: 1,
        });

      if (
        result.assets &&
        result.assets.length > 0
      ) {
        const selectedImage =
          result.assets[0];

        setProfileImage(
          selectedImage,
        );
      }
    } catch (error) {
      console.log(
        'IMAGE PICK ERROR:',
        error,
      );
    }
  };

  /* ==========================================================
   * SUBMIT
   * ========================================================== */

  const onSubmit = async (
    data: FormValues,
  ) => {
    try {
      console.log(
        '========== PROFILE UPDATE DATA =========='
      );

      console.log(
        JSON.stringify(
          data,
          null,
          2,
        ),
      );

      /* ======================================================
       * PAYLOAD
       *
       * IMPORTANT:
       * Do NOT send guidance: data.gender
       * ====================================================== */

      const payload = {
        file: profileImage,

        displayName:
          data.displayName.trim(),

        firstName:
          data.firstName.trim(),

        lastName:
          data.lastName.trim(),

        gender:
          data.gender,

        areaOfPractice:
          data.areaOfPractice,

        experience:
          data.experience,

        bio:
          data.about.trim(),

        phoneNumber:
          data.phoneNumber.trim(),
      };

      console.log(
        '========== UPDATE PAYLOAD =========='
      );

      console.log(
        JSON.stringify(
          payload,
          null,
          2,
        ),
      );

      /* ======================================================
       * UPDATE PROFILE
       * ====================================================== */

      await updateProfile(
        payload,
      ).unwrap();

      console.log(
        'PROFILE UPDATED SUCCESSFULLY'
      );

      /* ======================================================
       * GET LATEST PROFILE
       * ====================================================== */

      const meRes =
        await refetch();

      const latestUser =
        meRes?.data?.data;

      if (latestUser) {
        dispatch(
          updateUser(
            latestUser,
          ),
        );
      }

    } catch (error: any) {
      console.log(
        '========== UPDATE PROFILE ERROR =========='
      );

      console.log(
        error,
      );

      console.log(
        'ERROR DATA:',
        error?.data,
      );

      console.log(
        'ERROR MESSAGE:',
        error?.data?.message ||
          error?.message ||
          'Unable to update profile',
      );
    }
  };

  /* ==========================================================
   * UI
   * ========================================================== */

  return (
    <AnimatedScreen>
      <ScreenWrapper>

        <AppHeader>
          <AuthTitle
            title="Personal information"
          >
            <SansText
              style={{
                lineHeight: 22,
              }}
            >
              Keep your profile
              information
              accurate and
              up to date.
            </SansText>
          </AuthTitle>
        </AppHeader>

        <View
          style={{
            flex: 1,
          }}
        >

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 24,
              paddingBottom: 140,
              gap: 20,
            }}
            showsVerticalScrollIndicator={
              false
            }
          >

            {/* =================================================
             * PROFILE IMAGE
             * ================================================= */}

            <View
              style={{
                alignItems: 'center',
                gap: 14,
              }}
            >

              <TouchableOpacity
                onPress={pickImage}
                activeOpacity={0.8}
                style={
                  styles.imageWrapper
                }
              >

                <Image
                  source={
                    profileImage?.uri
                      ? {
                          uri:
                            profileImage.uri,
                        }
                      : profile?.profilePicture
                        ? {
                            uri:
                              profile.profilePicture,
                          }
                        : require(
                            '@/assets/images/dummy/experts/expert1.png',
                          )
                  }
                  style={styles.image}
                />

                <View
                  style={
                    styles.cameraButton
                  }
                >
                  <UserIcon
                    width={18}
                    height={18}
                  />
                </View>

              </TouchableOpacity>

              <TouchableOpacity
                onPress={pickImage}
              >
                <SansText
                  style={{
                    fontSize: 13,
                    textDecorationLine:
                      'underline',
                  }}
                >
                  Upload photo
                </SansText>
              </TouchableOpacity>

            </View>

            {/* =================================================
             * EMAIL
             * READ ONLY
             * ================================================= */}

            <FormInput
              control={control}
              name="email"
              label="Email Address"
              placeholder="Enter email"
              editable={false}
            />

            {/* =================================================
             * DISPLAY NAME
             * REQUIRED
             * ================================================= */}

            <FormInput
              control={control}
              name="displayName"
              label="Display Name"
              placeholder="Enter display name"
              rules={{
                required:
                  'Display name is required',
                minLength: {
                  value: 2,
                  message:
                    'Display name must contain at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message:
                    'Display name must contain less than 50 characters',
                },
              }}
            />

            {/* =================================================
             * FIRST NAME
             * REQUIRED
             * ================================================= */}

            <FormInput
              control={control}
              name="firstName"
              label="First Name"
              placeholder="Enter first name"
              rules={{
                validate:
                  validateName,
              }}
            />

            {/* =================================================
             * LAST NAME
             * REQUIRED
             * ================================================= */}

            <FormInput
              control={control}
              name="lastName"
              label="Last Name"
              placeholder="Enter last name"
              rules={{
                validate:
                  validateName,
              }}
            />

            {/* =================================================
             * GENDER
             * REQUIRED
             * ================================================= */}

            <FormInput
              control={control}
              name="gender"
              variant="dropdown"
              label="Gender"
              placeholder="Select your gender"
              rules={{
                required:
                  'Please select your gender',
              }}
              dropdownData={
                GENDER_OPTIONS
              }
            />

            {/* =================================================
             * AREA OF PRACTICE
             * REQUIRED
             * ================================================= */}

            <FormInput
              control={control}
              name="areaOfPractice"
              variant="dropdown"
              multiple
              label="Area Of Practice"
              placeholder="Select area of practice"
              rules={{
                validate: (
                  value: string[],
                ) => {
                  if (
                    !Array.isArray(
                      value,
                    ) ||
                    value.length === 0
                  ) {
                    return 'Please select at least one area of practice';
                  }

                  return true;
                },
              }}
              dropdownData={
                AREA_OF_PRACTICE_OPTIONS
              }
            />

            {/* =================================================
             * EXPERIENCE
             * REQUIRED
             * ================================================= */}

            <FormInput
              control={control}
              name="experience"
              variant="dropdown"
              label="Experience"
              placeholder="Select your experience"
              rules={{
                required:
                  'Please select your experience',
              }}
              dropdownData={
                EXPERIENCE_OPTIONS
              }
            />

            {/* =================================================
             * ABOUT
             * REQUIRED
             * ================================================= */}

            <FormInput
              control={control}
              name="about"
              variant="multiline"
              label="About You"
              placeholder="Tell users about your experience and how you guide them..."
              multiline
              numberOfLines={6}
              rules={{
                required:
                  'About you is required',
                minLength: {
                  value: 20,
                  message:
                    'Please enter at least 20 characters',
                },
                maxLength: {
                  value: 1000,
                  message:
                    'About you cannot exceed 1000 characters',
                },
              }}
            />

            {/* =================================================
             * PHONE
             * REQUIRED
             * ================================================= */}

            <FormInput
              control={control}
              name="phoneNumber"
              label="Phone Number"
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              rules={{
                required:
                  'Phone number is required',
                validate: (
                  value: string,
                ) => {
                  const cleaned =
                    value?.replace(
                      /\D/g,
                      '',
                    );

                  if (!cleaned) {
                    return 'Phone number is required';
                  }

                  if (
                    cleaned.length < 10
                  ) {
                    return 'Enter a valid phone number';
                  }

                  return true;
                },
              }}
            />

          </ScrollView>

          {/* ===================================================
           * SAVE BUTTON
           * =================================================== */}

          <View
            style={
              styles.bottomContainer
            }
          >

            <ReusableButton
              title="Save changes"
              onPress={handleSubmit(
                onSubmit,
              )}
              width="100%"
              loading={
                updateLoading
              }
              disabled={
                updateLoading
              }
            />

          </View>

        </View>

      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default PersonalInformation;

/* ============================================================
 * STYLES
 * ============================================================ */

const styles =
  StyleSheet.create({

    imageWrapper: {
      width: 120,
      height: 120,
      borderRadius: 999,
      overflow: 'hidden',
      backgroundColor: '#E9E9E9',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },

    image: {
      width: '100%',
      height: '100%',
    },

    cameraButton: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: '#FBF7EB',
      padding: 8,
      borderRadius: 999,
    },

    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
      backgroundColor: '#FBF7EB',
    },

  });