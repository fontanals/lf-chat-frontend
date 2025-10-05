import {
  Box,
  IconButton,
  List,
  ListItem,
  ListProps,
  SxProps,
} from "@mui/material";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Project } from "../../models/entities/project";
import { Text } from "../ui/text";
import { ProjectMenu } from "./project-menu";

export type ProjectListItemProps = {
  sx?: SxProps;
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProjectListItem(props: ProjectListItemProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  return (
    <Link to={`/projects/${props.project.id}`}>
      <ListItem
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          borderRadius: "8px",
          textTransform: "none",
          "&:hover": { backgroundColor: "background.default" },
          ...props.sx,
        }}
      >
        <Box>
          <Text sx={{ lineHeight: 1 }} noWrap>
            {props.project.name}
          </Text>
          <Text
            sx={{ lineHeight: 1, color: "text.secondary" }}
            variant="caption"
            noWrap
          >
            {props.project.description}
          </Text>
        </Box>
        <IconButton
          sx={{ color: "primary.main" }}
          size="small"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setAnchorElement(event.currentTarget);
          }}
        >
          <EllipsisVerticalIcon size="16px" />
        </IconButton>
        <ProjectMenu
          anchorElement={anchorElement}
          onEdit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setAnchorElement(null);
            props.onEdit();
          }}
          onDelete={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setAnchorElement(null);
            props.onDelete();
          }}
          onClose={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setAnchorElement(null);
          }}
        />
      </ListItem>
    </Link>
  );
}

export function ProjectList(props: ListProps) {
  const { sx, ...rest } = props;

  return <List sx={{ margin: "0px", padding: "0px", ...sx }} {...rest} />;
}
