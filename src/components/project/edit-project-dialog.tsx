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
import { PencilIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { Project } from "../../models/entities/project";
import { ShadowButton } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Text } from "../ui/text";

const editProjectFormSchema = z.object({
  title: z.string().min(1, "title_is_required"),
  description: z.string(),
});

export type EditProjectFormSchema = z.infer<typeof editProjectFormSchema>;

export type EditProjectDialogProps = {
  isOpen: boolean;
  project?: Project | null;
  onEditProject: (values: EditProjectFormSchema) => void;
  onCancel: () => void;
};

export function EditProjectDialog(props: EditProjectDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditProjectFormSchema>({
    resolver: zodResolver(editProjectFormSchema),
    defaultValues: {
      title: props.project?.title ?? "",
      description: props.project?.description ?? "",
    },
  });

  useEffect(() => {
    setValue("title", props.project?.title ?? "");
    setValue("description", props.project?.description ?? "");
  }, [props.project]);

  function onSubmit(formValues: EditProjectFormSchema) {
    props.onEditProject(formValues);
  }

  return (
    <Dialog
      slotProps={{
        paper: {
          sx: {
            minWidth: { xs: undefined, sm: "500px" },
            borderRadius: "16px",
          },
        },
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
        <ShadowButton color="primary" onClick={props.onCancel}>
          {t("cancel")}
        </ShadowButton>
        <ShadowButton type="submit" form="edit-project-form">
          <PencilIcon size="16px" />
          {t("edit")}
        </ShadowButton>
      </DialogActions>
    </Dialog>
  );
}
