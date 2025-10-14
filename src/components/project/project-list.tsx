import { Box, List, ListItem, ListProps, SxProps } from "@mui/material";
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
    <Link to={`/projects/${props.project.id}`}>
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
        <Box sx={{ width: "80%" }}>
          <Text
            sx={{ color: isHovered ? "secondary.main" : "text.primary" }}
            noWrap
          >
            {props.project.title}
          </Text>
          <Text sx={{ color: "text.secondary" }} noWrap>
            {props.project.description}
          </Text>
        </Box>
        <IconButton
          sx={{ color: "primary.main", "&:hover": { color: "primary.main" } }}
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
          onEditProject={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setAnchorElement(null);
            props.onEdit();
          }}
          onDeleteProject={(event) => {
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
