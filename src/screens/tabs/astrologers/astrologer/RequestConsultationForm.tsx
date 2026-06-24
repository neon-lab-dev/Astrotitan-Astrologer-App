import BookIcon from '@/assets/icons/visual/intent/book.svg';
import BriefcaseIcon from '@/assets/icons/visual/intent/briefcase.svg';
import HeartIcon from '@/assets/icons/visual/intent/favourite.svg';
import MarriageIcon from '@/assets/icons/visual/intent/marriage.svg';
import TieIcon from '@/assets/icons/visual/intent/tie.svg';
import WellnessIcon from '@/assets/icons/visual/intent/wellness.svg';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import SelectableOptions from '../../../../components/reusable/SelectableOptions/SelectableOptions';
import { RootState } from '../../../../redux/store';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import QuestionScreen from '../../../../components/RequestConsultationForm/QuestionScreen';
import ChatIcon from '@/assets/icons/actions/bubble-chat.svg';
import CallIcon from '@/assets/icons/visual/call.svg';
import { useRoute } from '@react-navigation/native';
const questions = [
    {
        key: 'mode',
        initialValue: '', // ✅
        text: 'Consult astrologer',
        description: "This helps us generate more accurate insights.",
        render: ({ value, setValue }: any) => (
            <View style={{ marginTop: 24 }}>
                <SelectableOptions
                    options={[
                        { label: 'Call', value: 'call', icon: CallIcon },
                        { label: 'Chat', value: 'chat', icon: ChatIcon },
                    ]}
                    value={value}
                    onChange={setValue}
                />
            </View>
        ),
        validate: (value: string) => !!value
    },
    {
        key: 'guidance',
        initialValue: [], // ✅
        text: 'What would you like guidance on?',
        description: "Select your primary focus areas.",
        render: ({ value, setValue }: any) => (
            <View style={{ marginTop: 24 }}>
                <SelectableOptions
                    options={[
                        { label: 'Wealth & Finance', value: 'Wealth & Finance', icon: TieIcon },
                        { label: 'Education', value: 'Education', icon: BookIcon },
                        { label: 'Marriage', value: 'marriage', icon: MarriageIcon },
                        { label: 'Health & Wellness', value: 'Health & Wellness', icon: WellnessIcon },
                        { label: 'Career Growth', value: 'Career Growth', icon: BriefcaseIcon },
                        { label: 'Love & Relationship', value: 'Love & Relationship', icon: HeartIcon },
                    ]}
                    value={value}
                    onChange={setValue}
                    multiple
                />
            </View>
        ),
        validate: (value: string) => !!value
    },
];

const RequestConsultationForm = () => {
    const route = useRoute<any>();
    const id = route.params?.id as string;
    const navigation = useNavigation<any>()
    const step = useSelector((state: RootState) => state.RequestDetailForm.step);

    const handleFinalSubmit = async (formData: any) => {
        try {
            console.log(formData)
            // const payload = {
            // _id:id
            //     mode: formData.gender,
            //     intents: formData.guidance.map((g: string) =>
            //         g.charAt(0).toUpperCase() + g.slice(1)
            //     ),
            // };
             
            navigation.reset({
                index: 1,
                routes: [
                    { name: "AstrologerScreen" },
                    { name: "RequestedFormCompleted" },
                ],
            });

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

export default RequestConsultationForm;