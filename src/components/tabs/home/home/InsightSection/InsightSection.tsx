import ContentSection from '@/components/reusable/ContentSectoin/ContentSection';
import SectionTitle from '@/components/reusable/SectionTitle/SectionTitle';
import { SansText } from '@/components/reusable/Text/SansText';
import React from 'react';
import { View } from 'react-native';

import BookIcon from "@/assets/icons/visual/intent/book.svg";
import BriefcaseIcon from "@/assets/icons/visual/intent/briefcase.svg";
import HeartIcon from "@/assets/icons/visual/intent/favourite.svg";
import CircularProgress from '@/components/reusable/CircularProgress/CircularProgress';

const INSIGHTS = [
  {
    title: "Love & relationships",
    description:
      "Emotional sensitivity may create misunderstandings. Small gestures can restore harmony.",
    supportLevel: 75,
    icon: HeartIcon,
  },
  {
    title: "Work & growth",
    description:
      "Business and work matters require focus. Avoid multitasking.",
    supportLevel: 50,
    icon: BriefcaseIcon,
  },
  {
    title: "Education",
    description:
      "Progress may feel slower than expected. Consistency matters.",
    supportLevel: 50,
    icon: BookIcon,
  },
];

const InsightSection = () => {
  return (
    <View style={{paddingHorizontal:16}}>
      <SectionTitle title="Intent insights" />

      <View style={{ paddingTop: 24, gap: 24 }}>
        {INSIGHTS.map((item, index) => {
          const Icon = item.icon;

          return (
            <View key={index}>
              {/* Icon */}
              <Icon height={24} width={24} style={{ marginBottom: 16 }} color={"#0D0D0D"} />

              <View style={{ gap: 12 }}>
                {/* Main Content */}
                <ContentSection title={item.title} titleColor='#4A4A4A' descriptionColor='#4A4A4A'>
                  <SansText>{item.description}</SansText>
                </ContentSection>

                {/* Support Level (optional) */}
                {item.supportLevel !== undefined && (
                  <ContentSection title="Support level"titleColor='#4A4A4A' descriptionColor='#4A4A4A'>
                    <SansText>
                      Support levels indicate planetary assistance, not guaranteed outcomes.
                    </SansText>
                  </ContentSection>
                )}
              </View>

              {/* Progress (optional) */}
              {item.supportLevel !== undefined && (
                <View style={{ marginTop: 12 }}>
                  <CircularProgress value={item.supportLevel} />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default InsightSection;