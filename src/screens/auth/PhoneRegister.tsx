/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSignupMutation } from '../../redux/features/auth/authApi';
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

type RegisterForm = {
  phone: string;
};

export default function PhoneRegister() {
  const {
    control,
    handleSubmit,
    watch,
  } = useForm<RegisterForm>({
    defaultValues: {
      phone: '',
    },
    mode: 'onBlur',
  });

  // COUNTRY STATE
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
  const isFormFilled = phone.length >= 4;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const [signup] = useSignupMutation();

  const onSubmit = async (data: RegisterForm) => {
    // Check if country is India
    if (country.code !== 'IN') {
      // Show dummy loader for 2 seconds
      setIsLoading(true);
      setError(null);
      
      setTimeout(() => {
        setIsLoading(false);
        setError(
          'There is an error sending OTP to your mobile number. Please try with your email address.'
        );
      }, 2000);
      
      return;
    }

    // For India - proceed with actual API call
    try {
      setIsLoading(true);
      setError(null);
      
      const payload = {
        phoneNumber: data.phone,
        email: '',
        role: 'astrologer',
      };

      await signup(payload).unwrap();

      navigation.navigate({
        name: 'OTPScreen',
        params: {
          source: 'signup',
          phone: data.phone,
        },
      });
    } catch (err: any) {
      console.log('SIGNUP ERROR:', err);
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
              title="Create Your Account"
              children="Enter your phone number to continue"
            />

            <View style={{ marginTop: 26, marginBottom: 24, gap: 26 }}>
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
              onPress={() => navigation.replace('RegisterWithEmail')}
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
                Register with Email
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 24 }}>
            <AuthSecondaryNavigation
              question="Old User?"
              option=" SignIn"
              action={() => navigation.replace('LoginWithPhone')}
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
});