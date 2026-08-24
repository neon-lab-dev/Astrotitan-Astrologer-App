export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;
  LoginWithEmail: undefined;
  RegisterWithEmail: undefined;
  LoginWithPhone: undefined;
  RegisterWithPhone: undefined;
  OTPScreen: undefined;
  MultiStepForm: undefined;
  ProfileCompleted: undefined;
  HomeTabs: undefined;
  HomeScreen: undefined;
  AstrologerChatScreen: {
    id: string;
    consultationFor: string;
    profilePicture: string;
    name: string;
  };
  AstrologerScreen: undefined;
  AvailabilityScreen: undefined;
  CreateArticleScreen: {
    contentType: string;
  };
  ArticleScreen: {
    id: string;
  };
  AstrologerDetailsScreen: {
    id: string;
  };
  RequestConsultationForm: {
    id: string;
  };
  SessionsScreen: undefined;
  NotificationScreen: undefined;
  RequestedFormCompleted: undefined;
  SelectContentType: undefined;
  CreateScreen: undefined;
  QueryDetails: {
    query?: {};
  };
  RaiseQuerySuccess: {
    slug: String;
  };
  ProfileScreen: undefined;
  PersonalInformation: undefined;
  SubscriptionScreen: undefined;
  Queries: undefined;
  RaiseQuery: undefined;
  ChatHistory: undefined;
  SessionHistoryDetails: {
    sessionType?: string;
    userName?: string;
    date?: string;
    time?: string;
    duration?: string;
    status?: string;
    rating?: string;
    subscriptionType?: string;
    image?: string;
  };
  SessionHistoryDetailsScreen: {
    sessionType: string;
    userName: string;
    date: string;
    time: string;
    duration: string;
    status: string;
    rating?: number;
    subscriptionType?: string;
    image?: string;
  };
  KundliScreen: undefined;
  KundliRequestDetails: {
    id: string;
  };
  UploadReport: {
    id: string;
  };
};
