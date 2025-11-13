import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl } from "@mui/material";
import { LockIcon, PencilIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { useChangePassword, useDeleteUser } from "../../hooks/user";
import { ShadowButton } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Text } from "../ui/text";
import { DeleteAccountDialog } from "./delete-account-dialog";

const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, "current_password_is_required"),
  newPassword: z.string().min(8, "new_password_must_be_at_least_8_characters"),
  confirmNewPassword: z.string().min(1, "please_confirm_your_new_password"),
});

type ChangePasswordFormSchema = z.infer<typeof changePasswordFormSchema>;

export function SecurityTab() {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  const { mutate: changePassword } = useChangePassword(setIsInvalidPassword);
  const { mutate: deleteUser } = useDeleteUser();

  function onSubmit(formValues: ChangePasswordFormSchema) {
    setIsEditing(false);
    changePassword({ request: formValues });
  }

  function handleCancel() {
    setIsEditing(false);
    setValue("currentPassword", "");
    setValue("newPassword", "");
    setValue("confirmNewPassword", "");
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "800px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "32px",
        }}
      >
        <LockIcon size="20px" />
        <Text variant="body1">{t("security")}</Text>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "16px",
            marginBottom: "24px",
          }}
        >
          {isInvalidPassword && (
            <Text sx={{ color: "error.main" }} variant="caption">
              {t("invalid_current_password")}
            </Text>
          )}
          <FormControl>
            <Label htmlFor="current-password">{t("current_password")}</Label>
            <Input
              id="current-password"
              placeholder={t("current_password")}
              {...register("currentPassword")}
              disabled={!isEditing}
            />
            {errors.currentPassword != null && (
              <Text variant="caption" color="error">
                {t(errors.currentPassword.message!)}
              </Text>
            )}
          </FormControl>
          <FormControl>
            <Label htmlFor="new-password">{t("new_password")}</Label>
            <Input
              id="new-password"
              placeholder={t("new_password")}
              {...register("newPassword")}
              disabled={!isEditing}
            />
            {errors.newPassword != null && (
              <Text variant="caption" color="error">
                {t(errors.newPassword.message!)}
              </Text>
            )}
          </FormControl>
          <FormControl>
            <Label htmlFor="confirm-new-password">
              {t("confirm_new_password")}
            </Label>
            <Input
              id="confirm-new-password"
              placeholder={t("confirm_new_password")}
              {...register("confirmNewPassword")}
              disabled={!isEditing}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          {isEditing ? (
            <Fragment>
              <ShadowButton
                type="button"
                color="primary"
                onClick={handleCancel}
              >
                {t("cancel")}
              </ShadowButton>
              <ShadowButton type="submit">
                <SaveIcon size="16px" />
                {t("change_password")}
              </ShadowButton>
            </Fragment>
          ) : (
            <Fragment>
              <ShadowButton
                type="button"
                color="error"
                onClick={() => setIsDeleteAccountDialogOpen(true)}
              >
                <Trash2Icon size="16px" />
                {t("delete_account")}
              </ShadowButton>
              <ShadowButton type="button" onClick={() => setIsEditing(true)}>
                <PencilIcon size="16px" />
                {t("change_password")}
              </ShadowButton>
            </Fragment>
          )}
        </Box>
      </form>
      <DeleteAccountDialog
        isOpen={isDeleteAccountDialogOpen}
        onDeleteAccount={deleteUser}
        onCancel={() => setIsDeleteAccountDialogOpen(false)}
      />
    </Box>
  );
}
