/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import HomeNavigator from './HomeNavigator';
import { CustomTabBar } from '../components/navigation/CustomTabBar';
import SessionNavigator from './SessionNavigator';
import AvailabilityNavigator from './AvailabilityNavigator';
import CreateNavigator from './CreateNavigator';
import KundliNavigator from './KundliNavigator';

const Tab = createBottomTabNavigator();

const hiddenRoutes = [
  'ArticleScreen',
  'ProductDetails',
  'PujaDetails',
  'ConsultationForm',
  'Queries',
  'QueryDetails',
  'RaiseQuerySuccess',
  'RaiseQuery',
  'SubscriptionScreen',
  'ChatHistory',
  'AstrologerDetailsScreen',
  'AstrologerChatScreen',
  'NotificationScreen',
  'SelectContentType',
  'CreateArticleScreen',
  'PersonalInformation',
  'ConsultationCallScreen'
  
];

function shouldHideTabBar(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  return hiddenRoutes.includes(routeName);
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={({ route }): any => ({
          title: 'Home',
          tabIcon: { active: 'homeActive', inactive: 'homeInactive' },
          tabBarStyle: shouldHideTabBar(route)
            ? { display: 'none' }
            : undefined,
        })}
      />
      <Tab.Screen
        name="SessionTab"
        component={SessionNavigator}
        options={({ route }): any => ({
          title: 'Session',
          tabIcon: { active: 'calendarActive', inactive: 'calendarInactive' },
          tabBarStyle: shouldHideTabBar(route)
            ? { display: 'none' }
            : undefined,
        })}
      />
      <Tab.Screen
        name="KundliTab"
        component={KundliNavigator}
        options={({ route }): any => ({
          title: 'Kundli',
          tabIcon: { active: 'KundliActive', inactive: 'Kundli' },
          tabBarStyle: shouldHideTabBar(route)
            ? { display: 'none' }
            : undefined,
        })}
      />
      <Tab.Screen
        name="AvailabilityTab"
        component={AvailabilityNavigator}
        options={({ route }): any => ({
          title: 'Availability',
          tabIcon: { active: 'ClockActive', inactive: 'ClockInactive' },
          tabBarStyle: shouldHideTabBar(route)
            ? { display: 'none' }
            : undefined,
        })}
      />
      <Tab.Screen
        name="CreateTab"
        component={CreateNavigator}
        options={({ route }): any => ({
          title: 'Create',
          tabIcon: { active: 'EditActive', inactive: 'EditInactive' },
          tabBarStyle: shouldHideTabBar(route)
            ? { display: 'none' }
            : undefined,
        })}
      />
    </Tab.Navigator>
  );
}
