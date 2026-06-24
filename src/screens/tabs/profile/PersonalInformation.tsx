

import React, {
  useEffect,
  useState,
} from "react";

import { useForm } from "react-hook-form";

import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useDispatch,
} from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
import BookIcon from "@/assets/icons/visual/intent/book.svg";
import BriefcaseIcon from "@/assets/icons/visual/intent/briefcase.svg";
import HeartIcon from "@/assets/icons/visual/intent/favourite.svg";
import MarriageIcon from "@/assets/icons/visual/intent/marriage.svg";
import TieIcon from "@/assets/icons/visual/intent/tie.svg";
import WellnessIcon from "@/assets/icons/visual/intent/wellness.svg";
import { useGetMeQuery, useUpdateProfileMutation } from "../../../redux/features/auth/authApi";
import { updateUser } from "../../../redux/features/auth/authSlice";
import AnimatedScreen from "../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../components/layout/ScreenWrapper";
import AppHeader from "../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../components/auth/AuthTitle";
import { SansText } from "../../../components/reusable/Text/SansText";
import UserIcon from '@/assets/icons/visual/user-circle.svg';
import FormInput from "../../../components/reusable/InputField/FormInput";
import { isValidDate } from "../../../utils/validators/dateValidators";
import ReusableButton from "../../../components/reusable/ReusableButton/ReusableButton";

type FormValues = {
  firstName: string;
  lastName: string;
  gender: string;
  intents: string[];
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
};

const PersonalInformation =
  () => {
    const dispatch =
      useDispatch();

    /* =======================================================
     * API
     * ======================================================= */

    const {
      data: userData,
      refetch,
    } = useGetMeQuery({});

    const [
      updateProfile,
      {
        isLoading:
        updateLoading,
      },
    ] =
      useUpdateProfileMutation();

    const profile =
      userData?.data
        ?.profile;

    const account =
      userData?.data
        ?.account;

    /* =======================================================
     * FORM
     * ======================================================= */

    const {
      control,
      handleSubmit,
      setValue,
    } =
      useForm<FormValues>({
        defaultValues: {
          firstName: "",

          lastName: "",

          gender: "",

          intents: [],

          phoneNumber:
            "",

          email: "",

          dateOfBirth:
            "",
        },
      });

    /* =======================================================
     * STATES
     * ======================================================= */

    const [
      profileImage,
      setProfileImage,
    ] = useState<any>(
      null
    );

    /* =======================================================
     * SET USER DATA
     * ======================================================= */

    useEffect(() => {
      if (!profile)
        return;

      setValue(
        "firstName",
        profile?.firstName ||
        ""
      );

      setValue(
        "lastName",
        profile?.lastName ||
        ""
      );

      setValue(
        "gender",
        profile?.gender ||
        ""
      );

      let formattedIntents: string[] =
        [];

      if (
        Array.isArray(
          profile?.intents
        )
      ) {
        formattedIntents =
          profile.intents.flatMap(
            (
              item: string
            ) => {
              try {
                const parsed =
                  JSON.parse(
                    item
                  );

                return Array.isArray(
                  parsed
                )
                  ? parsed
                  : [];
              } catch {
                return item
                  ? [item]
                  : [];
              }
            }
          );
      }

      setValue(
        "intents",
        formattedIntents
      );

      setValue(
        "phoneNumber",
        account?.phoneNumber ||
        ""
      );

      setValue(
        "email",
        account?.email ||
        ""
      );

      if (
        profile?.dateOfBirth
      ) {
        const date =
          new Date(
            profile.dateOfBirth
          );

        const formattedDate = `${String(
          date.getDate()
        ).padStart(
          2,
          "0"
        )}/${String(
          date.getMonth() +
          1
        ).padStart(
          2,
          "0"
        )}/${date.getFullYear()}`;

        setValue(
          "dateOfBirth",
          formattedDate
        );
      }
    }, [
      profile,
      account,
      setValue
    ]);

    /* =======================================================
     * IMAGE PICKER
     * ======================================================= */

    const pickImage =
      async () => {
        try {
          const result = await launchImageLibrary({
            mediaType: "photo",
            quality: 0.7,
            selectionLimit: 1,
          });

          console.log(
            "IMAGE RESULT:",
            result
          );

          if (result.assets?.length) {
            setProfileImage(result.assets[0]);
          }
        } catch (error) {
          console.log(
            "IMAGE PICK ERROR:",
            error
          );
        }
      };
    /* =======================================================
     * SUBMIT
     * ======================================================= */

    const onSubmit =
      async (
        data: FormValues
      ) => {
        try {
          console.log(
            "PROFILE IMAGE:",
            profileImage
          );
          console.log(
            "IMAGE URI:",
            profileImage?.uri
          );

          console.log(
            "IMAGE TYPE:",
            profileImage?.mimeType
          );

          console.log(
            "IMAGE NAME:",
            profileImage?.fileName
          );

          const response =
            await updateProfile(
              {
                file:
                  profileImage,

                firstName:
                  data.firstName,

                lastName:
                  data.lastName,

                gender:
                  data.gender,

                intents:
                  data.intents,

                phoneNumber:
                  data.phoneNumber,

                dateOfBirth:
                  data.dateOfBirth,
              }
            ).unwrap();

          console.log(
            "UPDATE RESPONSE:",
            response
          );

          const meRes =
            await refetch();

          const latestUser =
            meRes?.data
              ?.data;

          dispatch(
            updateUser(
              latestUser
            )
          );

          console.log(
            "LATEST USER:",
            latestUser
          );

          console.log(
            "PROFILE UPDATED SUCCESSFULLY"
          );
        } catch (
        error
        ) {
          console.log(
            "UPDATE PROFILE ERROR:",
            error
          );
        }
      };

    /* =======================================================
     * UI
     * ======================================================= */

    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppHeader>
            <AuthTitle title="Personal information">
              <SansText
                style={{
                  lineHeight: 22,
                }}
              >
                Help us tailor
                guidance that
                feels more
                relevant to
                you.
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
              {/* PROFILE IMAGE */}

              <View
                style={{
                  alignItems:
                    "center",

                  gap: 14,
                }}
              >
                <TouchableOpacity
                  onPress={
                    pickImage
                  }
                  activeOpacity={
                    0.8
                  }
                  style={
                    styles.imageWrapper
                  }
                >
                  <Image
                    source={
                      profileImage?.uri
                        ? profileImage.uri
                        : profile?.profilePicture
                          ? profile.profilePicture
                          : require("@/assets/images/dummy/experts/expert1.png")
                    }
                    style={
                      styles.image
                    }
                  />

                  <View
                    style={
                      styles.cameraButton
                    }
                  >
                    <UserIcon
                      width={
                        18
                      }
                      height={
                        18
                      }
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={
                    pickImage
                  }
                >
                  <SansText
                    style={{
                      fontSize: 13,

                      textDecorationLine:
                        "underline",
                    }}
                  >
                    Upload
                    photo
                  </SansText>
                </TouchableOpacity>
              </View>

              {/* EMAIL */}

              <FormInput
                control={
                  control
                }
                name="email"
                label="Email Address"
                placeholder="Enter email"
                editable={
                  false
                }
              />

              {/* FIRST NAME */}

              <FormInput
                control={
                  control
                }
                name="firstName"
                label="First Name"
                placeholder="Enter first name"
              />

              {/* LAST NAME */}

              <FormInput
                control={
                  control
                }
                name="lastName"
                label="Last Name"
                placeholder="Enter last name"
              />

              {/* GENDER */}

              <FormInput
                control={
                  control
                }
                name="gender"
                variant="dropdown"
                label="Gender"
                placeholder="Select your gender"
                dropdownData={[
                  {
                    label:
                      "Male",
                    value:
                      "male",
                  },

                  {
                    label:
                      "Female",
                    value:
                      "female",
                  },

                  {
                    label:
                      "Non-binary",

                    value:
                      "non_binary",
                  },
                ]}
              />

              {/* INTENTS */}

              <FormInput
                control={
                  control
                }
                name="intents"
                variant="dropdown"
                multiple
                label="Intent"
                placeholder="Select intent"
                dropdownData={[
                  {
                    label:
                      "Wealth & Finance",

                    value:
                      "Wealth & Finance",

                    icon:
                      TieIcon,
                  },

                  {
                    label:
                      "Education",

                    value:
                      "Education",

                    icon:
                      BookIcon,
                  },

                  {
                    label:
                      "Marriage",

                    value:
                      "Marriage",

                    icon:
                      MarriageIcon,
                  },

                  {
                    label:
                      "Health & Wellness",

                    value:
                      "Health & Wellness",

                    icon:
                      WellnessIcon,
                  },

                  {
                    label:
                      "Career Growth",

                    value:
                      "Career Growth",

                    icon:
                      BriefcaseIcon,
                  },

                  {
                    label:
                      "Love & Relationship",

                    value:
                      "Love & Relationship",

                    icon:
                      HeartIcon,
                  },
                ]}
              />

              {/* PHONE */}

              <FormInput
                control={
                  control
                }
                name="phoneNumber"
                label="Phone number"
                placeholder="Enter phone number"
                keyboardType="numeric"
              />

              {/* DOB */}

              <FormInput
                control={
                  control
                }
                name="dateOfBirth"
                label="Date of birth"
                placeholder="DD/MM/YYYY"
                rules={{
                  validate:
                    (
                      value: string
                    ) =>
                      isValidDate(
                        value
                      ) ||
                      "Invalid DOB",
                }}
              />
            </ScrollView>

            {/* BUTTON */}

            <View
              style={
                styles.bottomContainer
              }
            >
              <ReusableButton
                title="Save changes"
                onPress={handleSubmit(
                  onSubmit
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

export default
  PersonalInformation;

const styles =
  StyleSheet.create({
    imageWrapper: {
      width: 120,

      height: 120,

      borderRadius: 999,

      overflow:
        "hidden",

      backgroundColor:
        "#E9E9E9",

      justifyContent:
        "center",

      alignItems:
        "center",

      position:
        "relative",
    },

    image: {
      width: "100%",

      height: "100%",
    },

    cameraButton: {
      position:
        "absolute",

      bottom: 8,

      right: 8,

      backgroundColor:
        "#FBF7EB",

      padding: 8,

      borderRadius: 999,
    },

    bottomContainer: {
      position:
        "absolute",

      bottom: 0,

      left: 0,

      right: 0,

      paddingHorizontal: 16,

      paddingTop: 16,

      paddingBottom: 24,

      backgroundColor:
        "#FBF7EB",
    },
  });