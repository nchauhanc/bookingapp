import { enUS } from "date-fns/locale/en-US";
import { sv } from "date-fns/locale/sv";

export function getDateLocale(locale: string) {
  return locale === "sv" ? sv : enUS;
}
