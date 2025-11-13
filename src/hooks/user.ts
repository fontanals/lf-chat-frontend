import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
  ChangePasswordRequest,
  UpdateUserRequest,
} from "../models/requests/user";
import { GetUserResponse } from "../models/responses/user";
import { services } from "../services/provider";
import { useAlertStore } from "../state/alert";
import { useErrorStore } from "../state/error";
import { ApplicationError, ApplicationErrorCode } from "../utils/errors";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => services.user.getUser(),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const displayAlert = useAlertStore((state) => state.displayAlert);

  return useMutation({
    mutationFn: (args: { request: UpdateUserRequest }) =>
      services.user.updateUser(args.request),
    onMutate: async (args) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });

      const previousUser = queryClient.getQueryData<GetUserResponse>(["user"]);

      queryClient.setQueryData<GetUserResponse>(["user"], (user) =>
        user != null ? { ...user, ...args.request } : user
      );

      return { previousUser };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData<GetUserResponse>(
        ["user"],
        context?.previousUser
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });

      displayAlert({
        severity: "success",
        message: t("profile_updated_successfully"),
      });
    },
  });
}

export function useChangePassword(
  setIsInvalidPassword: Dispatch<SetStateAction<boolean>>
) {
  const { t } = useTranslation();

  const displayAlert = useAlertStore((state) => state.displayAlert);
  const displayError = useErrorStore((state) => state.displayError);

  return useMutation({
    mutationFn: (args: { request: ChangePasswordRequest }) =>
      services.user.changePassword(args.request),
    onSuccess: () => {
      displayAlert({
        severity: "success",
        message: t("password_changed_successfully"),
      });
    },
    onError: (error) => {
      const applicationError = ApplicationError.copy(error);

      if (applicationError.code === ApplicationErrorCode.InvalidPassword) {
        setIsInvalidPassword(true);
        return;
      }

      displayError(applicationError);
    },
  });
}

export function useDeleteUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: services.user.deleteUser,
    onMutate: () => {
      navigate("/signin");
    },
    onSuccess: () => {
      services.httpClient.removeHeader("Authorization");
      queryClient.clear();
    },
  });
}
