import { create } from "zustand";
import api from "../lib/axios";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  checkAuth: async () => {
    try {
      console.log("Checking auth...");
      const res = await api.get("/users/me");
      set({ user: res.data.user });
    } catch (err) {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  login: async (data) => {
    const res = await api.post("/users/login", data);
    set({ user: res.data.user });
  },

  signup: async (data) => {
    const res = await api.post("/users/signup", data);
    set({ user: res.data.user });
  },

  logout: async () => {
    await api.post("/users/logout");
    set({ user: null });
  },
}));

export default useAuthStore;

