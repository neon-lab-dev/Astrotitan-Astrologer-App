import AddIcon from "@/assets/icons/actions/add.svg";
import CancelIcon from "@/assets/icons/actions/cancel.svg";
import React, {
    useMemo,
    useState,
} from "react";

import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


import {
    useForm
} from "react-hook-form";
import { pickMultipleImages } from "../../../../utils/upload/pickMultipleImages";
import { useRaiseQueryMutation } from "../../../../redux/features/quary/quaryApi";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import FormInput from "../../../../components/reusable/InputField/FormInput";
import { SansText } from "../../../../components/reusable/Text/SansText";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";

type FormValues = {
    subject: string;

    issueType: string;

    description: string;
};

// const ISSUE_TYPES = [
//     "Payment Issue",

//     "Consultation Issue",

//     "App Bug",

//     "Order Related",

//     "Account Related",

//     "Other",
// ];

const RaiseQuery = () => {
    type NavigationProp =
        NativeStackNavigationProp<RootStackParamList>;
    
      const navigation = useNavigation<NavigationProp>();
    const {
        control,
        handleSubmit,
        watch,
        // setValue,
    } = useForm<FormValues>({
        defaultValues: {
            subject: "",

            issueType: "",

            description: "",
        },

        mode: "onChange",
    });

    const subject = watch("subject");

    const issueType =
        watch("issueType");

    const description =
        watch("description");


    const isFormValid =
        useMemo(() => {
            return (
                subject?.trim()?.length >=
                5 &&
                issueType?.trim()?.length >
                0 &&
                description?.trim()
                    ?.length >= 15
            );
        }, [
            subject,
            issueType,
            description,
        ]);

    /* ---------------- IMAGE PICK ---------------- */

    const handlePickImages =
        async () => {
            const selectedImages =
                await pickMultipleImages();

            if (
                selectedImages.length > 0
            ) {
                setImages((prev) => [
                    ...prev,
                    ...selectedImages,
                ]);
            }
        };

    /* ---------------- REMOVE IMAGE ---------------- */

    const removeImage = (
        index: number
    ) => {
        setImages((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    };
    const [raiseQuery, { isLoading }] =
        useRaiseQueryMutation();
    const [images, setImages] =
        useState<any[]>([]);

    const onSubmit = async (
        data: FormValues
    ) => {
        try {
            const payload = {
                subject: data.subject,

                issueType:
                    data.issueType,

                description:
                    data.description,

                attachments:
                    images || [],
            };


            const response =
                await raiseQuery(
                    payload
                ).unwrap();


            navigation.replace("RaiseQuerySuccess",{slug:response.data.ticketId})
        } catch (error: any) {
            console.log(
                "RAISE QUERY ERROR:",
                error
            );
        }
    };

    return (
        <AnimatedScreen>
            <ScreenWrapper>
                <View style={styles.container}>
                    <KeyboardAwareScrollView
                        enableOnAndroid
                        extraScrollHeight={40}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={
                            false
                        }
                        contentContainerStyle={
                            styles.scrollContent
                        }
                    >
                        {/* HEADER */}

                        <AppHeader>
                            <AuthTitle title="Raise a query" />
                        </AppHeader>

                        {/* FORM */}

                        <View
                            style={
                                styles.formContainer
                            }
                        >
                            {/* SUBJECT */}

                            <FormInput
                                control={control}
                                name="subject"
                                label="Subject"
                                placeholder="Enter your issue...."
                                rules={{
                                    required:
                                        "Subject is required",

                                    minLength: {
                                        value: 5,

                                        message:
                                            "Minimum 5 characters required",
                                    },
                                }}
                            />

                            {/* ISSUE TYPE */}

                            <FormInput
                                control={control}
                                name="issueType"
                                variant="dropdown"
                                label="Select issue type"
                                placeholder="Select anyone option"
                                dropdownData={[
                                    {
                                        label: "Payment Issue",
                                        value: "payment",
                                    },
                                    {
                                        label: "Feedback Issue",
                                        value: "feedback",
                                    },
                                    {
                                        label: "Delivery Issue",
                                        value: "delivery",
                                    },
                                    {
                                        label: "Cancellation Issue",
                                        value: "cancellation",
                                    },
                                    {
                                        label: "Refund Issue",
                                        value: "refund",
                                    },
                                    {
                                        label: "Report Issue",
                                        value: "report",
                                    },
                                    {
                                        label: "Technical Issue",
                                        value: "technical",
                                    },
                                    {
                                        label: "Astrology Issue",
                                        value: "astrology",
                                    },
                                    {
                                        label: "Product Issue",
                                        value: "product",
                                    },
                                    {
                                        label: "Puja Issue",
                                        value: "puja",
                                    },
                                    {
                                        label: "Consultation Issue",
                                        value: "consultation",
                                    },

                                    {
                                        label: "Account Related",
                                        value: "account",
                                    },

                                    {
                                        label: "Other",
                                        value: "other",
                                    },
                                ]}
                                rules={{
                                    required: "Please select issue type",
                                }}
                            />

                            {/* DESCRIPTION */}

                            <FormInput
                                control={control}
                                name="description"
                                label="Describe your issue in detail"
                                placeholder="Explain what happened in detail...."
                                multiline={true}
                                numberOfLines={4}
                                rules={{
                                    required:
                                        "Description is required",

                                    minLength: {
                                        value: 15,

                                        message:
                                            "Minimum 15 characters required",
                                    },
                                }}
                            />

                            {/* ATTACHMENT */}

                            <View>
                                <SansText
                                    style={
                                        styles.label
                                    }
                                >
                                    Attachment
                                    (Optional)
                                </SansText>

                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={
                                        false
                                    }
                                    contentContainerStyle={{
                                        gap: 12,
                                    }}
                                >
                                    {/* ADD */}

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={
                                            handlePickImages
                                        }
                                        style={
                                            styles.uploadBox
                                        }
                                    >
                                        <AddIcon
                                            width={24}
                                            height={24}
                                        />
                                    </TouchableOpacity>

                                    {/* IMAGES */}

                                    {images.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <View
                                                key={index}
                                                style={
                                                    styles.imageWrapper
                                                }
                                            >
                                                <Image
                                                    source={{
                                                        uri: item.uri,
                                                    }}
                                                    style={
                                                        styles.previewImage
                                                    }
                                                />

                                                <TouchableOpacity
                                                    activeOpacity={
                                                        0.8
                                                    }
                                                    onPress={() =>
                                                        removeImage(
                                                            index
                                                        )
                                                    }
                                                    style={
                                                        styles.removeBtn
                                                    }
                                                >
                                                    <CancelIcon
                                                        width={
                                                            18
                                                        }
                                                        height={
                                                            18
                                                        }
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    )}
                                </ScrollView>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>

                    {/* BUTTON */}

                    {isFormValid && (
                        <View
                            style={
                                styles.bottomContainer
                            }
                        >
                            <ReusableButton
                                title="Submit Query"
                                width="100%"
                                loading={isLoading}
                                onPress={handleSubmit(
                                    onSubmit
                                )}
                                disabled={isLoading}
                            />
                        </View>
                    )}
                </View>
            </ScreenWrapper>
        </AnimatedScreen>
    );
};

export default RaiseQuery;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 120,
    },

    formContainer: {
        paddingHorizontal: 16,

        marginTop: 14,

        gap: 22,
    },

    label: {
        fontSize: 15,

        marginBottom: 10,

        color: "#0D0D0D",

        fontFamily: "Satoshi-Bold",
    },

    issueChip: {
        paddingHorizontal: 16,

        paddingVertical: 12,

        borderRadius: 100,

        borderWidth: 1,

        borderColor: "#D4AF37",

        backgroundColor: "#FBF7EB",
    },

    selectedChip: {
        backgroundColor: "#D4AF37",
    },

    issueText: {
        fontSize: 14,

        color: "#4A4A4A",
    },

    selectedText: {
        color: "#0D0D0D",

        fontFamily: "GeneralSans-Medium",
    },

    uploadBox: {
        width: 82,

        height: 82,

        borderRadius: 14,

        borderWidth: 1,

        borderColor: "#D4AF37",

        backgroundColor: "#FBF7EB",

        justifyContent: "center",

        alignItems: "center",
    },

    imageWrapper: {
        position: "relative",
    },

    previewImage: {
        width: 82,
        height: 82,
        borderRadius: 14,
    },

    removeBtn: {
        position: "absolute",

        top: -6,

        right: -6,

        width: 24,

        height: 24,

        borderRadius: 100,

        backgroundColor: "#fff",

        justifyContent: "center",

        alignItems: "center",
    },

    bottomContainer: {
        position: "absolute",

        bottom: 0,

        left: 0,

        right: 0,

        paddingHorizontal: 16,

        paddingTop: 16,

        paddingBottom: 24,

        backgroundColor: "#F7F1DF",
    },

    errorText: {
        marginTop: 6,

        fontSize: 12,

        color: "#C2371E",
    },
});