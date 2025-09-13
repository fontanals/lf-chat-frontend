import { Box } from "@mui/material";
import { Fragment } from "react";
import { Outlet } from "react-router";
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
