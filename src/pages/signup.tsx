import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { ContainedButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from "../components/ui/link";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
import { useSignup } from "../hooks/auth";

const signupFormSchema = z.object({
  name: z.string().min(1, "name_is_required"),
  email: z.email("invalid_email_address").min(1, "email_is_required"),
  password: z.string().min(6, "password_must_be_at_least_6_characters_long"),
});

type SignupFormSchema = z.infer<typeof signupFormSchema>;

export function SignupPage() {
  const { t } = useTranslation();

  const [isInvalidEmailOrPassword, setIsInvalidEmailOrPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormSchema>({
    resolver: zodResolver(signupFormSchema),
  });

  const { mutate: signup, isPending } = useSignup(setIsInvalidEmailOrPassword);

  function onSubmit(formValues: SignupFormSchema) {
    signup({ request: formValues });
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
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
            AI CHAT
          </Text>
          <Text sx={{ marginTop: "8px" }}>
            {t("already_have_an_account")}{" "}
            <Link to="/signin">{t("sign_in")}</Link>
          </Text>
        </Box>
        {isInvalidEmailOrPassword && (
          <Text sx={{ color: "error.main" }} variant="caption">
            {t("invalid_email_or_password")}
          </Text>
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
              <Label htmlFor="name">{t("name")}</Label>
              <Input placeholder={t("name")} {...register("name")} />
              {errors.name != null && (
                <Text variant="caption" color="error">
                  {t(errors.name.message!)}
                </Text>
              )}
            </FormControl>
            <FormControl>
              <Label htmlFor="email">{t("email")}</Label>
              <Input placeholder={t("email")} {...register("email")} />
              {errors.email != null && (
                <Text variant="caption" color="error">
                  {t(errors.email.message!)}
                </Text>
              )}
            </FormControl>
            <FormControl>
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                type="password"
                placeholder={t("password")}
                {...register("password")}
              />
              {errors.password != null && (
                <Text variant="caption" color="error">
                  {t(errors.password.message!)}
                </Text>
              )}
            </FormControl>
            <ContainedButton sx={{ marginTop: "16px" }} type="submit">
              {t("sign_up")}
            </ContainedButton>
          </Box>
        </form>
        <Text sx={{ textAlign: "center" }}>
          {t("by_continuing_you_agree_to_our")} <br />{" "}
          <Link to="#">{t("terms_of_usage")}</Link>
          {` ${t("and")} `}
          <Link to="#">{t("privacy_policy")}</Link>.
        </Text>
      </Box>
      <LoadingBackdrop isLoading={isPending} />
    </Box>
  );
}
