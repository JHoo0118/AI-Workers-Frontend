import { UserModel } from "@/types/user-types";
import { create } from "zustand";

interface UserState {
  user?: UserModel | undefined | null;
  setUser: (user?: UserModel | null) => void;
  deleteUser: () => void;
  recalculateRemainCount: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user?: UserModel | undefined | null) => set({ user }),
  deleteUser: () => set({ user: null }),
  recalculateRemainCount: () =>
    set((state) => ({
      user: {
        ...state.user!,
        remainCount:
          state.user!.remainCount == 0 ? 0 : state.user!.remainCount - 1,
      },
    })),
}));

export default useUserStore;
