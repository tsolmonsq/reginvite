"use client";

import Image from "next/image";
import AppDownloadSection from "@/components/sections/AppDownloadSection";
import FeatureSection from "@/components/sections/FeatureSection";
import InviteTemplateSection from "@/components/sections/InviteTemplateSection";
import TeamFeatureIntroSection from "@/components/sections/TeamFeatureIntroSection";
import ImageSlider from "@/components/Slideshow";
import DotDivider from "@/components/ui/assets/DotDivider";
import PublicEventSlider from "@/components/PublicEventSlider";

export default function LandingPage() {
  return (
    <div className="w-full">
      <ImageSlider
        eventName="Flower Festival"
        eventLocation="Misheel Walking Street"
        eventStartDate={new Date("2025-05-23T09:00:00")}
      />

      {/* Welcome Section with Image */}
      <div className="relative w-11/12 h-[180px] md:h-[300px] rounded-2xl overflow-hidden my-8 mx-auto px-6 md:px-12">
        {/* Background Image */}
        <Image
          src="/event_banner.webp"
          alt="Event Banner"
          fill
          className="object-cover brightness-50 rounded-2xl"
          priority
        />

        {/* Overlay Text + Button */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full text-white">
          <p className="text-center md:text-left text-lg md:text-2xl font-semibold max-w-2xl leading-relaxed">
            <span className="italic font-bold">Reginvite</span>-д тавтай морил.
            Хэрвээ та эвент зохион байгуулагч бол бид танд хамгийн
            хялбараар зочдоо урих, тэдэнд урилгаа илгээх боломжийг олгож
            байна.
          </p>
          <a
            href="/events/create"
            className="mt-6 md:mt-0 bg-[#5B9DA5] hover:bg-[#3c7680] text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            Эвент үүсгэх →
          </a>
        </div>
      </div>
      <div className="relative w-full flex justify-center">
        <PublicEventSlider  />
      </div>
      <DotDivider />
      <FeatureSection />
      <DotDivider />
      <InviteTemplateSection />
      <DotDivider />
      <AppDownloadSection />
      <DotDivider />
    </div>
  );
}
