import React from "react";
import ServicesHeroSection from "@/components/sections/services/ServicesHeroSection";
import ServicesDetailSection from "@/components/sections/services/ServicesDetailSection";
import ServicesBenefitSection from "@/components/sections/services/ServicesBenefitSection";
import Footer from "@/components/layout/Footer";

const Services = () => {
  return (
    <>
      <ServicesHeroSection />
      <ServicesDetailSection />
      <ServicesBenefitSection />
      <Footer />
    </>
  );
};

export default Services;
