import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../state/auth";

export function PrivateRoute() {
  const user = useAuthStore((state) => state.user);

  return user != null ? <Outlet /> : <Navigate to="/signin" />;
}
