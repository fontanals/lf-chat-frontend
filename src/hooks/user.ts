import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateUserRequest } from "../models/requests/user";
import { GetUserResponse } from "../models/responses/user";
import { services } from "../services/provider";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => services.user.getUser(),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

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
    },
  });
}
