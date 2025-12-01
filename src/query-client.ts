import { QueryCache, QueryClient } from "@tanstack/react-query";
import { useErrorStore } from "./state/error";
import { ApplicationError, ApplicationErrorCode } from "./utils/errors";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
      onError: (error) =>
        useErrorStore.setState({
          showError: true,
          error: ApplicationError.copy(error),
        }),
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const applicationError = ApplicationError.copy(error);

      if (applicationError.code !== ApplicationErrorCode.NotFound) {
        useErrorStore.setState({ showError: true, error: applicationError });
      }
    },
  }),
});
