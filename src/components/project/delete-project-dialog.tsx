import { useTranslation } from "react-i18next";
import { Project } from "../../models/entities/project";
import { DeleteDialog } from "../common/delete-dialog";

export type DeleteProjectDialogProps = {
  isOpen: boolean;
  project?: Project | null;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteProjectDialog(props: DeleteProjectDialogProps) {
  const { t } = useTranslation();

  return (
    <DeleteDialog
      title={t("project.title.delete_project")}
      message={t("project.message.delete_project", {
        title: props.project?.title ?? "",
      })}
      isOpen={props.isOpen}
      onDelete={props.onDelete}
      onCancel={props.onCancel}
    />
  );
}
