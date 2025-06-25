
import { navItems } from "../../data";
import Approach from "./components/Approach";
import Clients from "./components/Clients";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import dynamic from "next/dynamic";
const Grid = dynamic(() => import("./components/Grid"), { ssr: false });
import Stack from "./components/Stack";
import { FloatingNav } from "./components/ui/FloatingNav";
import RecentProjects from "./components/RecentProjects";



export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        {/* <Menu setActive= "menu" /> */}
        <Hero />
        <Grid />
        <Stack />
          <RecentProjects /> 
        <Clients /> 
        <Experience />
        <Approach />
        <Footer />
      </div>
    </main>
  );
} 

