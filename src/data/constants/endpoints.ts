export const endpoints = {
  auth: {
    signIn: "/signin",
    signUp: "signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyOtp: "/verify-forgot-password-otp",
    verifyInvitation: "/verify-invitation",
    me: "/auth-me",
    logout: "/session",
    extendSession: "/session",
    refreshToken: "/refresh-token",
  },
  notifications: {
    getNotifications: "/notifications",
    markAsRead: "/notifications/mark-as-read",
  },
};
