import { useTranslation } from "react-i18next";
import { DeleteDialog } from "../common/delete-dialog";

export type DeleteAccountDialogProps = {
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteAccountDialog(props: DeleteAccountDialogProps) {
  const { t } = useTranslation();

  return (
    <DeleteDialog
      title={t("profile.title.delete_account")}
      message={t("profile.message.delete_account")}
      isOpen={props.isOpen}
      onDelete={props.onDelete}
      onCancel={props.onCancel}
    />
  );
}
