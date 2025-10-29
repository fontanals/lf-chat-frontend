import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  alpha,
} from "@mui/material";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { ShadowButton } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Text } from "../ui/text";

const createProjectFormSchema = z.object({
  title: z.string().min(1, "title_is_required"),
  description: z.string(),
});

export type CreateProjectFormSchema = z.infer<typeof createProjectFormSchema>;

export type CreateProjectDialogProps = {
  isOpen: boolean;
  onCreateProject: (values: CreateProjectFormSchema) => void;
  onCancel: () => void;
};

export function CreateProjectDialog(props: CreateProjectDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormSchema>({
    resolver: zodResolver(createProjectFormSchema),
  });

  function onSubmit(formValues: CreateProjectFormSchema) {
    props.onCreateProject(formValues);
  }

  return (
    <Dialog
      slotProps={{
        paper: { sx: { width: "100%", borderRadius: "16px" } },
        backdrop: {
          sx: {
            backgroundColor: (theme) =>
              alpha(theme.palette.secondary.main, 0.3),
          },
        },
      }}
      open={props.isOpen}
      onClose={props.onCancel}
    >
      <DialogTitle sx={{ padding: "16px" }} variant="body1">
        {t("edit_project")}
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <form id="edit-project-form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <FormControl>
              <Label htmlFor="title">{t("title")}</Label>
              <Input placeholder={t("title")} {...register("title")} />
              {errors.title != null && (
                <Text variant="caption" color="error">
                  {t(errors.title.message!)}
                </Text>
              )}
            </FormControl>
            <FormControl>
              <Label htmlFor="description">{t("description")}</Label>
              <Input
                placeholder={t("description")}
                multiline
                rows={3}
                {...register("description")}
              />
            </FormControl>
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <ShadowButton primary onClick={props.onCancel}>
          {t("cancel")}
        </ShadowButton>
        <ShadowButton type="submit" form="edit-project-form">
          <PlusIcon size="16px" />
          {t("create_project")}
        </ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
