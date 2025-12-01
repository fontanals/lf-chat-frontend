import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { ErrorAlert, SuccessAlert } from "../components/ui/alert";
import { ContainedButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from "../components/ui/link";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
import { useRecoverPassword } from "../hooks/auth";
import { useErrorStore } from "../state/error";
import { ApplicationError, ApplicationErrorCode } from "../utils/errors";

const recoverPasswordFormSchema = z.object({
  email: z
    .email("auth.error.email_invalid")
    .min(1, "auth.error.email_required"),
});

type RecoverPasswordFormSchema = z.infer<typeof recoverPasswordFormSchema>;

export function RecoverPasswordPage() {
  const { t } = useTranslation();

  const displayError = useErrorStore((state) => state.displayError);

  const [result, setResult] = useState<null | "success" | "invalid-email">(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPasswordFormSchema>({
    resolver: zodResolver(recoverPasswordFormSchema),
  });

  const { mutate: recoverPassword, isPending } = useRecoverPassword();

  function onSubmit(formValues: RecoverPasswordFormSchema) {
    recoverPassword(
      { request: formValues },
      {
        onSuccess: () => setResult("success"),
        onError: (error) => {
          const applicationError = ApplicationError.copy(error);

          if (
            applicationError.code ===
            ApplicationErrorCode.InvalidEmailOrPassword
          ) {
            setResult("invalid-email");
            return;
          }

          displayError(applicationError);
        },
      }
    );
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
          <Text sx={{ marginTop: "8px" }}>
            {t("auth.text.no_account")}{" "}
            <Link to="/signup">{t("auth.link.signup")}</Link>
          </Text>
        </Box>
        {result === "success" && (
          <SuccessAlert>{t("auth.message.recovery_email_sent")}</SuccessAlert>
        )}
        {result === "invalid-email" && (
          <ErrorAlert>{t("auth.error.email_invalid")}</ErrorAlert>
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
              <Label htmlFor="email">{t("auth.field.email")}</Label>
              <Input
                id="email"
                placeholder={t("auth.field.email")}
                {...register("email")}
              />
              {errors.email != null && (
                <Typography variant="caption" color="error">
                  {t(errors.email.message as any)}
                </Typography>
              )}
            </FormControl>
            <ContainedButton sx={{ marginTop: "16px" }} type="submit">
              {t("auth.button.recover_password")}
            </ContainedButton>
          </Box>
        </form>
      </Box>
      <LoadingBackdrop isLoading={isPending} />
    </Box>
  );
}
