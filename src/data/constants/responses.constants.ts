// HTTP Status Codes
export const HttpStatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const Responses = {
  auth: {
    signIn: {
      success: {
        title: "Welcome Back!",
        description: "You have been signed in successfully.",
      },
      error: {
        title: "Sign In Failed",
        description: "Please check your credentials and try again.",
        invalidCredentials: "Invalid email or password.",
        accountLocked: "Your account has been temporarily locked.",
        networkError: "Network error. Please check your connection.",
      },
    },
    signUp: {
      success: "Your account has been created successfully.",
      error: "Unable to create account. Please try again.",
    },
    forgotPassword: {
      success: "If the email address is registered, you will receive a password reset OTP shortly.",
      error: "Unable to send OTP. Please try again.",
    },
    resetPassword: {
      success: "Your password has been successfully updated.",
      error: "Unable to reset password. Please try again.",
    },
    otpVerification: {
      success: "Your account has been verified successfully.",
      error: {
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        otpExpired: "OTP has expired. Please request a new one.",
      },
    },
  },

};