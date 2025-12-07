import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl } from "@mui/material";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import z from "zod";
import { ErrorAlert, InfoAlert, SuccessAlert } from "../components/ui/alert";
import { ContainedButton, IconButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from "../components/ui/link";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Span, Text } from "../components/ui/text";
import { config } from "../config";
import { useSignup } from "../hooks/auth";
import { useErrorStore } from "../state/error";
import { ApplicationError, ApplicationErrorCode } from "../utils/errors";

const signupFormSchema = z.object({
  name: z.string().min(1, "auth.error.name_required"),
  email: z
    .email("auth.error.email_invalid")
    .min(1, "auth.error.email_required"),
  password: z.string().min(6, "auth.error.password_min_length"),
});

type SignupFormSchema = z.infer<typeof signupFormSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayError = useErrorStore((state) => state.displayError);

  const [result, setResult] = useState<"success" | "invalid-email" | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormSchema>({
    resolver: zodResolver(signupFormSchema),
  });

  const { mutate: signup, isPending } = useSignup();

  function onSubmit(formValues: SignupFormSchema) {
    signup(
      { request: formValues },
      {
        onSuccess: () => {
          setResult("success");

          if (config.VITE_SERVICE_TYPE === "mock") {
            navigate("/verify-account?token=abc");
          }
        },
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
            <Span>{t("auth.text.already_have_account")}</Span>{" "}
            <Link to="/signin">{t("auth.link.signin")}</Link>
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
        {result === "success" && (
          <SuccessAlert>
            {t("auth.message.verification_email_sent")}
          </SuccessAlert>
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
              <Label htmlFor="name">{t("auth.field.name")}</Label>
              <Input
                id="name"
                placeholder={t("auth.field.name")}
                {...register("name")}
              />
              {errors.name != null && (
                <Text variant="caption" color="error">
                  {t(errors.name.message as any)}
                </Text>
              )}
            </FormControl>
            <FormControl>
              <Label htmlFor="email">{t("auth.field.email")}</Label>
              <Input
                id="email"
                placeholder={t("auth.field.email")}
                {...register("email")}
              />
              {errors.email != null && (
                <Text variant="caption" color="error">
                  {t(errors.email.message as any)}
                </Text>
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
            <ContainedButton sx={{ marginTop: "16px" }} type="submit" disabled>
              {t("auth.button.signup")}
            </ContainedButton>
          </Box>
        </form>
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
