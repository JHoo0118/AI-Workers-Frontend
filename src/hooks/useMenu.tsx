import { Menu, gridMenus } from "@/lib/data/menu";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export default function useMenu() {
  const locale = useLocale();
  const pathname = usePathname();
  const splittedPathname = pathname.split(locale);
  return gridMenus.find((menu: Menu) => splittedPathname[1] === menu.href)!;
}
