import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { ContainedButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from "../components/ui/link";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
import { useSignin } from "../hooks/auth";

const signinFormSchema = z.object({
  email: z.email("invalid_email_address").min(1, "email_is_required"),
  password: z.string().min(1, "password_is_required"),
});

type SigninFormSchema = z.infer<typeof signinFormSchema>;

export function SigninPage() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormSchema>({
    resolver: zodResolver(signinFormSchema),
  });

  const { mutate: signin, isPending } = useSignin();

  function onSubmit(formValues: SigninFormSchema) {
    signin({ request: formValues });
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
            {t("dont_have_an_account")} <Link to="/signup">{t("sign_up")}</Link>
          </Text>
        </Box>
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
              <Label htmlFor="email">{t("email")}</Label>
              <Input placeholder={t("email")} {...register("email")} />
              {errors.email != null && (
                <Typography variant="caption" color="error">
                  {t(errors.email.message!)}
                </Typography>
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
              {t("sign_in")}
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
