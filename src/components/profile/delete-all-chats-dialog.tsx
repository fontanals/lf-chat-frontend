import { useTranslation } from "react-i18next";
import { DeleteDialog } from "../common/delete-dialog";

export type DeleteAllChatsDialogProps = {
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteAllChatsDialog(props: DeleteAllChatsDialogProps) {
  const { t } = useTranslation();

  return (
    <DeleteDialog
      title={t("profile.title.delete_all_chats")}
      message={t("profile.message.delete_all_chats")}
      isOpen={props.isOpen}
      onDelete={props.onDelete}
      onCancel={props.onCancel}
    />
  );
}
