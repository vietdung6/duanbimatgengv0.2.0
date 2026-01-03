import * as en from './locales/en';
import * as vi from './locales/vi';

export const translations = {
  en,
  vi,
};

export type Language = "en" | "vi";
export type TranslationKey = typeof translations.en;
