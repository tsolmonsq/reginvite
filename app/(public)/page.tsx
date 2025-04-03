"use client";

import AppDownloadSection from "@/components/sections/AppDownloadSection";
import FeatureSection from "@/components/sections/FeatureSection";
import HeroSection from "@/components/sections/HeroSection";
import InviteTemplateSection from "@/components/sections/InviteTemplateSection";
import TeamFeatureIntroSection from "@/components/sections/TeamFeatureIntroSection";
import DotDivider from "@/components/DotDivider"; 

export default function LandingPage() {

    return (
        <div className="w-full">
          <HeroSection />
          <DotDivider />
          <FeatureSection />
          <DotDivider />
          <InviteTemplateSection />
          <DotDivider />
          <TeamFeatureIntroSection />
          <DotDivider />
          <AppDownloadSection />
          <DotDivider />
        </div>
    );
}
  