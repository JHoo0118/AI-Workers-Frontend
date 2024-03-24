import { UserModel } from "@/types/user-types";
import { create } from "zustand";

interface UserState {
  user?: UserModel | undefined | null;
  setUser: (user?: UserModel) => void;
  deleteUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user?: UserModel | undefined | null) => set({ user }),
  deleteUser: () => set({ user: null }),
}));

export default useUserStore;
