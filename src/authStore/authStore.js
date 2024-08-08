import { create } from "zustand";
import { verifyUser, verifyGtoken } from "../utils/verifyAuth";
import Cookies from "js-cookie";

const useAuthStore = create((set) => ({
  isAuth: false,
  loading: true,

  login: async () => {
    set({ loading: true });
    try {
      await verifyUser();
      set({ isAuth: true, loading: false });
    } catch (error) {
      console.error("Token verification failed:", error);
      set({ isAuth: false, loading: false });
    }
  },

  signup: async () => {
    set({ loading: true });
    try {
      await verifyUser();
      set({ isAuth: true, loading: false });
    } catch (error) {
      console.error("Token verification failed:", error);
      set({ isAuth: false, loading: false });
    }
  },

  googleAuth: async () => {
    set({ loading: true });
    try {
      await verifyGtoken();
      set({ isAuth: true, loading: false });
    } catch (error) {
      console.error("Google token verification failed:", error);
      set({ isAuth: false, loading: false });
    }
  },

  logout: () => {
    Cookies.remove("userToken");
    Cookies.remove("googleToken");
    Cookies.remove("profile");
    Cookies.remove("profileArray");
    set({ isAuth: false });
    const event = new Event("logout");
    window.dispatchEvent(event);
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      await verifyUser();
      set({ isAuth: true, loading: false });
    } catch (error) {
      try {
        await verifyGtoken();
        set({ isAuth: true, loading: false });
      } catch (googleError) {
        console.error("Token verification failed:", googleError);
        set({ isAuth: false, loading: false });
      }
    }
  },
}));

export default useAuthStore;
