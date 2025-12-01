import { useTranslation } from "react-i18next";
import { DeleteDialog } from "../common/delete-dialog";

export type DeleteChatDialogProps = {
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteChatDialog(props: DeleteChatDialogProps) {
  const { t } = useTranslation();

  return (
    <DeleteDialog
      title={t("chat.title.delete_chat")}
      message={t("chat.message.delete_chat")}
      isOpen={props.isOpen}
      onDelete={props.onDelete}
      onCancel={props.onCancel}
    />
  );
}
