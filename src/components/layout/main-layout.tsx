import { Box } from "@mui/material";
import { Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { Sidebar } from "./sidebar";

export function MainLayout() {
  return (
    <Fragment>
      <Sidebar />
      <Box component="main">
        <Outlet />
      </Box>
    </Fragment>
  );
}
