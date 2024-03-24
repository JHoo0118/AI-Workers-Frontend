import { create } from "zustand";

interface DrawerState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const useDrawerStore = create<DrawerState>((set) => ({
  open: false,
  setOpen: (open: boolean) => set(() => ({ open })),
}));

export default useDrawerStore;
