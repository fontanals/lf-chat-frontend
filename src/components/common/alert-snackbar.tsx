import { Alert, Snackbar } from "@mui/material";
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
      <Alert
        sx={{ alignItems: "center", width: "100%", borderRadius: "8px" }}
        variant="filled"
        severity={alert?.severity}
        onClose={clearAlert}
      >
        {alert?.message}
      </Alert>
    </Snackbar>
  );
}
