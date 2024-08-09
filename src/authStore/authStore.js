import { create } from "zustand";
import { verifyUser } from "../utils/verifyAuth";
import { baseUrl } from "../basicurl/baseurl";
import axios from "axios";

const useAuthStore = create((set) => ({
  isAuth: false,
  loading: false, 

  login: async () => {
    set({ loading: true });
    try {
      await verifyUser(); 
      set({ isAuth: true, loading: false });
    } catch (error) {
      console.error("Login failed:", error); 
      set({ isAuth: false, loading: false });
    }
  },

  signup: async () => {
    set({ loading: true });
    try {
      await verifyUser(); 
      set({ isAuth: true, loading: false });
    } catch (error) {
      console.error("Signup failed:", error); 
      set({ isAuth: false, loading: false });
    }
  },

  logout: async () => {
    try {
      await axios.post(`${baseUrl}/users/logout`, "", { withCredentials: true });
      set({ isAuth: false });
      const event = new Event("logout");
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      await verifyUser();
      set({ isAuth: true, loading: false });
    } catch (error) {
      console.error("Token verification failed:", error);
      set({ isAuth: false, loading: false });
    }
  },
}));

export default useAuthStore;
