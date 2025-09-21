import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { LocalStorageUtils } from "../utils/local-storage";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: { loadPath: "/locales/{{lng}}.json" },
    fallbackLng: LocalStorageUtils.getItem("language", "en"),
    interpolation: { escapeValue: false },
  });

i18n.on("languageChanged", (language) => {
  LocalStorageUtils.setItem("language", language);
});
