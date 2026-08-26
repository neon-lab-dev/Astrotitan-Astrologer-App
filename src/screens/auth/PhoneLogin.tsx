/* eslint-disable react-native/no-inline-styles */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLoginMutation } from '../../redux/features/auth/authApi';
import AnimatedScreen from '../../components/layout/AnimatedScreen';
import AuthTitle from '../../components/auth/AuthTitle';
import CountrySelector from '../../components/auth/CountrySelector';
import FormInput from '../../components/reusable/InputField/FormInput';
import { SansText } from '../../components/reusable/Text/SansText';
import OrDivider from '../../components/auth/OrDivider';
import ReusableButton from '../../components/reusable/ReusableButton/ReusableButton';
import AuthSecondaryNavigation from '../../components/auth/AuthSecondaryNavigation';
import TermsAndConditions from '../../components/auth/TermsAndConditions';
import { useNavigation, useRoute } from '@react-navigation/native';
import AuthLayout from '../../components/layout/layouts/AuthLayout';

type LoginForm = {
  phone: string;
};

export default function PhoneLogin() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<LoginForm>({
    defaultValues: {
      phone: '',
    },
    mode: 'onBlur',
  });
  const [country, setCountry] = useState({
    name: 'India',
    code: 'IN',
    callingCode: '91',
    flag: '🇮🇳',
  });

  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};
  const phone = watch('phone');
  const isFormFilled = phone.length >= 10;

  useEffect(() => {
    if (params.countryName) {
      setCountry({
        name: params.countryName as string,
        code: params.countryCode as string,
        callingCode: params.callingCode as string,
        flag: params.flag as string,
      });
    }
  }, [params]);

  const [login, { isLoading, error }] = useLoginMutation();

  const onSubmit = async (data: LoginForm) => {
    try {
      const payload = {
        email: '',
        phoneNumber: data.phone,
        role: 'astrologer',
      };

      await login(payload).unwrap();

      navigation.navigate({
        name: 'OTPScreen',
        params: {
          source: 'login',
          phone: data.phone,
        },
      });
    } catch (err: any) {
      console.log('LOGIN ERROR:', err);
    }
  };
  return (
    <AuthLayout>
      <AnimatedScreen>
        <View style={styles.container}>
          <View>
            <AuthTitle title="Welcome Back" children="Enter your phone number to continue"/>

            <View style={{ marginTop: 26, marginBottom: 24, gap: 16 }}>
              <CountrySelector
                label="Country"
                value={country.name}
                flag={country.flag}
              />

              {/* PASSWORD */}
              <FormInput
                key={country.callingCode}
                control={control}
                name="phone"
                label="Mobile Number"
                variant="phone"
                callingCode={country.callingCode}
                placeholder="Enter mobile number"
                rules={{
                  required: 'Mobile number cannot be empty!',
                  minLength: {
                    value: 10,
                    message: 'Enter valid number',
                  },
                }}
              />

              {/* API ERROR */}
              {error && (
                <SansText style={styles.apiError}>
                  {(error as any)?.data?.message || 'Login failed'}
                </SansText>
              )}
            </View>

            <ReusableButton
              title="Send OTP"
              variant="solid"
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || !isFormFilled}
            />

            <OrDivider />

            <TouchableOpacity
              onPress={() => navigation.replace('LoginWithEmail')}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: '#7a7a7a',
                  fontSize: 14,
                  fontFamily: 'GeneralSans-Medium',
                  textDecorationLine: 'underline',
                }}
              >
                Login with Email
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: 24 }}>
            <AuthSecondaryNavigation
              question="New User?"
              option=" Signup"
              action={() => navigation.replace('RegisterWithPhone')}
            />

            <TermsAndConditions />
          </View>
        </View>
      </AnimatedScreen>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  apiError: {
    color: '#C2371E',
    fontFamily: 'GeneralSans-Medium',
    textAlign: 'left',
    fontSize: 14,
    marginTop: 12,
  },
});
