import { alpha, PopoverOrigin } from "@mui/material";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem } from "../ui/menu";

export type ChatMenuProps = {
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  anchorElement: HTMLElement | null;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export function ChatMenu(props: ChatMenuProps) {
  const { t } = useTranslation();

  return (
    <Menu
      slotProps={{
        paper: {
          sx: { borderRadius: "8px", backgroundColor: "background.default" },
        },
      }}
      anchorOrigin={props.anchorOrigin}
      transformOrigin={props.transformOrigin}
      anchorEl={props.anchorElement}
      open={Boolean(props.anchorElement)}
      onClose={props.onClose}
    >
      <MenuItem onClick={props.onRename}>
        <EditIcon size="16px" />
        {t("rename")}
      </MenuItem>
      <MenuItem
        sx={{
          "&:hover": {
            color: "error.main",
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.2),
          },
        }}
        onClick={props.onDelete}
      >
        <Trash2Icon size="16px" />
        {t("delete")}
      </MenuItem>
    </Menu>
  );
}
