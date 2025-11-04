import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router";
import { SigninRequest, SignupRequest } from "../models/requests/auth";
import { GetUserResponse } from "../models/responses/user";
import { services } from "../services/provider";
import { useErrorStore } from "../state/error";
import { ApplicationError, ApplicationErrorCode } from "../utils/errors";

export function useSignup(
  setIsInvalidEmailOrPassword: Dispatch<SetStateAction<boolean>>
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const displayError = useErrorStore((state) => state.displayError);

  return useMutation({
    mutationFn: (args: { request: SignupRequest }) =>
      services.auth.signup(args.request),
    onSuccess: (response) => {
      queryClient.setQueryData<GetUserResponse>(["user"], response.user);

      navigate("/new");
    },
    onError: (error) => {
      const applicationError = ApplicationError.copy(error);

      if (
        applicationError.code === ApplicationErrorCode.InvalidEmailOrPassword
      ) {
        setIsInvalidEmailOrPassword(true);
        return;
      }

      displayError(applicationError);
    },
  });
}

export function useSignin(
  setIsInvalidEmailOrPassword: Dispatch<SetStateAction<boolean>>
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const displayError = useErrorStore((state) => state.displayError);

  return useMutation({
    mutationFn: (args: { request: SigninRequest }) =>
      services.auth.signin(args.request),
    onSuccess: (response) => {
      queryClient.setQueryData<GetUserResponse>(["user"], response.user);

      navigate("/new");
    },
    onError: (error) => {
      const applicationError = ApplicationError.copy(error);

      if (
        applicationError.code === ApplicationErrorCode.InvalidEmailOrPassword
      ) {
        setIsInvalidEmailOrPassword(true);
        return;
      }

      displayError(applicationError);
    },
  });
}

export function useSignout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => services.auth.signout(),
    onMutate: () => {
      navigate("/signin");
    },
    onSuccess: () => {
      services.httpClient.removeHeader("Authorization");
      queryClient.clear();
    },
  });
}
