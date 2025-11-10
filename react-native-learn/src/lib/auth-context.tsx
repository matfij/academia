import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { awAccount } from "./appwrite";
import { ComponentProps } from "./types";

interface Auth {
  user?: Models.User<Models.Preferences>;
  isLoadingUser: boolean;
  signUp: (email: string, password: string) => Promise<string | undefined>;
  signIn: (email: string, password: string) => Promise<string | undefined>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<Auth | undefined>(undefined);

export const AuthProvider = (props: ComponentProps) => {
  const [user, setUser] = useState<Auth["user"]>();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    void getUser();
  }, []);

  const getUser = async () => {
    try {
      setIsLoadingUser(true);
      const session = await awAccount.get();
      setUser(session);
    } catch {
      setUser(undefined);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await awAccount.create({ userId: ID.unique(), email, password });
      await signIn(email, password);
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "Unable to sign up";
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await awAccount.createEmailPasswordSession({
        email,
        password,
      });
      await new Promise<void>((resolve) => setTimeout(resolve, 200));
      const session = await awAccount.get();
      setUser(session);
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "Unable to sign in";
    }
  };

  const signOut = async () => {
    try {
      await awAccount.deleteSessions();
      setUser(undefined);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoadingUser, signUp, signIn, signOut }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("Only usable withing AuthProvider");
  }

  return authContext;
};
