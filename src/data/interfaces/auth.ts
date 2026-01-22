export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  phoneNumber: string;
  password: string;
  roleId?: string;
}

export interface ResetPasswordCredentials {
  email: string;
  password: string;
}


export interface LoginResponse {
  access_token: string;
  user: any;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface OtpVerificationCredentials {
  email: string;
  code: string;
}

export interface OtpVerificationResponse {
  message: string;
}

export interface VerifyInvitationResponse {
  data: {
    email: string;
    phonenumber: string;
    roleid: string;
  };
}