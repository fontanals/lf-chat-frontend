import { alpha, PopoverOrigin } from "@mui/material";
import { EditIcon, Trash2Icon } from "lucide-react";
import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem } from "../ui/menu";

export type ProjectMenuProps = {
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  anchorElement: HTMLElement | null;
  onEdit: MouseEventHandler<HTMLLIElement>;
  onDelete: MouseEventHandler<HTMLLIElement>;
  onClose: (event: any) => void;
};

export function ProjectMenu(props: ProjectMenuProps) {
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
      <MenuItem onClick={props.onEdit}>
        <EditIcon size="16px" />
        {t("edit")}
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
