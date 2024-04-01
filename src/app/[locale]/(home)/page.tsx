import Footer from "@/components/Footer/Footer";
import GridMenuItem from "@/components/GridMenuItem";
import HomeFreeSection from "@/components/Home/HomeFreeSection";
import HomeProsSection from "@/components/Home/HomeProsSection";
import HomeText from "@/components/Home/HomeText";
import { gridMenus } from "@/lib/data/menu";

export default function Home() {
  return (
    <>
      <section className="mx-auto flex w-full max-w-screen-2xl flex-col p-4 py-8 pb-8 sm:pb-20">
        <HomeText />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {gridMenus.map((gridMenu) => (
            <GridMenuItem menu={gridMenu} key={gridMenu.id} />
          ))}
        </div>
      </section>
      <HomeProsSection />
      <HomeFreeSection />
      <Footer />
    </>
  );
}
