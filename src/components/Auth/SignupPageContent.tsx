"use client";

import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { useAuth } from "@/context/AuthContext";
import { SignupSchema, signupSchema } from "@/lib/validation/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const SignupPageContent = () => {
  const { signup } = useAuth();
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    await signup(data);
  };

  // async function onClickGoogleLogin() {
  //   const { url } = await googleLogin();
  //   router.push(url);
  // }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>이메일</FormLabel>
          <FormControl>
            <Input type="email" {...form.register("email")} />
          </FormControl>
          <FormMessage>{form.formState.errors.email?.message}</FormMessage>
        </FormItem>
        <FormItem>
          <FormLabel>사용자명</FormLabel>
          <FormControl>
            <Input type="username" {...form.register("username")} />
          </FormControl>
          <FormMessage>{form.formState.errors.username?.message}</FormMessage>
        </FormItem>
        <FormItem>
          <FormLabel>비밀번호</FormLabel>
          <FormControl>
            <Input type="password" {...form.register("password")} />
          </FormControl>
          <FormMessage>{form.formState.errors.password?.message}</FormMessage>
        </FormItem>
        <FormItem>
          <FormLabel>비밀번호 확인</FormLabel>
          <FormControl>
            <Input type="password" {...form.register("confirmPassword")} />
          </FormControl>
          <FormMessage>
            {form.formState.errors.confirmPassword?.message}
          </FormMessage>
        </FormItem>
        <LoadingButton
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
          loading={form.formState.isSubmitting}
        >
          계정 생성
        </LoadingButton>
      </form>
    </Form>
  );
};
export default SignupPageContent;
