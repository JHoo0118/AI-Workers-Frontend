import { Menu, gridMenus } from "@/lib/data/menu";

export default function useMenu(path: string) {
  return gridMenus.find((menu: Menu) => {
    return path === menu.href;
  })!;
}
