import ClientsSection from "@/components/sections/ClientsSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import HighlightProjectSection from "@/components/sections/HighlightProjectSection";
import ShowreelSection from "@/components/sections/ShowreelSection";
import HomeBannerSection from "@/components/sections/HomeBannerSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <HomeBannerSection />
      <ShowreelSection />
      <HighlightProjectSection />
      <FeaturedProjectsSection />
      <ServicesSection />
      <ClientsSection />
      <Footer />
    </>
  );
}
