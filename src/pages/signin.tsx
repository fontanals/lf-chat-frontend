import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import z from "zod";
import { ErrorAlert, InfoAlert } from "../components/ui/alert";
import { ContainedButton, IconButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from "../components/ui/link";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Span, Text } from "../components/ui/text";
import { config } from "../config";
import { useSignin } from "../hooks/auth";
import { GetUserResponse } from "../models/responses/user";
import { useErrorStore } from "../state/error";
import { ApplicationError, ApplicationErrorCode } from "../utils/errors";

const signinFormSchema = z.object({
  email: z
    .email("auth.error.email_invalid")
    .min(1, "auth.error.email_required"),
  password: z.string().min(1, "auth.error.password_required"),
});

type SigninFormSchema = z.infer<typeof signinFormSchema>;

export function SigninPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const displayError = useErrorStore((state) => state.displayError);

  const [showPassword, setShowPassword] = useState(false);
  const [showInvalidEmailOrPasswordError, setShowInvalidEmailOrPasswordError] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormSchema>({
    resolver: zodResolver(signinFormSchema),
  });

  const { mutate: signin, isPending } = useSignin();

  function onSubmit(formValues: SigninFormSchema) {
    signin(
      { request: formValues },
      {
        onSuccess: (response) => {
          queryClient.setQueryData<GetUserResponse>(["user"], response.user);

          navigate("/new");
        },
        onError: (error) => {
          const applicationError = ApplicationError.copy(error);

          if (
            applicationError.code ===
            ApplicationErrorCode.InvalidEmailOrPassword
          ) {
            setShowInvalidEmailOrPasswordError(true);
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
        <InfoAlert>
          <Trans
            i18nKey="auth.message.use_demo_account"
            values={{
              email: config.VITE_DEMO_ACCOUNT_EMAIL,
              password: config.VITE_DEMO_ACCOUNT_PASSWORD,
            }}
            components={{
              Link: <Link style={{ fontWeight: "bold" }} to="/signin" />,
              Bold: <Span sx={{ fontWeight: "bold" }} />,
            }}
          />
        </InfoAlert>
        {showInvalidEmailOrPasswordError && (
          <ErrorAlert>{t("auth.error.email_or_password_invalid")}</ErrorAlert>
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
            <FormControl>
              <Label htmlFor="password">{t("auth.field.password")}</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.field.password")}
                {...register("password")}
                endAdornment={
                  <IconButton
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeIcon size="16px" />
                    ) : (
                      <EyeOffIcon size="16px" />
                    )}
                  </IconButton>
                }
              />
              {errors.password != null && (
                <Text variant="caption" color="error">
                  {t(errors.password.message as any)}
                </Text>
              )}
            </FormControl>
            <ContainedButton sx={{ marginTop: "16px" }} type="submit">
              {t("auth.button.signin")}
            </ContainedButton>
          </Box>
        </form>
        <Link to="/recover-password">{t("auth.link.forgot_password")}</Link>
        <Text sx={{ textAlign: "center" }}>
          <Trans
            i18nKey="auth.text.terms"
            components={{
              br: <br />,
              TermsOfUseLink: <Link to="/terms-of-use" />,
              PrivacyPolicyLink: <Link to="/privacy-policy" />,
            }}
          />
        </Text>
      </Box>
      <LoadingBackdrop isLoading={isPending} />
    </Box>
  );
}
