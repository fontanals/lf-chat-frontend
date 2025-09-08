import { Box, IconButton, InputBase, alpha } from "@mui/material";
import { ArrowUpRightIcon } from "lucide-react";
import { ChangeEventHandler } from "react";

export type ChatInputProps = {
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: () => void;
  disabled?: boolean;
};

export function ChatInput(props: ChatInputProps) {
  return (
    <Box
      sx={{
        alignSelf: "center",
        width: "60%",
        padding: "16px",
        textAlign: "end",
        borderRadius: "16px",
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
      }}
    >
      <InputBase
        sx={{ fontSize: "14px" }}
        placeholder={props.placeholder}
        fullWidth
        multiline
        maxRows={5}
        value={props.value}
        onChange={props.onChange}
      />
      <IconButton
        sx={{
          width: "32px",
          height: "32px",
          minWidth: "32px",
          minHeight: "32px",
          padding: "0px",
          color: "background.default",
          backgroundColor: "secondary.main",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "secondary.main" },
          "&:disabled": {
            backgroundColor: "secondary.main",
            color: "background.default",
            opacity: 0.5,
          },
          "& .MuiTouchRipple-child": { borderRadius: "8px" },
        }}
        onClick={props.onSubmit}
        disabled={props.disabled}
      >
        <ArrowUpRightIcon style={{ width: "24px", height: "24px" }} />
      </IconButton>
    </Box>
  );
}
