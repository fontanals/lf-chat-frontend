import { alpha, PopoverOrigin } from "@mui/material";
import { EditIcon, Trash2Icon } from "lucide-react";
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
  return (
    <Menu
      anchorOrigin={props.anchorOrigin}
      transformOrigin={props.transformOrigin}
      anchorEl={props.anchorElement}
      open={Boolean(props.anchorElement)}
      onClose={props.onClose}
    >
      <MenuItem onClick={props.onRename}>
        <EditIcon size="16px" />
        Rename
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
        Delete
      </MenuItem>
    </Menu>
  );
}
