import { Preloader } from "@/components/shell/Preloader";
import { Navbar } from "@/components/shell/Navbar";
import { Footer } from "@/components/shell/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { WorkGallery } from "@/components/sections/WorkGallery";
import { RepoCardsPanel } from "@/components/work/RepoCards";
import { AwardsSection } from "@/components/sections/AwardsSection";
import { Beyond } from "@/components/sections/Beyond";
import { Contact } from "@/components/sections/Contact";
import { JsonLd } from "@/components/seo/JsonLd";

/**
 * The single-page experience: Preloader → Nav → Hero → About → Skills →
 * Experience → Work → Awards → Beyond → Contact → Footer (§5).
 */
export default function Home() {
  return (
    <>
      <JsonLd />
      <Preloader />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <WorkGallery />
        <RepoCardsPanel />
        <AwardsSection />
        <Beyond />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
