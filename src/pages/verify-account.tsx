import { Box, useTheme } from "@mui/material";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { ErrorAlert, InfoAlert, SuccessAlert } from "../components/ui/alert";
import { ShadowButton } from "../components/ui/button";
import { Link } from "../components/ui/link";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Span, Text } from "../components/ui/text";
import { config } from "../config";
import { useVerifyAccount } from "../hooks/auth";
import { useErrorStore } from "../state/error";
import { ApplicationError, ApplicationErrorCode } from "../utils/errors";

export function VerifyAccountPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { t } = useTranslation();
  const theme = useTheme();

  const displayError = useErrorStore((state) => state.displayError);

  const [result, setResult] = useState<"success" | "invalid-token" | null>(
    null
  );

  const { mutate: verifyAccount, isPending } = useVerifyAccount();

  function handleVerifyAccount() {
    if (token != null) {
      verifyAccount(
        { request: { token } },
        {
          onSuccess: () => setResult("success"),
          onError: (error) => {
            const applicationError = ApplicationError.copy(error);

            if (
              applicationError.code ===
              ApplicationErrorCode.InvalidAccountVerificationToken
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
        height: "100dvh",
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
            {t("auth.text.already_have_account")}{" "}
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
            <Trans
              i18nKey="auth.message.account_verified"
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
              i18nKey="auth.error.invalid_account_verification_link"
              components={{
                Link: (
                  <Link
                    style={{
                      fontWeight: "bold",
                      color: theme.palette.error.main,
                    }}
                    to="/signin"
                  />
                ),
              }}
            />
          </ErrorAlert>
        )}
        <Text>{t("auth.text.verify_account")}</Text>
        <ShadowButton onClick={handleVerifyAccount} disabled>
          {t("auth.button.verify_account")}
        </ShadowButton>
        <Text>{t("auth.text.dismiss_account_verification")}</Text>
      </Box>
      <LoadingBackdrop isLoading={isPending} />
    </Box>
  );
}
