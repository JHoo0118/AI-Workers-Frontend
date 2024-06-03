"use client";
import { ACCESS_TOKEN, USER } from "@/const/const";
import { deleteTokens } from "@/lib/utils/auth";
import { LoginSchema } from "@/lib/validation/loginSchema";
import { SignupSchema } from "@/lib/validation/signupSchema";
import {
  login as loginService,
  logout as logoutService,
  signup as signupService,
} from "@/service/auth/auth";
import { getMe } from "@/service/user/user";
import useUserStore from "@/store/userStore";
import { LoginOutputs, SignupOutputs } from "@/types/auth-types";
import { SimpleUser, UserModel } from "@/types/user-types";
import { hasCookie } from "cookies-next";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { toast } from "react-hot-toast";

interface AuthContextType {
  signup: (signupSchemaInputs: SignupSchema) => Promise<void>;
  login: (loginSchemaInputs: LoginSchema, forwardUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  renewalUser: (user: UserModel) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, deleteUser } = useUserStore();
  const user = useUserStore((state) => state.user);
  const locale = useLocale();
  const router = useRouter();

  const renewalUser = useCallback(
    (user: UserModel) => {
      setUser(user);

      const simpleUser: SimpleUser = {
        email: user.email,
        username: user.username,
      };

      localStorage.setItem(USER, JSON.stringify(simpleUser));
    },
    [setUser],
  );

  const getUser = useCallback(async () => {
    if (hasCookie(ACCESS_TOKEN)) {
      const userFromAPI = await getMe();
      if (!userFromAPI) {
        return;
      }
      renewalUser(userFromAPI);
    }
  }, [renewalUser]);

  useEffect(() => {
    if (user === null) {
      getUser();
    }

    if (!hasCookie(ACCESS_TOKEN)) {
      deleteTokens();
    }
  }, [user, getUser]);

  const signup = async (signupSchemaInputs: SignupSchema) => {
    await toast.promise(signupService(signupSchemaInputs), {
      loading: "처리 중...",
      success: (data: SignupOutputs) => {
        router.prefetch(`/${locale}/`);
        return <b>회원가입이 완료되었습니다.</b>;
      },
      error: (error) => <b>{error}</b>,
    });
    router.replace(`/${locale}/`);
    router.refresh();
    await getUser();
  };

  const login = async (loginSchemaInputs: LoginSchema, forwardurl?: string) => {
    await toast.promise(loginService(loginSchemaInputs), {
      loading: "처리 중...",
      success: (data: LoginOutputs) => {
        router.prefetch(forwardurl ?? `/${locale}`);
        return <b>로그인에 성공하였습니다.</b>;
      },
      error: (error) => <b>{error || "로그인에 실패하였습니다."}</b>,
    });
    router.replace(forwardurl ?? `/${locale}`);
    router.refresh();
    await getUser();
  };

  const logout = useCallback(async () => {
    await toast.promise(logoutService(), {
      loading: "처리 중...",
      success: (data: boolean) => {
        return <b>로그아웃 되었습니다.</b>;
      },
      error: (error) => <b>{error}</b>,
    });
    deleteTokens();
    setUser(undefined);
    router.replace(`/${locale}`);
  }, [router, locale, setUser]);

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        logout,
        renewalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
