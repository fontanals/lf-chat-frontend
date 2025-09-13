import { Backdrop, CircularProgress } from "@mui/material";

export type LoadingBackdropProps = {
  isLoading: boolean;
};

export function LoadingBackdrop(props: LoadingBackdropProps) {
  return (
    <Backdrop
      sx={{
        color: "secondary.main",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={props.isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
