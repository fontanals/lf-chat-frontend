import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateUserRequest } from "../models/requests/user";
import { GetUserResponse } from "../models/responses/user";
import { services } from "../services/provider";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => services.user.getUser(),
    select: (response) => response.user,
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

      queryClient.setQueryData<GetUserResponse>(["user"], (response) =>
        response != null
          ? { ...response, user: { ...response.user, ...args.request } }
          : response
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
