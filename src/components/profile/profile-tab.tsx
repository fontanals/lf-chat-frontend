import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl } from "@mui/material";
import { PencilIcon, SaveIcon, UserIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { useUpdateUser } from "../../hooks/user";
import { User } from "../../models/entities/user";
import { StringUtils } from "../../utils/strings";
import { ShadowButton } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Text } from "../ui/text";

const profileFormSchema = z.object({
  name: z.string().min(1, "name_is_required"),
  displayName: z.string().optional(),
  customPrompt: z.string().optional(),
});

type ProfileFormSchema = z.infer<typeof profileFormSchema>;

export type ProfileTabProps = {
  user: User;
};

export function ProfileTab(props: ProfileTabProps) {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormSchema>({
    defaultValues: {
      name: props.user.name,
      displayName: props.user.displayName,
      customPrompt: props.user.customPrompt ?? "",
    },
    resolver: zodResolver(profileFormSchema),
  });

  const { mutate: updateUser } = useUpdateUser();

  function onSubmit(formValues: ProfileFormSchema) {
    setIsEditing(false);

    if (StringUtils.isNullOrWhitespace(formValues.displayName)) {
      formValues.displayName = formValues.name.split(" ")[0];
    }

    updateUser({ request: formValues });
  }

  function handleCancel() {
    setIsEditing(false);
    setValue("name", props.user.name);
    setValue("displayName", props.user.displayName);
    setValue("customPrompt", props.user.customPrompt ?? "");
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
        <UserIcon size="20px" />
        <Text variant="body1">{t("profile")}</Text>
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
          <FormControl>
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              placeholder={t("name")}
              {...register("name")}
              disabled={!isEditing}
            />
            {errors.name != null && (
              <Text variant="caption" color="error">
                {t(errors.name.message!)}
              </Text>
            )}
          </FormControl>
          <FormControl>
            <Label htmlFor="display-name">
              {t("how_the_assistant_should_address_you")}
            </Label>
            <Input
              id="display-name"
              placeholder={t("display_name")}
              {...register("displayName")}
              disabled={!isEditing}
            />
          </FormControl>
          <FormControl>
            <Label htmlFor="preferences">
              {t("personal_preferences_to_share_with_assistant")}
            </Label>
            <Input
              id="preferences"
              placeholder={t("preferences")}
              multiline
              rows={3}
              {...register("customPrompt")}
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
                {t("save_changes")}
              </ShadowButton>
            </Fragment>
          ) : (
            <ShadowButton type="button" onClick={() => setIsEditing(true)}>
              <PencilIcon size="16px" />
              {t("edit")}
            </ShadowButton>
          )}
        </Box>
      </form>
    </Box>
  );
}
