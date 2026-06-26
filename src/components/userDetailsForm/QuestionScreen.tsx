// components/QuestionScreen.tsx

import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthTitle from '../auth/AuthTitle';
import AppHeader from '../reusable/AppHeader/AppHeader';
import ReusableButton from '../reusable/ReusableButton/ReusableButton';
import { SansText } from '../reusable/Text/SansText';
import StepHeader from './StepHeader';
import { RootState, store } from '../../redux/store';
import { nextStep, prevStep, setAnswer } from '../../redux/features/userDetailsForm/userDetailsDormSlice';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
    questionKey: string;
    questionText: string;
    questionDescription: string;
    validate?: (value: any) => boolean;
    initialValue?: string | object | null;
    onFinalSubmit?: (data: any) => void; // ✅ ADD THIS
    children: (props: {
        value: string;
        setValue: (val: string) => void;
    }) => React.ReactNode;
}

const QuestionScreen: React.FC<Props> = ({ questionKey, questionText, questionDescription, children, validate, initialValue,onFinalSubmit }) => {

    const dispatch = useDispatch();
    const savedValue = useSelector(
        (state: RootState) => state.userDetailForm.answers[questionKey]
    );
    const step = useSelector((state: RootState) => state.userDetailForm.step);
    const totalSteps = 6;

    const [value, setValue] = useState(savedValue ?? initialValue);
    const isValid = validate ? validate(value) : true;
    useEffect(() => {
        if (savedValue !== undefined) {
            setValue(savedValue);
        } else {
            setValue(initialValue);
        }
    }, [savedValue, initialValue]);


  const handleNext = () => {
  dispatch(setAnswer({ key: questionKey, value }));

  if (step === totalSteps - 1) {
    const finalData = {
      ...store.getState().userDetailForm.answers,
      [questionKey]: value,
    };

    onFinalSubmit?.(finalData); // ✅ CLEAN

    return;
  }

  dispatch(nextStep());
};
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (step > 0) {
                    dispatch(setAnswer({ key: questionKey, value }));
                    dispatch(prevStep());
                    return true; // 🔥 prevent default back
                }
                return false; // allow default (exit screen)
            };

            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );

            return () => subscription.remove();
        }, [step, value ,dispatch,questionKey])
    );

    const handleBack = () => {
        dispatch(setAnswer({ key: questionKey, value }));
        dispatch(prevStep());
    };

    return (
        <View style={{ flex: 1 }}>

            {/* HEADER */}
            <AppHeader onPressBack={handleBack} showBack={true}>
                <StepHeader step={step} total={totalSteps} />
                <AuthTitle title={questionText}>
                    <SansText style={{ fontSize: 16 }}>
                        {questionDescription}
                    </SansText>
                </AuthTitle>
            </AppHeader>

            {/* SCROLL AREA */}
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 30,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {children({ value, setValue })}
                </ScrollView>
            </View>

            {/* BUTTON */}
            {isValid && (
                <View
                    style={{
                        padding: 16,
                        backgroundColor: "#FBF7EB",
                        borderTopRightRadius: 12,
                        borderTopLeftRadius: 12,
                    }}
                >
                    <ReusableButton
                        title="Continue"
                        variant="solid"
                        onPress={handleNext}
                    />
                </View>
            )}
        </View>
    );
};

export default QuestionScreen;