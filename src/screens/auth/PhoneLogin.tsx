/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
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
import BottomSheetService from '../../redux/features/ui/GlobalSheet/BottomSheetService';
import CountryBottomSheet from '../../components/auth/CountryBottomSheet';

type LoginForm = {
  phone: string;
};

export default function PhoneLogin() {
  const { control, handleSubmit, watch } = useForm<LoginForm>({
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
  const phone = watch('phone');
  const isFormFilled = phone.length >= 4;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const params = route.params || {};
    if (params.countryName) {
      setCountry({
        name: params.countryName as string,
        code: params.countryCode as string,
        callingCode: params.callingCode as string,
        flag: params.flag as string,
      });
    }
  }, [route.params]);

  const [login] = useLoginMutation();

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError(null);

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
      setError(err?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openCountryBottomSheet = () => {
    BottomSheetService.open(
      React.createElement(CountryBottomSheet, {
        selectedCountry: country,
        onSelectCountry: (selected: any) => {
          setCountry({
            name: selected.name,
            code: selected.code,
            callingCode: selected.callingCode,
            flag: selected.flag,
          });
          if (selected.code !== 'IN') {
            navigation.navigate('LoginWithEmail');
          }
          // Clear error when country changes
          setError(null);
          BottomSheetService.close();
        },
      }),
      {
        height: '85%',
        hasGradient: false,
      },
    );
  };

  return (
    <AuthLayout>
      <AnimatedScreen>
        <View style={styles.container}>
          <View>
            <AuthTitle
              title="Welcome Back"
              children="Enter your phone number to continue"
            />

            <View style={{ marginTop: 26, marginBottom: 24, gap: 16 }}>
              <CountrySelector
                label="Country"
                value={country.name}
                flag={country.flag}
                onPress={openCountryBottomSheet}
              />

              {/* PHONE INPUT */}
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

              {/* ERROR MESSAGE */}
              {error && (
                <View style={styles.errorContainer}>
                  <SansText style={styles.apiError}>{error}</SansText>
                </View>
              )}
            </View>

            <ReusableButton
              title="Send OTP"
              variant="solid"
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
              disabled={!isFormFilled}
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
              option=" Sign up"
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
  errorContainer: {
    marginTop: 4,
  },
  apiError: {
    color: '#C2371E',
    fontFamily: 'GeneralSans-Medium',
    textAlign: 'left',
    fontSize: 14,
    lineHeight: 20,
  },
  countryNote: {
    fontSize: 12,
    color: '#D4AF37',
    fontFamily: 'GeneralSans-Medium',
    marginTop: -14,
    marginBottom: 4,
  },
});
