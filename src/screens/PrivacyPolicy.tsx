// Clean, reusable React Native Expo components based on your UI
// Assumes you already have SatoshiText and SansText components

import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedScreen from "../components/layout/AnimatedScreen";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import AppHeader from "../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../components/auth/AuthTitle";
import ContentSection from "../components/reusable/ContentSectoin/ContentSection";
import BulletPoint from "../components/reusable/BulletPoints/BulletPoints";
const PrivacyPolicy = () => {

    return (
        <AnimatedScreen>
        <SafeAreaView style={{ flex: 1 }}>
            <ScreenWrapper>

                <AppHeader  >
                    <AuthTitle title="Privacy Policy">
                    </AuthTitle>
                </AppHeader>
                
                <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 24,
                gap: 24,
              }}
            >
              {/* SECTION 1 */}

              <ContentSection
                title="1. Platform Overview"
                sectionStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#B0B0B0",
                  paddingBottom: 24,
                }}
              >
                AstroTitan connects users with independent astrologers for
                consultations and related services. We do not guarantee
                outcomes, predictions, or results from any consultation.
              </ContentSection>

              {/* SECTION 2 */}

              <ContentSection
                title="2. User Responsibility"
                sectionStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#B0B0B0",
                  paddingBottom: 24,
                }}
                children2={
                  <View style={{ gap: 16 , paddingLeft:6}}>
                    <BulletPoint
                      text="Users are responsible for the information they provide during consultations."
                    />

                    <BulletPoint
                      text="AstroTitan is not liable for decisions made based on astrological advice."
                    />

                    <BulletPoint
                      text="Users must maintain respectful behavior during consultations."
                    />
                  </View>
                }
              />

              {/* SECTION 3 */}

              <ContentSection
                title="3. Astrologer Responsibility"
                sectionStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#B0B0B0",
                  paddingBottom: 24,
                }}
                children2={
                  <View style={{ gap: 16 , paddingLeft:6}}>
                    <BulletPoint
                      text="Astrologers are solely responsible for the advice they provide."
                    />

                    <BulletPoint
                      text="Astrologers must follow platform guidelines and ethical standards."
                    />

                    <BulletPoint
                      text="False claims or misleading guarantees are strictly prohibited."
                    />
                  </View>
                }
              />

              {/* SECTION 4 */}

              <ContentSection
                title="4. Payments & Refunds"
                sectionStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#B0B0B0",
                  paddingBottom: 24,
                }}
                children2={
                  <View style={{ gap: 16 , paddingLeft:6}}>
                    <BulletPoint
                      text="All payments are processed securely through supported payment gateways."
                    />

                    <BulletPoint
                      text="Refunds are subject to AstroTitan refund policies."
                    />

                    <BulletPoint
                      text="Completed consultations may not be eligible for refunds."
                    />
                  </View>
                }
              />
            </View>
          </ScrollView>
                </ScreenWrapper></SafeAreaView></AnimatedScreen>
    );
};
export default PrivacyPolicy;
