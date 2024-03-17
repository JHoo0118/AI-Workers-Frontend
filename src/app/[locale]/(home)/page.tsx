import Footer from "@/components/Footer/Footer";
import GridMenuItem from "@/components/GridMenuItem";
import HomeText from "@/components/Home/HomeText";
import { gridMenus } from "@/lib/data/menu";

export default function Home() {
  return (
    <>
      <section className="mx-auto flex w-full max-w-screen-2xl flex-col p-4 pt-8">
        <HomeText />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {gridMenus.map((gridMenu) => (
            <GridMenuItem menu={gridMenu} key={gridMenu.id} />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
