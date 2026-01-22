// auth.service.ts
import {apiClient} from "@services/api/axios.config";
import { endpoints } from "@/data/constants/endpoints";
import { RegisterCredentials, LoginCredentials, ResetPasswordCredentials, OtpVerificationCredentials } from "@data/interfaces/auth";
import { auth } from "@lib/utils/auth"


export const authService = {
  login: async (credentials: LoginCredentials) => {
    const res = await apiClient.post(endpoints.auth.signIn, credentials);
    return res.data;
  },

  register: async (credentials: RegisterCredentials) => {
    const res = await apiClient.post(endpoints.auth.signUp, credentials);
    return res.data;
  },

  forgotPassword: async (credentials: { email: string; }) => {
    const res = await apiClient.post(endpoints.auth.forgotPassword, credentials);
    return res.data;
  },

  resetPassword: async (credentials: ResetPasswordCredentials) => {
    const res = await apiClient.put(endpoints.auth.resetPassword, credentials);
    return res.data;
  },

  verifyOtp: async (credentials: OtpVerificationCredentials) => {
    const res = await apiClient.post(endpoints.auth.verifyOtp, credentials);
    return res.data;
  },

  verifyInvitation: async (iniviteId: string) => {
    const res = await apiClient.get(`${endpoints.auth.verifyInvitation}/${iniviteId}`);
    return res.data;
  },

  authMe: async () => {
    const res = await apiClient.post(endpoints.auth.me,{
      sessionId: auth.getSessionId(),
      refreshToken: auth.getRefreshToken(),
    });
    return res.data;
  },

  extendSession: async () => {
    const res = await apiClient.put(`${endpoints.auth.extendSession}/${auth.getSessionId()}`);
    return res.data;
  },

  refreshToken: async()=>{
    const res = await apiClient.post(endpoints.auth.refreshToken, {
      refreshToken: auth.getRefreshToken()
    });
    return res.data;
  },

  logOut: async () => {
    const res = await apiClient.delete(`${endpoints.auth.logout}/${auth.getSessionId()}`);
    return res.data;
  }
};
