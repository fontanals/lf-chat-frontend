import { Box } from "@mui/material";
import { Fragment } from "react";
import { Outlet } from "react-router";
import { AlertSnackbar } from "../common/alert-snackbar";
import { ErrorDialog } from "../common/error-dialog";

export function AuthLayout() {
  return (
    <Fragment>
      <Box component="main">
        <Outlet />
      </Box>
      <AlertSnackbar />
      <ErrorDialog />
    </Fragment>
  );
}
