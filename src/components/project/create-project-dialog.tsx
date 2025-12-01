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
  title: z.string().min(1, "project.error.title_required"),
  description: z.string(),
});

export type CreateProjectFormSchema = z.infer<typeof createProjectFormSchema>;

export type CreateProjectDialogProps = {
  isOpen: boolean;
  onCreate: (values: CreateProjectFormSchema) => void;
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
    props.onCreate(formValues);
  }

  return (
    <Dialog
      slotProps={{
        paper: { sx: { width: "100%", borderRadius: "16px" } },
        backdrop: {
          sx: {
            backgroundColor: (theme) =>
              alpha(theme.palette.secondary.main, 0.2),
          },
        },
      }}
      open={props.isOpen}
      onClose={props.onCancel}
    >
      <DialogTitle sx={{ padding: "16px" }} variant="body1">
        {t("project.title.create_project")}
      </DialogTitle>
      <DialogContent sx={{ padding: "16px", paddingBottom: "0px" }}>
        <form id="edit-project-form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <FormControl>
              <Label htmlFor="title">{t("project.field.title")}</Label>
              <Input
                placeholder={t("project.field.title")}
                {...register("title")}
              />
              {errors.title != null && (
                <Text variant="caption" color="error">
                  {t(errors.title.message as any)}
                </Text>
              )}
            </FormControl>
            <FormControl>
              <Label htmlFor="description">
                {t("project.field.description")}
              </Label>
              <Input
                placeholder={t("project.field.description")}
                multiline
                rows={3}
                {...register("description")}
              />
            </FormControl>
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <ShadowButton color="primary" onClick={props.onCancel}>
          {t("project.button.cancel")}
        </ShadowButton>
        <ShadowButton type="submit" form="edit-project-form">
          <PlusIcon size="16px" />
          {t("project.button.create_project")}
        </ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
