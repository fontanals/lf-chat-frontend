import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditIcon, SaveIcon, UserIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { User } from "../../models/entities/user";
import { UpdateUserRequest } from "../../models/requests/user";
import { services } from "../../services/provider";
import { ShadowButton } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Text } from "../ui/text";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  displayName: z.string().optional(),
  customPreferences: z.string().optional(),
});

type ProfileFormSchema = z.infer<typeof profileFormSchema>;

export type ProfileTabProps = {
  user: User;
};

export function ProfileTab(props: ProfileTabProps) {
  const queryClient = useQueryClient();

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
      customPreferences: props.user.customPreferences ?? "",
    },
    resolver: zodResolver(profileFormSchema),
  });

  const { mutate: updateUser } = useMutation({
    mutationFn: (args: { request: UpdateUserRequest }) =>
      services.user.updateUser(args.request),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  function onSubmit(formValues: ProfileFormSchema) {
    updateUser({ request: formValues });
  }

  function handleCancel() {
    setIsEditing(false);
    setValue("name", props.user.name);
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "32px",
        }}
      >
        <UserIcon size="20px" />
        <Text variant="body1">Profile</Text>
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              {...register("name")}
              disabled={!isEditing}
            />
            {errors.name != null && (
              <Text variant="caption" color="error">
                {errors.name.message}
              </Text>
            )}
          </FormControl>
          <FormControl>
            <Label htmlFor="display-name">
              How the assistant should call you
            </Label>
            <Input
              id="display-name"
              placeholder="Name"
              {...register("displayName")}
              disabled={!isEditing}
            />
          </FormControl>
          <FormControl>
            <Label htmlFor="preferences">
              Personal preferences to share with assistant
            </Label>
            <Input
              id="preferences"
              placeholder="Preferences"
              multiline
              rows={3}
              {...register("customPreferences")}
              disabled={!isEditing}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          {isEditing ? (
            <Fragment>
              <ShadowButton type="button" primary onClick={handleCancel}>
                Cancel
              </ShadowButton>
              <ShadowButton type="submit">
                <SaveIcon size="16px" />
                Save Changes
              </ShadowButton>
            </Fragment>
          ) : (
            <ShadowButton type="button" onClick={() => setIsEditing(true)}>
              <EditIcon size="16px" />
              Edit
            </ShadowButton>
          )}
        </Box>
      </form>
    </Box>
  );
}
