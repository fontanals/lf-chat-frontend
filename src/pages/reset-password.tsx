import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl, Typography, useTheme } from "@mui/material";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import z from "zod";
import { ErrorAlert, SuccessAlert } from "../components/ui/alert";
import { ContainedButton, IconButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from "../components/ui/link";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
import { useResetPassword } from "../hooks/auth";
import { useErrorStore } from "../state/error";
import { ApplicationError, ApplicationErrorCode } from "../utils/errors";

const resetPasswordFormSchema = z
  .object({
    newPassword: z.string().min(1, "auth.error.new_password_required"),
    confirmNewPassword: z
      .string()
      .min(1, "auth.error.confirm_password_required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "auth.error.confirm_password_no_match",
    path: ["confirmNewPassword"],
  });

type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>;

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { t } = useTranslation();
  const theme = useTheme();

  const displayError = useErrorStore((state) => state.displayError);

  const [result, setResult] = useState<"success" | "invalid-token" | null>(
    null
  );
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const { mutate: resetPassword, isPending } = useResetPassword();

  function onSubmit(formValues: ResetPasswordFormSchema) {
    if (token != null) {
      resetPassword(
        { request: { token, newPassword: formValues.newPassword } },
        {
          onSuccess: () => {
            setResult("success");
            reset({ newPassword: "", confirmNewPassword: "" });
          },
          onError: (error) => {
            const applicationError = ApplicationError.copy(error);

            if (
              applicationError.code ===
              ApplicationErrorCode.InvalidPasswordRecoveryToken
            ) {
              setResult("invalid-token");
              return;
            }

            displayError(applicationError);
          },
        }
      );
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          width: { xs: "80vw", sm: "40vw", lg: "30vw" },
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Text
            sx={{ fontWeight: "bold", color: "secondary.main" }}
            variant="h4"
          >
            LF CHAT
          </Text>
        </Box>
        {result === "success" && (
          <SuccessAlert>
            <Trans
              i18nKey="auth.message.password_reset"
              components={{
                Link: (
                  <Link
                    style={{
                      fontWeight: "bold",
                      color: theme.palette.success.main,
                    }}
                    to="/signin"
                  />
                ),
              }}
            />
          </SuccessAlert>
        )}
        {(result === "invalid-token" || token == null) && (
          <ErrorAlert>
            <Trans
              i18nKey="auth.error.invalid_password_reset_link"
              components={{
                Link: (
                  <Link
                    style={{
                      fontWeight: "bold",
                      color: theme.palette.error.main,
                    }}
                    to="/recover-password"
                  />
                ),
              }}
            />
          </ErrorAlert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: { xs: "80vw", sm: "40vw", lg: "30vw" },
            }}
          >
            <FormControl>
              <Label htmlFor="new-password">
                {t("auth.field.new_password")}
              </Label>
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder={t("auth.field.new_password")}
                {...register("newPassword")}
                endAdornment={
                  <IconButton
                    onClick={() =>
                      setShowNewPassword((showNewPassword) => !showNewPassword)
                    }
                  >
                    {showNewPassword ? (
                      <EyeIcon size="16px" />
                    ) : (
                      <EyeOffIcon size="16px" />
                    )}
                  </IconButton>
                }
              />
              {errors.newPassword != null && (
                <Typography variant="caption" color="error">
                  {t(errors.newPassword.message as any)}
                </Typography>
              )}
            </FormControl>
            <FormControl>
              <Label htmlFor="confirm-new-password">
                {t("auth.field.confirm_password")}
              </Label>
              <Input
                id="confirm-new-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("auth.field.confirm_password")}
                {...register("confirmNewPassword")}
                endAdornment={
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(
                        (showConfirmPassword) => !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeIcon size="16px" />
                    ) : (
                      <EyeOffIcon size="16px" />
                    )}
                  </IconButton>
                }
              />
              {errors.confirmNewPassword != null && (
                <Typography variant="caption" color="error">
                  {t(errors.confirmNewPassword.message as any)}
                </Typography>
              )}
            </FormControl>
            <ContainedButton sx={{ marginTop: "16px" }} type="submit">
              {t("auth.button.reset_password")}
            </ContainedButton>
          </Box>
        </form>
      </Box>
      <LoadingBackdrop isLoading={isPending} />
    </Box>
  );
}
