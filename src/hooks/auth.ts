import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { SigninRequest, SignupRequest } from "../models/requests/auth";
import { GetUserResponse } from "../models/responses/user";
import { services } from "../services/provider";

export function useSignup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { request: SignupRequest }) =>
      services.auth.signup(args.request),
    onSuccess: (response) => {
      queryClient.setQueryData<GetUserResponse>(["user"], response.user);
      navigate("/");
    },
  });
}

export function useSignin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { request: SigninRequest }) =>
      services.auth.signin(args.request),
    onSuccess: (response) => {
      queryClient.setQueryData<GetUserResponse>(["user"], response.user);
      navigate("/");
    },
  });
}

export function useSignout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => services.auth.signout(),
    onSuccess: () => {
      queryClient.clear();
      navigate("/signin");
    },
  });
}
