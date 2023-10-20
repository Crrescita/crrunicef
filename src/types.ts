export type RootStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  OTPScreen: {
    mobile_number: string;
  };
  SignupScreen: {
    mobile_number: string;
  };
  DashboardScreen: undefined;
  SubMenuScreen: {
    id: string;
    title: string;
  };
  GeneralFormScreen: undefined;
  LoginByOTP: undefined;
  AreYouFacingIssueScreen: {
    menuId: string;
  };
  IssuesFormScreen: {
    id: string;
  };
  ProfileScreen: undefined;
  ResultScreen: {
    unique_id: string;
  };
  FAQScreen: {
    menuId: string;
  };
};


export type ImageCarouselItem = {
  banner?: string;
  created_at?: string;
  id: number
  status?: number;
  type?: string;
  updated_at?: string
}

export type OTPVerify = {
  mobileNumber?: string;
}



