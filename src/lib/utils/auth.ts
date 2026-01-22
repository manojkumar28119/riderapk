import { cookie } from "./cookie";
import { storage } from "./localstorage";
import { useAuthStore } from "@data/store/useAuthStore";
import { useLoaderStore } from "@/data/store/useLoaderStore";
import { getTokenExpiry } from "./jwt";
import { authService } from "@/services/api/auth.service";
import { wsService } from "@/services/api/websocket.service";
import { COOKIE_KEYS } from "@/data/constants/cookie.config";

interface User {
  id: string;
  name: string;
  email: string;
  role_id: string;
}

interface RolePermissions {
  modules: string[];
  submodules: string[];
  actions: string[];
}

interface Session {
  id: string;
  expiresAt: string;
}

interface LoginData {
  accessToken: string;
  user: User;
  refreshToken: string;
  rolepermissions: RolePermissions;
  session: Session;
}


export const auth = {
  /** 🔐 Save login data (token, user, permissions) */
  login(data: LoginData) {
    if (!data?.user) {
      console.warn("Invalid login data");
      return;
    }

    // Extract token expiry from JWT payload
    const tokenExpiry = getTokenExpiry(data.accessToken);

    cookie.set(COOKIE_KEYS.USER, JSON.stringify(data.user));
    cookie.set(COOKIE_KEYS.REFRESH_TOKEN, data.refreshToken);
    cookie.set(COOKIE_KEYS.SESSIONID, data?.session?.id);

    useAuthStore.setState({
      accessToken: data.accessToken,
      sessionExpiry: data.session.expiresAt,
      tokenExpiry: tokenExpiry,
    });
  },

  /** 🗝️ Refresh token and extract new token expiry */
  async refreshToken() {
    try {
      const response = await authService.refreshToken();
      
      if (response?.data?.accessToken) {
        // Extract new token expiry from refreshed token
        const tokenExpiry = getTokenExpiry(response?.data?.accessToken);
        
        useAuthStore.setState({
          accessToken: response?.data?.accessToken,
          tokenExpiry: tokenExpiry,
        });
      }
      return response;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // await this.logout();
      throw error;
    }
  },

  /** 
   * Verify authentication status and get fresh token/session
   * Used during route protection to validate stored credentials
   * Extracts and stores token expiry for refresh tracking
   * Updates auth store on success, throws on error
   */
  async authme(): Promise<void> {
    try{
      const response = await authService.authMe()

      const accessToken = response?.data?.accessToken;
      const sessionExpiry = response?.data?.session?.expires_at;
      const rolePermissions = response?.data?.rolepermissions;
      const tokenExpiry = accessToken ? getTokenExpiry(accessToken) : undefined;
      
      if (!accessToken || !sessionExpiry || !rolePermissions || tokenExpiry === undefined) {
        throw new Error('Invalid auth response: missing required fields');
      }

      useAuthStore.setState({
        accessToken,
        sessionExpiry,
        tokenExpiry,
        lastActivityTime: Date.now(),
      });
    }catch(error){
      console.error("AuthMe failed:", error);
      this.logout();
    }
  },

  /** extend session expiry */
  async extendSession() {
    try {
      const response = await authService.extendSession();
      if (response?.data?.expires_at) {
        useAuthStore.setState({
          sessionExpiry: response?.data?.expires_at,
        });
      }
      return response;
    } catch (error) {
      console.error("Session extension failed:", error);
      throw error;
    }
  },

  /** 🚪 Clear all auth data */
  async logout(navigate?: (path: string) => void) {
    try {
      useLoaderStore.setState({ isLoading: true });
      if (this.getSessionId()) {
        await authService.logOut();
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      wsService.disconnect();
      storage.clearAll();
      cookie.clearAll();
      useAuthStore.getState().clearAuth();
      useLoaderStore.setState({ isLoading: false });
      if (navigate) {
        navigate("/signin");
      } else {
        window.location.href = "/signin";
      }
    }
  },

  /** Get session id */
  getSessionId(): string | null {
    return cookie.get<string>(COOKIE_KEYS.SESSIONID);
  },

  /** 🔑 Get auth token */
  getToken(): string | null {
    return useAuthStore.getState().accessToken;
  },

  /** 📥 Get refresh token */
  getRefreshToken(): string | null {
    return cookie.get<string>(COOKIE_KEYS.REFRESH_TOKEN);
  },

  /** 👤 Get user object */
  getUser(): User | null {
    const data = cookie.get<User>(COOKIE_KEYS.USER);
    try {
      return data || null;
    } catch {
      return null;
    }
  },

  /** Get user ID */
  getUserId(): string | null {
    const user = this.getUser();
    if (!user) return null;
    return user?.id || null;
  },

  /** ✅ Check authentication */
  async isAuthenticated(): Promise<boolean> {
    const { accessToken, sessionExpiry } = useAuthStore.getState();

    // If access token, session ID, refresh token, and user are all present, consider authenticated
    if (accessToken && this.getSessionId() && this.getRefreshToken() && this.getUser()) {
      if (sessionExpiry) {
        return new Date(sessionExpiry) > new Date();
      }
    }

    // If no access token is present, check for valid session data in cookies
    if(!accessToken){
      if(this.getSessionId() && this.getUser() && this.getRefreshToken()){
          await auth.authme();
          return true;
      }else{
        return false;
      }
    }

    // If none of the above conditions are met, not considered authenticated
    return false;
  },

};
