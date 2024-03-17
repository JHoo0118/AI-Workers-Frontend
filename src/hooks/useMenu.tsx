import { Menu, gridMenus } from "@/lib/data/menu";

export default function useMenu(path: string) {
  return gridMenus.find((menu: Menu) => {
    return path.indexOf(menu.href) !== -1;
  })!;
}
