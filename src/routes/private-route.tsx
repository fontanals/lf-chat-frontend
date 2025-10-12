import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { services } from "../services/provider";

export function PrivateRoute() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => services.user.getUser(),
  });

  if (isLoading) {
    return <LoadingBackdrop isLoading />;
  }

  return user != null ? <Outlet /> : <Navigate to="/signin" replace />;
}
