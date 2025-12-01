import { useMutation } from "@tanstack/react-query";
import {
  RecoverPasswordRequest,
  ResetPasswordRequest,
  SigninRequest,
  SignupRequest,
  VerifyAccountRequest,
} from "../models/requests/auth";
import { services } from "../services/provider";

export function useSignup() {
  return useMutation({
    mutationFn: (args: { request: SignupRequest }) =>
      services.auth.signup(args.request),
    onError: undefined,
  });
}

export function useVerifyAccount() {
  return useMutation({
    mutationFn: (args: { request: VerifyAccountRequest }) =>
      services.auth.verifyAccount(args.request),
    onError: undefined,
  });
}

export function useSignin() {
  return useMutation({
    mutationFn: (args: { request: SigninRequest }) =>
      services.auth.signin(args.request),
    onError: undefined,
  });
}

export function useSignout() {
  return useMutation({ mutationFn: () => services.auth.signout() });
}

export function useRecoverPassword() {
  return useMutation({
    mutationFn: (args: { request: RecoverPasswordRequest }) =>
      services.auth.recoverPassword(args.request),
    onError: undefined,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (args: { request: ResetPasswordRequest }) =>
      services.auth.resetPassword(args.request),
    onError: undefined,
  });
}
