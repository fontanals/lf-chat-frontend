import { Alert as MuiAlert, Snackbar } from "@mui/material";
import { useAlertStore } from "../../state/alert";

export function AlertSnackbar() {
  const { showAlert, alert, clearAlert } = useAlertStore();

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={6000}
      open={showAlert}
      onClose={clearAlert}
    >
      <MuiAlert
        sx={{ width: "100%" }}
        variant="filled"
        severity={alert?.severity}
        onClose={clearAlert}
      >
        {alert?.message}
      </MuiAlert>
    </Snackbar>
  );
}
