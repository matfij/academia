import { create } from 'zustand';

type AuthStore = {
    username?: string;
    singIn: (username: string) => void;
    signOut: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    singIn: (username: string) => set({ username }),
    signOut: () => set({ username: undefined }),
}));
