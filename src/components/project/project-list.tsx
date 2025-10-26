import { List, ListItem, ListProps, SxProps } from "@mui/material";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Project } from "../../models/entities/project";
import { IconButton } from "../ui/button";
import { Text } from "../ui/text";
import { ProjectMenu } from "./project-menu";

export type ProjectListItemProps = {
  sx?: SxProps;
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProjectListItem(props: ProjectListItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  return (
    <ListItem
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        borderRadius: "8px",
        textTransform: "none",
        backgroundColor: "background.default",
        ...props.sx,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link style={{ width: "100%" }} to={`/projects/${props.project.id}`}>
        <Text
          sx={{ color: isHovered ? "secondary.main" : "text.primary" }}
          noWrap
        >
          {props.project.title}
        </Text>
        <Text sx={{ color: "text.secondary" }} noWrap>
          {props.project.description}
        </Text>
      </Link>
      <IconButton
        sx={{ color: "primary.main", "&:hover": { color: "primary.main" } }}
        onClick={(event) => setAnchorElement(event.currentTarget)}
      >
        <EllipsisVerticalIcon size="16px" />
      </IconButton>
      <ProjectMenu
        anchorElement={anchorElement}
        onEditProject={() => {
          setAnchorElement(null);
          props.onEdit();
        }}
        onDeleteProject={() => {
          setAnchorElement(null);
          props.onDelete();
        }}
        onClose={() => setAnchorElement(null)}
      />
    </ListItem>
  );
}

export function ProjectList(props: ListProps) {
  const { sx, ...rest } = props;

  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        margin: "0px",
        padding: "0px",
        ...sx,
      }}
      {...rest}
    />
  );
}
