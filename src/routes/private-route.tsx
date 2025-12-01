import { Navigate, Outlet } from "react-router";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { useUser } from "../hooks/user";

export function PrivateRoute() {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingBackdrop isLoading />;
  }

  return user != null ? <Outlet /> : <Navigate to="/signin" replace />;
}
