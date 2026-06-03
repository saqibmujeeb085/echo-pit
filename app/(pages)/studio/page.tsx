import Footer from "@/components/layout/Footer";
import StudioHeroSection from "@/components/sections/studio/StudioHeroSection";
import StudioHomiesSection from "@/components/sections/studio/StudioHomiesSection";
import StudioInternshipSection from "@/components/sections/studio/StudioInternshipSection";
import StudioLifeSection from "@/components/sections/studio/StudioLifeSection";
import StudioPlantsDragSection from "@/components/sections/studio/StudioPlantsDragSection";
import StudioTravelingSection from "@/components/sections/studio/StudioTravelingSection";
import StudioWaySection from "@/components/sections/studio/StudioWaySection";
import StudioWeDoSection from "@/components/sections/studio/StudioWeDoSection";
import React from "react";

const Studio = () => {
  return (
    <>
      <StudioHeroSection />
      <StudioWaySection />
      <StudioHomiesSection />
      <StudioLifeSection />
      <StudioPlantsDragSection />
      <StudioWeDoSection />
      <StudioTravelingSection />
      <StudioInternshipSection />
      <Footer />
    </>
  );
};

export default Studio;
