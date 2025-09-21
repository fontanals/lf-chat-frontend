import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import "./localization/i18n";
import { queryClient } from "./query-client";
import { router } from "./routes/router";
import { useThemeStore } from "./state/theme";
import { darkTheme } from "./themes/dark";
import { lightTheme } from "./themes/light";

export function App() {
  const theme = useThemeStore((state) => state.theme);
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const selectedTheme =
    theme === "dark" || (theme === "system" && prefersDark)
      ? darkTheme
      : lightTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={selectedTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
